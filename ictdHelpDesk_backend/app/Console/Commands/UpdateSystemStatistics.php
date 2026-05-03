<?php

namespace App\Console\Commands;

use App\Models\Feedback;
use App\Models\SystemStatistics;
use App\Models\Ticket;
use Illuminate\Console\Command;

class UpdateSystemStatistics extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:update-system-statistics';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Calculate and store daily system metrics';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $today = now()->toDateString();
        $exactTime = now()->format('l, d F Y \\a\\t h:i A');
        $todayStart = now()->startOfDay();
        $yesterdayStart = now()->subDay()->startOfDay();
        $yesterdayEnd = now()->subDay()->endOfDay();

        $totalTickets = Ticket::count();
        SystemStatistics:: updateOrCreate(
            ['metric_key' => 'total_tickets', 'recorded_at' => $today],
            ['value' => $totalTickets]
        );

        $intakeToday = Ticket::where('created_at', '>=', $todayStart)->count();
        $intakeYesterday = Ticket::whereBetween('created_at', [$yesterdayStart, $yesterdayEnd])->count();

        $ticketGrowthRate = ($intakeYesterday > 0) ? ((($intakeToday - $intakeYesterday) / $intakeYesterday) * 100) : ($intakeToday > 0 ? 100 : 0);
        SystemStatistics::updateOrCreate(
            ['metric_key' => 'ticket_volume_growth', 'recorded_at' => $today],
            ['value' => $ticketGrowthRate]
        );
        $ticketTrend = ($intakeToday - $intakeYesterday) > 0 ? 1 : (($intakeToday - $intakeYesterday) < 0 ? -1 : 0);
        SystemStatistics::updateOrCreate(
            ['metric_key' => 'ticket_growth_direction', 'recorded_at' => $today],
            ['value' =>$ticketTrend]
        );

        $allFeedbacks = Feedback::with(['feedbackResponses'])->get();
        $totalFeedbacks = $allFeedbacks->count();
        $satisfiedCount = 0;

        foreach ($allFeedbacks as $feedback) {
            $averageScore = $feedback->feedbackResponses->avg('dimension_value');
            if ($averageScore >= 4.0) {
                $satisfiedCount++;
            }
        }
        $overallRate = ($totalFeedbacks > 0) ? ($satisfiedCount / $totalFeedbacks) * 100 : 0;

        SystemStatistics::updateOrCreate(
            ['metric_key' => 'overall_satisfaction_rate', 'recorded_at' => $today],
            ['value' => $overallRate]
        );

        $todayFeedbacks = Feedback::whereDate('created_at', $today)->with('feedbackResponses')->get();
        $todayTotal = $todayFeedbacks->count();
        $todaySatisfied = 0;

        foreach ($todayFeedbacks as $feedback) {
            $averageScore = $feedback->feedbackResponses->avg('dimension_value');
            if ($averageScore >= 4.0) {
                $todaySatisfied++;
            }
        }
        $todayRate = ($todayTotal > 0) ? ($todaySatisfied / $todayTotal) * 100 : 0;
        $yesterdayFeedbacks = Feedback::whereBetween('created_at', [$yesterdayStart, $yesterdayEnd])->with('feedbackResponses')->get();
        $yesterdayTotal = $yesterdayFeedbacks->count();
        $yesterdaySatisfied = 0;
        foreach ($yesterdayFeedbacks as $feedback) {
            $averageScore = $feedback->feedbackResponses->avg('dimension_value');
            if ($averageScore >= 4.0) {
                $yesterdaySatisfied++;
            }
        }
        $yesterdayRate = ($yesterdayTotal > 0) ? ($yesterdaySatisfied / $yesterdayTotal) * 100 : 0;
        $satisfactionTrend = $todayRate - $yesterdayRate;

        SystemStatistics::updateOrCreate(
            ['metric_key' => 'satisfaction_trend', 'recorded_at' => $today],
            ['value' => $satisfactionTrend]
        );
        $satisfactionTrendDirection = $satisfactionTrend > 0 ? 1 : ($satisfactionTrend < 0 ? -1 : 0);
        SystemStatistics::updateOrCreate(
            ['metric_key' => 'satisfaction_trend_direction', 'recorded_at' => $today],
            ['value' => $satisfactionTrendDirection]
        );

        $resolvedTickets = Ticket::where('status_id', 4)->count();
        $closedTickets = Ticket::where('status_id', 5)->count();

        $backlogRate = ($totalTickets > 0) ? ($resolvedTickets / ($resolvedTickets + $closedTickets)) * 100 : 0;

        SystemStatistics::updateOrCreate(
            ['metric_key' => 'backlog_rate', 'recorded_at' => $today],
            ['value' => $backlogRate]
        );

        $yesterdayBacklogStat = SystemStatistics::where('metric_key', 'backlog_rate')
        ->where('recorded_at', now()->subDay()->toDateString())
        ->first();
        $rateYesterday = $yesterdayBacklogStat ? (float)$yesterdayBacklogStat->value : 0;
        $backlogTrend = $backlogRate - $rateYesterday;

        SystemStatistics::updateOrCreate(
            ['metric_key' => 'backlog_rate_trend', 'recorded_at' => $today],
            ['value' => $backlogTrend]
        );
        $backlogTrendDirection = $backlogTrend > 0 ? 1 : ($backlogTrend < 0 ? -1 : 0);
        SystemStatistics::updateOrCreate(
            ['metric_key' => 'backlog_rate_trend_direction', 'recorded_at' => $today],
            ['value' => $backlogTrendDirection]
        );

        $cancelledTickets = Ticket::where('status_id', 6)->count();
        $cancellationRate = ($totalTickets > 0) ? ($cancelledTickets / ($cancelledTickets + $closedTickets)) * 100 : 0;

        SystemStatistics::updateOrCreate(
            ['metric_key' => 'cancellation_rate', 'recorded_at' => $today],
            ['value' => $cancellationRate]
        );

        $yesterdayCancellationStat = SystemStatistics::where('metric_key', 'cancellation_rate')
        ->where('recorded_at', now()->subDay()->toDateString())
        ->first();
        $cancellationRateYesterday = $yesterdayCancellationStat ? (float)$yesterdayCancellationStat->value : 0;

        $cancellationTrend = $cancellationRate - $cancellationRateYesterday;
        SystemStatistics::updateOrCreate(
            ['metric_key' => 'cancellation_rate_trend', 'recorded_at' => $today],
            ['value' => $cancellationTrend]
        );
        $cancellationTrendDirection = $cancellationTrend > 0 ? 1 : ($cancellationTrend < 0 ? -1 : 0);
        SystemStatistics::updateOrCreate(
            ['metric_key' => 'cancellation_rate_trend_direction', 'recorded_at' => $today],
            ['value' => $cancellationTrendDirection]
        );

        $this->info("Successfully synced 'total_tickets' ($totalTickets) for $today at $exactTime.");
        $this->info("Successfully synced 'overall_satisfaction_rate' ($overallRate) for $today at $exactTime.");
        $this->info("Successfully synced 'backlog_rate' ($backlogRate) for $today at $exactTime.");
        $this->info("Successfully synced 'cancellation_rate' ($cancellationRate) for $today at $exactTime.");
        $this->info("Successfully synced 'ticket_volume_growth' ($ticketGrowthRate) for $today at $exactTime.");
        $this->info("Successfully synced 'ticket_growth_direction' ($ticketTrend) for $today at $exactTime.");
        $this->info("Successfully synced 'satisfaction_trend' ($satisfactionTrend) for $today at $exactTime.");
        $this->info("Successfully synced 'satisfaction_trend_direction' ($satisfactionTrendDirection) for $today at $exactTime.");
        $this->info("Successfully synced 'backlog_rate_trend' ($backlogTrend) for $today at $exactTime.");
        $this->info("Successfully synced 'backlog_rate_trend_direction' ($backlogTrendDirection) for $today at $exactTime.");
        $this->info("Successfully synced 'cancellation_rate_trend' ($cancellationTrend) for $today at $exactTime.");
        $this->info("Successfully synced 'cancellation_rate_trend_direction' ($cancellationTrendDirection) for $today at $exactTime.");


    }
}
