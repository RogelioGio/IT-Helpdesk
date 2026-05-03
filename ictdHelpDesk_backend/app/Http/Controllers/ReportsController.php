<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Http\Resources\ActivitySpecificationResource;
use App\Http\Resources\AuditResource;
use App\Http\Resources\CancellationReport;
use App\Http\Resources\IncidentDensityResource;
use App\Http\Resources\ServiceSatisfactionResource;
use App\Http\Resources\TicketResource;
use App\Http\Resources\TicketSummaryResource;
use App\Http\Resources\UserResource;
use App\Models\AccountRoles;
use App\Models\Activity;
use App\Models\ActivitySpecifications;
use App\Models\Cancellation;
use App\Models\CancelReason;
use App\Models\Feedback;
use App\Models\FeedbackDimension;
use App\Models\FeedbackResponse;
use Illuminate\Support\Facades\DB;
use App\Models\Ticket;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Office_Department_Division;
use App\Models\TicketRelevance;
use App\Models\TicketStatus;
use App\Models\TicketTimeline;
use App\Models\User;
use Carbon\Carbon;
use App\Services\ReportService;
use Illuminate\Support\Facades\Auth;
use Laravel\Mcp\Server\Annotations\Priority;
use Svg\Tag\Rect;

use function Laravel\Prompts\number;

class ReportsController extends Controller
{
protected $reportService;

    // 2. Inject it via the constructor
    public function __construct(ReportService $reportService)
    {
        $this->reportService = $reportService;
    }

public function generate(Request $request, $type, $id)
{
    // --- SINGLE TICKET LOGIC START ---
    if ($type === 'single-ticket') {
        // We use 'responder' and 'timeline' because those are the names in your Ticket model
        $ticket = Ticket::with(['responder', 'timeline', 'requester',])->findOrFail($id);

        return Pdf::loadView('reports.single_ticket', [
            'ticket'       => $ticket,
            'reportTitle'  => 'Tickets Details',
            'reportId'     => $ticket->ticketId, // Using ticketId from your $fillable
            'officeCode'   => $this->reportService->resolveOfficeLabel($request->all()),
            'reportPeriod' => strtoupper($ticket->created_at->format('F d, Y')),
        ])
        ->setPaper('a4', 'portrait')
        ->setOption(['isPhpEnabled' => true])
        ->stream();
    }



    // --- SINGLE TICKET LOGIC END ---

    // ... rest of your existing summary table code remains exactly the same ...
    $reportData = $this->getReportData($request, $type);
    $hasData = !empty($reportData['rows']) && count($reportData['rows']) > 0;

    if (($request->wantsJson() || $request->get('format') === 'json') && !$hasData) {
        return response()->json(['status' => 'empty', 'message' => 'No data found.'], 404);
    }

    return Pdf::loadView('reports.template', [
        'reportTitle'  => $reportData['title'],
        'reportId'     => $reportData['reportId'] ?? null,
        'dataTitle'    => $reportData['dataTitle'] ?? null,
        'hasData'      => $hasData,
        'reportPeriod' => (function() use ($request) {
            $type = $request->filter_type;
            $now = now();
            if ($type === 'day') {
                $date = $request->date ? \Carbon\Carbon::parse($request->date) : $now;
                return strtoupper($date->format('F d, Y'));
            }
            if ($type === 'weekly') {
                $week = $request->week ?? $now->weekOfYear;
                $start = $now->copy()->setISODate($now->year, $week)->startOfWeek();
                $end = $start->copy()->endOfWeek();
                return strtoupper($start->format('M d') . ' - ' . $end->format('M d, Y'));
            }
            if ($type === 'monthly') {
                $month = $request->month ?? $now->month;
                $start = \Carbon\Carbon::createFromDate($now->year, $month, 1);
                $isCurrentMonth = (int)$month === (int)$now->month;
                $end = $isCurrentMonth ? $now : $start->copy()->endOfMonth();
                return strtoupper($start->format('M d') . ' - ' . $end->format('M d, Y'));
            }
            return strtoupper($type ?? 'All Time');
        })(),
        'officeCode'   => $this->reportService->resolveOfficeLabel($request->all()),
        'headers'      => $reportData['headers'],
        'rows'         => $reportData['rows']
    ])
    ->setPaper('a4', 'portrait')
    ->setOption(['isPhpEnabled' => true])
    ->stream();
}

private function getReportData(Request $request, $type)
{
    return match ($type) {
        'summary' => [
            'rows'      => $this->reportService->getSummaryData($request->all()),
            'headers'   => ['Department', 'Open', 'Assigned', 'Responded', 'Resolved', 'Closed', 'Cancelled', 'Total'],
            'title'     => "Ticket Summary Report",
            'dataTitle' => "Ticket Summary Data",
            'reportId'  => $this->reportService->generateReportId('summary'),
        ],
        'performance' => [
            'rows'      => $this->reportService->getOfficerPerformanceData($request->all()),
            'headers'   => ['Officer Name', 'Total Handled', 'Feedback Count'],
            'title'     => "Officer Performance Report",
            'dataTitle' => "Officer Performance Data",
            'reportId' => $this->reportService->generateReportId('perfomance'),
        ],
        'satisfaction' => [
            'rows'      => $this->reportService->getFlattenedSatisfactionData($request->all()),
            'headers'   => ['Service Dimension', 'Average', 'Percentage', 'Interpretation'],
            'title'     => "Service Satisfaction Report",
            'dataTitle' => "Service Satisfaction Data",
            'reportId' => $this->reportService->generateReportId('satisfaction'),
        ],
        'incident_analysis' => [
        'rows'      => $this->reportService->getIncidentsData($request->all()),
        'headers'   => ['Activity Category', 'Issue Category', 'Ticket Count', 'Percentage'],
        'title'     => "Incident Analysis Report",
        'dataTitle' => "Detailed Breakdown by Department",
        'reportId'  => $this->reportService->generateReportId('incident'),
         ],
        default => abort(404),
    };

}



public function ticketsummarydata(Request $request) {
    $statuses = ['Open', 'Assigned', 'Responded', 'Resolved', 'Closed', 'Cancelled'];
    $priorities = ['Low', 'Medium', 'High', 'Critical'];



    $totalTickets = Ticket::when($request->startDate && $request->endDate, function ($query) use ($request) {
        $query->whereBetween('ticket.created_at', [$request->startDate, $request->endDate]);
    })->count();
    // Computations;
    $criticality = TicketRelevance::withCount('tickets')
    ->when($request->startDate && $request->endDate, function ($query) use ($request) {
        $query->whereHas('tickets', function ($q) use ($request) {
            $q->whereBetween('ticket.created_at', [$request->startDate, $request->endDate]);
        });
    })
    ->get();
    $criticalityLevelWeight = [
        'low' => 1,
        'medium' => 2,
        'high' => 3,
        'critical' => 4,
    ];
    $totalweighted = 0;
    $hasCriticality = 0;
    foreach($criticality as $item) {
        $name = strtolower($item->name);
        if(isset($criticalityLevelWeight[$name])) {
            $totalweighted += $criticalityLevelWeight[$name] * $item->tickets_count;
            $hasCriticality += $item->tickets_count;
        }
    }
    $criticalityAverage = $totalTickets > 0 ? round($totalweighted / $hasCriticality, 2) : 0;
    return new TicketSummaryResource((object) [
        'status' => TicketStatus::withCount('tickets')->when($request->startDate && $request->endDate, function ($query) use ($request) {
            $query->whereBetween('created_at', [$request->startDate, $request->endDate]);
        })
        ->get(),
        'criticality' => $criticality,
        'totalTickets' => $totalTickets,
        'criticalityAverage' => $criticalityAverage,
        // DepartmentList
        'departmentBreakdown' => Office_Department_Division::has('tickets')
            ->when($request->startDate && $request->endDate, function ($query) use ($request) {
                $query->whereHas('tickets', function ($q) use ($request) {
                    $q->whereBetween('ticket.created_at', [$request->startDate, $request->endDate]);
                });
            })
            ->withCount(array_merge(
            ['tickets'],
            // Status
            collect($statuses)->mapWithKeys(function($status) {
                return ["tickets as " . strtolower($status) . "_count" => function($q) use ($status) {
                    $q->whereHas('status', fn($q) => $q->where('name', $status));
                }];
            })->toArray(),
            // Priorities
            collect($priorities)->mapWithKeys(function($priority) {
                return ["tickets as " . strtolower($priority) . "_count" => function($q) use ($priority) {
                    $q->whereHas('priority', fn($q) => $q->where('name', $priority));
                }];
            })->toArray()

        ))->get(),
    ]);

}

    public function incidentdensitydata(Request $request){
        return new IncidentDensityResource((object) [
            'activities' => Activity::withCount(['tickets' => function($q) use ($request){
                $q->when($request->startDate && $request->endDate, function ($query) use ($request) {
                    $query->whereBetween('created_at', [$request->startDate, $request->endDate]);
                });
            }])->get(),
            'activitySpecificationsPerActivity' => Activity::with('activitySpecifications')
                ->when($request->startDate && $request->endDate, function ($query) use ($request) {
                    $query->whereBetween('created_at', [$request->startDate, $request->endDate]);
                })
                ->get(),
            'activitySpecifications' => ActivitySpecifications::withCount(['tickets' => function($q) use ($request){
                $q->when($request->startDate && $request->endDate, function ($query) use ($request) {
                    $query->whereBetween('created_at', [$request->startDate, $request->endDate]);
                });
            }])->get()
        ]);
    }

    public function cancellationreportdata(Request $request){
        $cancelledTickets = Cancellation::when($request->startDate && $request->endDate, function ($query) use ($request) {
            $query->whereBetween('created_at', [$request->startDate, $request->endDate]);
        })->get()->groupBy(function($item){
            return $item->created_at->format('Y-m-01');
        });

        $canlledTicketTrend = $cancelledTickets->map(function ($item, $date) {
        return [
            'date' => $date,
            'cancelled_tickets' => $item->count(),
        ];
        })->values();

        $totalTickets = Ticket::when($request->startDate && $request->endDate, function ($query) use ($request) {
            $query->whereBetween('created_at', [$request->startDate, $request->endDate]);
        })->count();
        $totalCancelled = Cancellation::when($request->startDate && $request->endDate, function ($query) use ($request) {
            $query->whereBetween('created_at', [$request->startDate, $request->endDate]);
        })->count();
        $cancellationPercent = $totalTickets > 0 ? round(($totalCancelled / $totalTickets) * 100, 2) : 0;

        $cancellReason = CancelReason::withCount(['cancellations' => function($q) use ($request) {
            $q->when($request->startDate && $request->endDate, function ($query) use ($request) {
                $query->whereBetween('created_at', [$request->startDate, $request->endDate]);
            });
        }])->get();

        $cancelledTicketsbyDepartment = Office_Department_Division::whereHas('tickets')->withCount(['tickets as cancelled_count' => function($q) {
            $q->whereHas('status', fn($q) => $q->where('name', 'Cancelled'));
        }])->get();

        $cancelledTicketsbyActivitySpecification = ActivitySpecifications::withCount(['tickets as cancelled_count' => function($q) {
            $q->whereHas('status', fn($q) => $q->where('name', 'Cancelled'));
        }])->get();

        return new CancellationReport((object) [
            "cancellationTrend" => $canlledTicketTrend,
            "totalCancelled" => $totalCancelled,
            "cancellationPercent" => $cancellationPercent,
            "cancellationReasonList" => $cancellReason,
            "cancelledTicketByDepartment" => $cancelledTicketsbyDepartment,
            'cancelledTicketByActivitySpecification' => $cancelledTicketsbyActivitySpecification,
        ]);
    }

    public function servicesatisfactiondata(Request $request){

        $now = Carbon::now();
        $feedbackCount = Feedback::when($request->startDate && $request->endDate, function($q) use ($request) {
                                    $q->whereBetween('created_at', [$request->startDate, $request->endDate]);
                                })->count();
        $feedbacks = Feedback::with('feedbackResponses')
                    ->when($request->startDate && $request->endDate, function($q) use ($request) {
                        $q->whereBetween('created_at', [$request->startDate, $request->endDate]);
                    })
                    ->get()
                    ->groupBy(function($item){
                        return $item->created_at->format('Y-m-01');
                    })
                    ->map(function ($group, $monthYear) {
                        $average = $group->flatMap->feedbackResponses->avg('dimension_value');
                        return [
                            'date' => $monthYear,
                            'serviceRating' => number_format($average, 2)
                        ];
                    })->values();
        $currentMonthFeedback = Feedback::with('feedbackResponses')
                                ->when($request->startDate && $request->endDate, function($q) use ($request) {
                                    $q->whereBetween('created_at', [$request->startDate, $request->endDate]);
                                })
                                ->get()
                                ->flatMap->feedbackResponses
                                ->avg('dimension_value');

        $feedbackBreakdown = FeedbackResponse::with('dimension')
                            ->when($request->startDate && $request->endDate, function($q) use ($request) {
                                    $q->whereBetween('created_at', [$request->startDate, $request->endDate]);
                                })
                            ->get()
                            ->groupBy(function($item){
                                return $item->dimension->dimension;
                            })->map(function ($group, $dimension) {
                                $average = $group->avg('dimension_value');
                                return [
                                    'dimension' => $dimension,
                                    'average' => $average
                                ];
                            })->values();
        $feedbackPerActivities = Feedback::with('feedbackResponses', 'ticket', 'ticket.activity')
                                ->when($request->startDate && $request->endDate, function($q) use ($request) {
                                    $q->whereBetween('created_at', [$request->startDate, $request->endDate]);
                                })
                                ->get()
                                ->groupBy(function($item){
                                    return $item->ticket->activity_id;
                                })
                                ->map(function ($group, $activityId) {
                                    $average = $group->flatMap->feedbackResponses->avg('dimension_value');
                                    $breakdown = $group->flatMap->feedbackResponses->groupBy(fn($response) => $response->dimension->dimension)->map(fn($responses, $dimension) => [
                                        'dimension' => $dimension,
                                        'average' => $responses->avg('dimension_value')
                                    ])->values();
                                    $firstEntry = $group->first();
                                    return [
                                        'activityName' => $firstEntry->ticket->activity->name ?? 'Unknown',
                                        'average' => $average,
                                        'breakdown' => $breakdown
                                    ];
                                })->values();
        $feedbackPerActivitySpecifications = Feedback::with('feedbackResponses', 'ticket', 'ticket.activitySpecification')
                                ->when($request->startDate && $request->endDate, function($q) use ($request) {
                                    $q->whereBetween('created_at', [$request->startDate, $request->endDate]);
                                })
                                ->get()
                                ->groupBy(function($item){
                                    return $item->ticket->activitySpecification_id;
                                })
                                ->map(function ($group, $activitySpecificationId) {
                                    $average = $group->flatMap->feedbackResponses->avg('dimension_value');
                                    $breakdown = $group->flatMap->feedbackResponses->groupBy(fn($response) => $response->dimension->dimension)->map(fn($responses, $dimension) => [
                                        'dimension' => $dimension,
                                        'average' => $responses->avg('dimension_value')
                                    ])->values();
                                    $firstEntry = $group->first();
                                    return [
                                        'activitySpecificationName' => $firstEntry->ticket->activitySpecification->name ?? 'Unknown',
                                        'average' => $average,
                                        'breakdown' => $breakdown
                                    ];
                                })->values();
        $feedbackPerDepartment = Feedback::with('feedbackResponses', 'ticket', 'ticket.requester')
                                ->when($request->startDate && $request->endDate, function($q) use ($request) {
                                    $q->whereBetween('created_at', [$request->startDate, $request->endDate]);
                                })
                                ->get()
                                ->groupBy(function($item){
                                    return $item->ticket->requester->office_department_division_id;
                                })
                                ->map(function ($group, $officeDepartmentDivisionId) {
                                    $average = $group->flatMap->feedbackResponses->avg('dimension_value');
                                    $breakdown = $group->flatMap->feedbackResponses->groupBy(fn($response) => $response->dimension->dimension)->map(fn($responses, $dimension) => [
                                        'dimension' => $dimension,
                                        'average' => $responses->avg('dimension_value')
                                    ])->values();

                                    $firstEntry = $group->first();

                                    return [
                                        'officeDepartmentDivisionName' => $firstEntry->ticket->requester->office_department_division->name ?? 'Unknown',
                                        'average' => $average,
                                        'breakdown' => $breakdown
                                    ];
                                })->values();

        return new ServiceSatisfactionResource((object) [
            "FeedbackTrend" => $feedbacks,
            "FeedbackSatisfactionBreakDown" => $feedbackBreakdown,
            "CurrentMonthServiceSatifaction" => round($currentMonthFeedback, 2),
            "TotalFeedbackCount" => $feedbackCount,
            "ActivitySatisfactionBreakDown" => $feedbackPerActivities,
            "ActivitySpecificationSatisfactionBreakDown" => $feedbackPerActivitySpecifications,
            "DepartmentSatisfactionBreakDown" => $feedbackPerDepartment,
        ]);
    }


    public function generate_ticketVolume(){
        $statuses = ['Open', 'Assigned', 'Responded', 'Resolved', 'Closed', 'Cancelled'];
        $priorities = ['Low', 'Medium', 'High', 'Critical'];
        $user = User::find(1);

        $totalTickets = Ticket::count();
        $statusCount = TicketStatus::withCount('tickets')->get();
        $departmentBreakdown = Office_Department_Division::has('tickets')->withCount(array_merge(
            ['tickets'],
            // Status
            collect($statuses)->mapWithKeys(function($status) {
                return ["tickets as " . strtolower($status) . "_count" => function($q) use ($status) {
                    $q->whereHas('status', fn($q) => $q->where('name', $status));
                }];
            })->toArray(),
            // Priorities
            collect($priorities)->mapWithKeys(function($priority) {
                return ["tickets as " . strtolower($priority) . "_count" => function($q) use ($priority) {
                    $q->whereHas('priority', fn($q) => $q->where('name', $priority));
                }];
            })->toArray()))->get();

        $summary = collect($statusCount)->chunk(2)->map(function($chunk){
            return $chunk->values();
        });
        $section = collect($departmentBreakdown)->chunk(20)->map(function($chunk){
            return $chunk->values();
        });

         $reportData = [
            'title' => "Ticket Volume Report",
            'reportId' => "RPT-005",
            'dataTitle1' => "Ticket Volume Summary",
            'dataTitle2' => "Ticket Volume by Department",
            'headers' => ["Department"],
            'sections' =>   $section,
            'reportPeriod' => "reportPeriod",
            'genBy' => $user->firstName . ' ' . $user->lastName,
        ];

        return Pdf::loadView('reports.template', [
                'report' => "ticketVolume",
                'reportTitle'  => $reportData['title'],
                'reportId'     => $reportData['reportId'] ?? null,
                'dataTitle1'    => $reportData['dataTitle1'] ?? null,
                'dataTitle2'    => $reportData['dataTitle2'] ?? null,
                'row1' => $summary,
                'row2' => $reportData['sections'],
                'reportPeriod' => "All Time",
                'sections' => $reportData['sections'],
                'genBy' => $reportData['genBy'],
                'headers'      => $reportData['headers'],
            ])
            ->setPaper('a4', 'portrait')
            ->setOption(['isPhpEnabled' => true])
            ->stream();
    }


    private function getInterpretation($score){
        if ($score >= 90) return 'Excellent';
        if ($score >= 70) return 'Very Good';
        if ($score >= 50) return 'Good';
        if ($score >= 30) return 'Fair';
        return 'Needs Improvement'; // A gentler way to say "Poor"
    }

    public function generate_userMastlist(Request $request){
        $generator = Auth::user();

        $users = User::query()
            ->with('office_department_division', 'account_role')
            ->when($request->account_role_id, function($q) use ($request) {
                $q->where('account_role_id', $request->account_role_id);
            })
            ->when($request->office_department_division_id, function($q) use ($request) {
                $q->where('office_department_division_id', 3);
            })
            ->when($request->startDate && $request->endDate, function($q) use ($request) {
            $q->whereBetween('created_at', [$request->startDate, $request->endDate]);
            })
            ->get();

        $data = UserResource::collection($users)->resolve();


        $ReportScope = $request->only(['period', 'startDate', 'endDate']);
        $roleName = AccountRoles::find($request->account_role_id)->name ?? 'All Roles';
        $deptName = Office_Department_Division::find($request->office_department_division_id)->name ?? 'All Departments';

        $reportData = [
            'genBy' => $generator->firstName . ' ' . $generator->lastName, // Replace 1 with the actual user ID
            'reportTitle' => "User Master List Report",
            'period' => !empty($ReportScope['period']) ? $ReportScope : "All Time",
            'reportScope' => [$roleName, $deptName],
            'tableTitle' => 'User Master List',
            'headers' => ['Employee ID', 'Full Name', 'Department/Designation' ,'Account Role'],
            "reportType" => "users",
            'data' => $data
        ];


        return Pdf::loadView('reports.report', $reportData)
         ->setPaper('a4', 'portrait')
         ->setOption(['isPhpEnabled' => true])
         ->stream('User_Master_List_Report_' . now()->format('Ymd_His') . '.pdf');
    }

    public function generate_ticketMastlist(Request $request){
        // TODO: add an DateFilter
        $generator = Auth::user();

        $tickets = Ticket::query()
            ->with('requester.office_department_division', 'priority', 'status', 'activity', 'activitySpecification')
            ->when($request->activity_id, function($q) use ($request) {
                $q->where('activity_id', $request->activity_id);
            })
            ->when($request->activitySpecification_id, function($q) use ($request) {
                $q->where('activitySpecification_id', $request->activitySpecification_id);
            })
            ->when($request->priority_id, function($q) use ($request) {
                $q->where('priority_id', $request->priority_id);
            })
            ->when($request->status_id, function($q) use ($request) {
                $q->where('status_id', $request->status_id);
            })->when($request->startDate && $request->endDate, function($q) use ($request) {
            $q->whereBetween('created_at', [$request->startDate, $request->endDate]);
            })
            ->get();
        $data = TicketResource::collection($tickets)->resolve();


        $ReportScope = $request->only(['period', 'startDate', 'endDate']);
        $activityName = Activity::find($request->activity_id)->name ?? 'All Activities';
        $specificationName = ActivitySpecifications::find($request->activitySpecification_id)->name ?? 'All Specifications';
        $priorityName = TicketRelevance::find($request->priority_id)->name ?? 'All Priorities';
        $statusName = TicketStatus::find($request->status_id)->name ?? 'All Statuses';


        $reportData = [
            'genBy' => $generator->firstName . ' ' . $generator->lastName, // Replace 1 with the actual user ID
            'reportTitle' => "Ticket Master List Report",
            'period' => !empty($ReportScope['startDate'] && !empty($ReportScope['endDate'])) ? $ReportScope : "All Time",
            'reportScope' => [$activityName, $specificationName, $priorityName . " Tickets", $statusName],
            'tableTitle' => 'Ticket Master List',
            'headers' => ['Activity Specification', 'Requester', 'Status'],
            "reportType" => "tickets",
            'data' => $data
        ];


        return Pdf::loadView('reports.report', $reportData)
         ->setPaper('a4', 'portrait')
         ->setOption(['isPhpEnabled' => true])
         ->stream();
    }

    public function generate_incident(Request $request) {
        // TODO: add an DateFilter
        // $generator = Auth::user();
        $generator = User::find(1);

        $incidents = ActivitySpecifications::with('activity')->withCount('tickets')
            ->when($request->activity_id, function($q) use ($request) {
                $q->whereHas('activity', function($q) use ($request) {
                    $q->where('id', $request->activity_id);
                });
            })->when($request->startDate && $request->endDate, function($q) use ($request) {
                $q->whereHas('tickets', function($q) use ($request) {
                    $q->whereBetween('created_at', [$request->startDate, $request->endDate]);
                });
            })
            ->get();

        $resolvedData = ActivitySpecificationResource::collection($incidents)->resolve();
        $data = collect($resolvedData)->map(function ($item, $key) use ($incidents) {
            $item['tickets_count'] = $incidents[$key]->tickets_count;
            return $item;
        })->all();

        $ReportScope = $request->only(['period', 'startDate', 'endDate']);

        $incidentSummary = Activity::withCount('tickets')->when($request->startDate && $request->endDate, function($q) use ($request) {
            $q->whereHas('tickets', function($q) use ($request) {
                $q->whereBetween('created_at', [$request->startDate, $request->endDate]);
            });
        })->get();
        $summary = collect($incidentSummary)->chunk(2)->map(function($chunk){
            return $chunk->values();
        });
        $scope = Activity::find($request->activity_id)->name ?? 'All Activities';
        $reportData = [
            'genBy' => $generator->firstName . ' ' . $generator->lastName, // Replace 1 with the actual user ID
            'reportTitle' => "Incident Density Report",
            'reportSummaryTitle' => "Incident Density Summary",
            'period' =>  (!empty($ReportScope['startDate']) && !empty($ReportScope['endDate'])) ? $ReportScope : "All Time",
            'reportScope' => [$scope],
            'tableTitle' => 'Activity Specification List',
            'headers' => ['Activity Specification', 'Counts'],
            "reportType" => "incidents",
            'data' => $data,
            'summary' => $summary
        ];

        return Pdf::loadView('reports.report', $reportData)
         ->setPaper('a4', 'portrait')
         ->setOption(['isPhpEnabled' => true])
         ->stream();
    }

    public function generate_cancelation(Request $request){
        // TODO: add an DateFilter
        // $generator = User::find(1);
        $generator = Auth::user();

        $totalTickets = Ticket::when($request->startDate && $request->endDate, function($q) use ($request) {
            $q->whereBetween('created_at', [$request->startDate, $request->endDate]);
        })->count();
        $totalCancelled = Cancellation::when($request->startDate && $request->endDate, function($q) use ($request) {
            $q->whereBetween('created_at', [$request->startDate, $request->endDate]);
        })->count();
        $cancellationPercent = $totalTickets > 0 ? round(($totalCancelled / $totalTickets) * 100, 2) : 0;

        $summary = [
            [
                "label" => "Cancellation Rate",
                "description" => "Posibility of tickets being cancelled",
                "value" => $cancellationPercent . '%'
            ],
            [
                "label" => "Total Cancelled",
                "description" => "Total number of cancelled tickets.",
                "value" => $totalCancelled
            ]
        ];

        $ReportScope = $request->only(['period', 'startDate', 'endDate']);

        $headers = [];
        $data = [];
        $tableTitle = '';

        switch($request->cancellation_report) {
            case 'cancellation_reason':
                $headers = ['Reason', 'Cancelled Tickets', 'Percentage'];
                $tableTitle = 'Cancellation by Reason';
                $reasons = CancelReason::withCount(['cancellations' => function($q) use ($request) {
                    $q->when($request->startDate && $request->endDate, function($q) use ($request) {
                        $q->whereBetween('created_at', [$request->startDate, $request->endDate]);
                    });
                }])->get();

                $data = collect($reasons)->map(function($reason) use ($totalCancelled) {
                    return [
                        'label' => $reason->reason,
                        'cancelled_tickets' => $reason->cancellations_count,
                        'percentage' => $totalCancelled > 0 ? round(($reason->cancellations_count / $totalCancelled) * 100, 2) : 0
                    ];
                })->all();
                break;

            case 'cancellation_department':
                $headers = ['Department', 'Cancelled Tickets', 'Percentage'];
                $tableTitle = 'Cancellation by Department';
                $department = Office_Department_Division::wherehas('tickets', function($q) use ($request) {
                    $q->when($request->startDate && $request->endDate, function($q) use ($request) {
                        $q->whereBetween('ticket.created_at', [$request->startDate, $request->endDate]);
                    });
                })->withCount(['tickets as cancelled_count' => function($q) use ($request) {
                    $q->whereHas('status', fn($q) => $q->where('name', 'Cancelled'));
                }])->get();


                $data = collect($department)->map(function($dept) use ($totalCancelled) {
                    return [
                        'label' => $dept->name,
                        'cancelled_tickets' => $dept->cancelled_count,
                        'percentage' => $totalCancelled > 0 ? round(($dept->cancelled_count / $totalCancelled) * 100, 2) : 0
                    ];
                })->all();
                break;
            case 'cancellation_activity_specification':
                $headers = ['Activity Specification', 'Cancelled Tickets', 'Percentage'];
                $tableTitle = 'Cancellation by Activity Specification';
                $activitySpecifications = ActivitySpecifications::withCount(['tickets as cancelled_count' => function($q) use ($request) {
                    $q->when($request->startDate && $request->endDate, function($q) use ($request) {
                        $q->whereBetween('ticket.created_at', [$request->startDate, $request->endDate]);
                    })->whereHas('status', fn($q) => $q->where('name', 'Cancelled'));
                }])->get();
                $data = collect($activitySpecifications)->map(function($spec) use ($totalCancelled) {
                    return [
                        'label' => $spec->name,
                        'cancelled_tickets' => $spec->cancelled_count,
                        'percentage' => $totalCancelled > 0 ? round(($spec->cancelled_count / $totalCancelled) * 100, 2) : 0
                    ];
                })->all();
                break;
            default:
                $headers = [];
                $data = [];
                $tableTitle = '';
                break;
        }


        $reportData = [
            'genBy' => $generator->firstName . ' ' . $generator->lastName, // Replace 1 with the actual user ID
            'reportTitle' => "Cancellation Report",
            'reportSummaryTitle' => "Cancellation Summary",
            'period' => (!empty($ReportScope['startDate']) && !empty($ReportScope['endDate'])) ? $ReportScope : "All Time",
            'tableTitle' => $tableTitle,
            'headers' => $headers,
            "reportType" => "cancellations",
            'data' => $data,
            'summary' => $summary
        ];

        return Pdf::loadView('reports.report', $reportData)
        ->setPaper('a4', 'portrait')
        ->setOption(['isPhpEnabled' => true])
        ->stream();

    }

    public function generate_volume(Request $request){
        // TODO: add an DateFilter
        //$generator = User::find(1);
        $generator = Auth::user();

        $statuses = ['Open', 'Assigned', 'Responded', 'Resolved', 'Closed', 'Cancelled'];
        $priorities = ['Low', 'Medium', 'High', 'Critical'];

        $statusCount = TicketStatus::withCount(['tickets' => function($q) use ($request) {
            $q->when($request->startDate && $request->endDate, function($q) use ($request) {
                $q->whereBetween('ticket.created_at', [$request->startDate, $request->endDate]);
            });
        }])->get();
        $summary = collect($statusCount)->chunk(2)->map(function($chunk){
            return $chunk->values();
        });

        $data = [];
        $tickets = Office_Department_Division::wherehas('tickets', function($q) use ($request) {
                    $q->when($request->startDate && $request->endDate, function($q) use ($request) {
                        $q->whereBetween('ticket.created_at', [$request->startDate, $request->endDate]);
                    });
                })->withCount(array_merge(
                    ['tickets'],
                    // Status
                    collect($statuses)->mapWithKeys(function($status) {
                        return ["tickets as " . strtolower($status) . "_count" => function($q) use ($status) {
                            $q->whereHas('status', fn($q) => $q->where('name', $status));
                        }];
                    })->toArray(),
                    // Priorities
                    collect($priorities)->mapWithKeys(function($priority) {
                        return ["tickets as " . strtolower($priority) . "_count" => function($q) use ($priority) {
                            $q->whereHas('priority', fn($q) => $q->where('name', $priority));
                        }];
                    })->toArray()
                ))->get();

        switch($request->ticketvolume_report){
            case 'status' :
                $data = $tickets->map(function ($item) use ($statuses) {
                    $breakdown = [];
                    foreach ($statuses as $status) {
                        $breakdown[] = [
                            'label' => $status,
                            'count' => $item->{strtolower($status) . '_count'} ?? 0
                        ];
                    }
                    $item->breakdown = $breakdown;
                    return $item;
                });
                break;
            case 'priority' :
                $data = $tickets->map(function ($item) use ($priorities) {
                    $breakdown = [];
                    foreach ($priorities as $priority) {
                        $breakdown[] = [
                            'label' => $priority . " Priority",
                            'count' => $item->{strtolower($priority) . '_count'} ?? 0
                        ];
                    }
                    $item->breakdown = $breakdown;
                    return $item;
                });
            break;
        }

        $ReportScope = $request->only(['period', 'startDate', 'endDate']);

        $reportData = [
            'genBy' => $generator->firstName . ' ' . $generator->lastName, // Replace 1 with the actual user ID
            'reportTitle' => "Ticket Volume Report",
            'reportSummaryTitle' => "Ticket Volume Summary",
            'period' => (!empty($ReportScope['startDate']) && !empty($ReportScope['endDate'])) ? $ReportScope : "All Time",
            'tableTitle' => "Ticket Volume by Office/Department/Division",
            'headers' => ["Office/Department/Division"],
            "reportType" => "volume",
            'data' => $data,
            'summary' => $summary
        ];

        return Pdf::loadView('reports.report', $reportData)
        ->setPaper('a4', 'portrait')
        ->setOption(['isPhpEnabled' => true])
        ->stream();
    }

    public function generate_service(Request $request){
        //$generator = User::find(1);
        $generator = Auth::user();

        $tableTitle = "";
        $data = [];
        $header = [];
        switch($request->service_report) {
            case 'activity' :
                $tableTitle = "Service Satisfaction by Activity";
                $header = ["Activity"];
                $data = Feedback::with('feedbackResponses', 'ticket', 'ticket.activity')
                        ->when($request->startDate && $request->endDate, function($q) use ($request) {
                            $q->whereBetween('created_at', [$request->startDate, $request->endDate]);
                        })->get()
                        ->groupBy(function($item){
                            return $item->ticket->activity_id;
                        })
                        ->map(function ($group, $activityId) {
                            $average = $group->flatMap->feedbackResponses->avg('dimension_value');
                            $breakdown = $group->flatMap->feedbackResponses->groupBy(fn($response) => $response->dimension->dimension)->map(fn($responses, $dimension) => [
                                'dimension' => $dimension,
                                'average' => number_format($responses->avg('dimension_value'), 2)
                            ])->values();
                            $firstEntry = $group->first();
                            return [
                                'name' => $firstEntry->ticket->activity->name ?? 'Unknown',
                                'average' => number_format($average, 2),
                                'breakdown' => $breakdown
                            ];
                        })->values();
                break;
            case 'activity_specification' :
                $tableTitle = "Service Satisfaction by Activity Specification";
                $header = ["Activity Specification"];
                $data = Feedback::with('feedbackResponses', 'ticket', 'ticket.activitySpecification')
                        ->when($request->startDate && $request->endDate, function($q) use ($request) {
                            $q->whereBetween('created_at', [$request->startDate, $request->endDate]);
                        })->get()
                        ->groupBy(function($item){
                            return $item->ticket->activitySpecification_id;
                        })
                        ->map(function ($group, $activitySpecificationId) {
                            $average = $group->flatMap->feedbackResponses->avg('dimension_value');
                            $breakdown = $group->flatMap->feedbackResponses->groupBy(fn($response) => $response->dimension->dimension)->map(fn($responses, $dimension) => [
                                'dimension' => $dimension,
                                'average' => number_format($responses->avg('dimension_value'), 2)
                            ])->values();
                            $firstEntry = $group->first();
                            return [
                                'name' => $firstEntry->ticket->activitySpecification->name ?? 'Unknown',
                                'average' => number_format($average, 2),
                                'breakdown' => $breakdown
                            ];
                        })->values();
                break;
            case 'department' :
                $tableTitle = "Service Satisfaction by Department";
                $header = ["Department"];
                $data = Feedback::with('feedbackResponses', 'ticket', 'ticket.requester.office_department_division')
                        ->when($request->startDate && $request->endDate, function($q) use ($request) {
                            $q->whereBetween('created_at', [$request->startDate, $request->endDate]);
                        })->get()
                        ->groupBy(function($item){
                            return $item->ticket->requester->office_department_division_id;
                        })
                        ->map(function ($group, $officeDepartmentDivisionId) {
                            $average = $group->flatMap->feedbackResponses->avg('dimension_value');
                            $breakdown = $group->flatMap->feedbackResponses->groupBy(fn($response) => $response->dimension->dimension)->map(fn($responses, $dimension) => [
                                'dimension' => $dimension,
                                'average' => number_format($responses->avg('dimension_value'), 2)
                            ])->values();
                            $firstEntry = $group->first();
                            return [
                                'name' => $firstEntry->ticket->requester->office_department_division->name ?? 'Unknown',
                                'average' => number_format($average, 2),
                                'breakdown' => $breakdown
                            ];
                        })->values();
                break;
        }
        $summary = [
                [
                    "label" => "Total Feedback Count",
                    "description" => "Given feedback within the time period.",
                    "value" => Feedback::when($request->startDate && $request->endDate, function($q) use ($request) {
                        $q->whereBetween('created_at', [$request->startDate, $request->endDate]);
                    })->count()
                ],
                [
                    "label" => "Overall Service Satisfaction Rating",
                    "description" => "Average rating across all feedback.",
                    "value" => number_format(Feedback::when($request->startDate && $request->endDate, function($q) use ($request) {
                        $q->whereBetween('created_at', [$request->startDate, $request->endDate]);
                    })->with('feedbackResponses')->get()->flatMap->feedbackResponses->avg('dimension_value'), 2) . " / 5"
                ]
        ];
        $breakdown = FeedbackResponse::with('dimension')
                    ->when($request->startDate && $request->endDate, function($q) use ($request) {
                        $q->whereHas('feedback', function($q) use ($request) {
                            $q->whereBetween('created_at', [$request->startDate, $request->endDate]);
                        });
                    })
                    ->get()
                    ->groupBy(function($item){
                        return $item->dimension->dimension;
                    })->map(function ($group, $dimension) {
                        $average = $group->avg('dimension_value');
                        return [
                            'label' => $dimension,
                            'value' => number_format($average, 2),
                        ];
                    })->values();

        $ReportScope = $request->only(['period', 'startDate', 'endDate']);
        $reportData = [
            'genBy' => $generator->firstName . ' ' . $generator->lastName, // Replace 1 with the actual user ID
            'reportTitle' => "Service Satisfaction Report",
            'reportSummaryTitle' => "Satisfaction Summary",
            'breakdownTitle' => "Satisfaction Breakdown",
            'period' => (!empty($ReportScope['startDate']) && !empty($ReportScope['endDate'])) ? $ReportScope : "All Time",
            'tableTitle' => $tableTitle,
            'headers' => $header,
            "reportType" => "service",
            'data' => $data,
            'summary' => $summary,
            'breakdown' => $breakdown
        ];

        return Pdf::loadView('reports.report', $reportData)
        ->setPaper('a4', 'portrait')
        ->setOption(['isPhpEnabled' => true])
        ->stream();
    }

    public function generate_performance(Request $request){
        //$generator = User::find(1);

        $generator = Auth::user();

        $officer = new UserResource(User::find($request->officer_id))->resolve();
        $summary = $officer;

        $feedbacks = User::find($request->officer_id)->AssignedTickets->flatMap(function($ticket) {
            return $ticket->feedback ? $ticket->feedback->feedbackResponses : [];
        });
        $feedbackRatings = $feedbacks->groupBy(function($item){
            return $item->dimension->dimension;
        })->map(function ($group, $dimension) {
            $average = $group->avg('dimension_value');
            $percentage = ($average / 5) * 100;
            return [
                'label' => $dimension,
                'value' => number_format($average, 2),
                'percentage' => number_format($percentage, 2),
                'interpretation' => $this->getInterpretation($percentage)
            ];
        })->values();

        $overallAvg = $feedbackRatings->avg('value');
        $overallPercentage = ($feedbackRatings->sum('percentage') / 6);

        $overAllTotal = [
            'label' => 'Overall Performance',
            'value' => number_format($overallAvg, 2),
            'percentage' => number_format($overallPercentage, 2),
            'interpretation' => $this->getInterpretation($overallPercentage)
        ];
        $breakdown = $feedbackRatings->push($overAllTotal);

        $data = User::with(['AssignedTickets.feedback'])->find($request->officer_id)->AssignedTickets->pluck('feedback')->filter()->reduce(function ($carry, $fb) {
            if ($fb->suggestion)   $carry['suggestions'][]   = $fb->suggestion;
            if ($fb->commendation) $carry['commendations'][] = $fb->commendation;
            if ($fb->complaint)    $carry['complaints'][]    = $fb->complaint;

            return $carry;
        }, [
            'suggestions' => [],
            'commendations' => [],
            'complaints' => []
        ]);
        $ReportScope = $request->only(['period', 'startDate', 'endDate']);

        $reportData = [
            'genBy' => $generator->firstName . ' ' . $generator->lastName, // Replace 1 with the actual user ID
            'reportTitle' => "Officer Performance Report",
            'reportSummaryTitle' => "Officer Information",
            'breakdownTitle' => "Officer Performance Breakdown",
            'period' => !empty($ReportScope['period']) ? $ReportScope : "All Time",
            'tableTitle' => "Suggestion, Commendation, and Complaints",
            'headers' => [],
            'breakdownHeader' => ['Dimension', 'Average Score', 'Percentage', 'Interpretation'],
            "reportType" => "performance",
            'data' => $data,
            'summary' => $summary,
            'breakdown' => $breakdown
        ];

        return Pdf::loadView('reports.report', $reportData)
        ->setPaper('a4', 'portrait')
        ->setOption(['isPhpEnabled' => true])
        ->stream();
    }

    public function generate_audit(Request $request){
        //$generator = User::find(1);

        $generator = Auth::user();

        $user = User::find($request->user_id);
        $resolvedUser = new UserResource($user)->resolve();
        $resolvedUser['totalActivity'] = $user->audit()->count();
        $summary = $resolvedUser;

        $auditLogs = $user->audit()->with('auditable')->get();
        $data = AuditResource::collection($auditLogs)->resolve();

        $ReportScope = $request->only(['period', 'startDate', 'endDate']);

        $reportData = [
            'genBy' => $generator->firstName . ' ' . $generator->lastName, // Replace 1 with the actual user ID
            'reportTitle' => "User Activity Audit Report",
            'reportSummaryTitle' => "User Information",
            'period' => !empty($ReportScope['period']) ? $ReportScope : "All Time",
            'tableTitle' => "Activity Log",
            'headers' => ["Timestamp", "Resource", "Action", "Context"],
            "reportType" => "audit",
            'data' => $data,
            'summary' => $summary,
        ];

        return Pdf::loadView('reports.report', $reportData)
        ->setPaper('a4', 'portrait')
        ->setOption(['isPhpEnabled' => true])
        ->stream();

    }

    public function generate_assignment(Request $request){
        $generator = Auth::user();

        $officer = new UserResource(User::find($request->officer_id))->resolve();
        $summary = $officer;

        $assignedTickets = User::find($request->officer_id)->AssignedTickets()->get();
        $data = TicketResource::collection($assignedTickets)->resolve();

        $reportData = [
            'genBy' => $generator->firstName . ' ' . $generator->lastName, // Replace 1 with the actual user ID
            'reportTitle' => "Ticket Assignment Report",
            'reportSummaryTitle' => "Officer Information",
            'period' => !empty($ReportScope['period']) ? $ReportScope : "All Time",
            'tableTitle' => "Ticket Assignments",
            'headers' => ['Activity Specification', 'Requester', 'Status'],
            "reportType" => "assignment",
            'data' => $data,
            'summary' => $summary,
        ];


        return Pdf::loadView('reports.report', $reportData)
        ->setPaper('a4', 'portrait')
        ->setOption(['isPhpEnabled' => true])
        ->stream();
    }

}

