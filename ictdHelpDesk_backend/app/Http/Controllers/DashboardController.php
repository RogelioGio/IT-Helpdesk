<?php

namespace App\Http\Controllers;

use App\Http\Resources\DashboardHeaderStatistics;
use App\Http\Resources\TicketResource;
use App\Http\Resources\TicketVolumeStatistics;
use App\Models\Feedback;
use App\Models\SystemStatistics;
use App\Models\Ticket;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function dashboardinitialze()
    {
        $today = now()->toDateString();

        $stats = SystemStatistics::where('recorded_at', $today)
            ->whereIn('metric_key', [
                    'total_tickets',
                    'overall_satisfaction_rate',
                    'backlog_rate',
                    'cancellation_rate',
                    'ticket_volume_growth',
                    'ticket_growth_direction',
                    'satisfaction_trend',
                    'satisfaction_trend_direction',
                    'backlog_rate_trend',
                    'backlog_rate_trend_direction',
                    'cancellation_rate_trend',
                    'cancellation_rate_trend_direction'])
            ->get();

        return new DashboardHeaderStatistics($stats);
    }

    public function testdata()
    {
        // $allfeedbacks = Feedback::with(['requester', 'feedbackResponses.dimension', 'ticket'])->get();

        // $total_feedbacks = $allfeedbacks->count();
        // $statifiedUsers = 0;

        // $dividedFeedbacksPerActivitySpecification = $allfeedbacks->groupBy(function ($feedback) {
        //     return $feedback->ticket->activitySpecification ? $feedback->ticket->activitySpecification->name : 'Uncategorized';
        // });

        // $breakdownPerActivitySpecification = $dividedFeedbacksPerActivitySpecification->map(function ($feedbacks, $activitySpec) use (&$statifiedUsers) {
        //     $count = $feedbacks->count();
        //     $statisfied = 0;

        //     foreach ($feedbacks as $feedback) {
        //         $averageRating = $feedback->feedbackResponses->avg('dimension_value');
        //         if ($averageRating >= 4) {
        //             $statisfied++;
        //             $statifiedUsers++;
        //         }
        //     }

        //     return [
        //         'activity_specification' => $activitySpec,
        //         'total_feedbacks' => $count,
        //         'satisfied_users' => $statisfied,
        //         'satisfaction_rate' => $count > 0 ? ($statisfied / $count) * 100 : 0,
        //     ];
        // });

        // $overallSatisfactionRate = $total_feedbacks > 0 ? ($statifiedUsers / $total_feedbacks) * 100 : 0;


        // return response()->json([
        //     'total_feedbacks' => $total_feedbacks,
        //     'satisfied_users' => $statifiedUsers,
        //     'breakdown' => $breakdownPerActivitySpecification,
        //     'overall_satisfaction_rate' => $overallSatisfactionRate
        // ]);

        $allTickets = Ticket::with(['timeline'])->get();
        $resolvedTickets = $allTickets->where('status_id', 4)->count();
        $closedTickets = $allTickets->where('status_id', 5)->count();

        return TicketResource::collection($allTickets)->additional([
            'resolved_tickets' => $resolvedTickets,
            'closed_tickets' => $closedTickets,
        ]);
    }
}

