<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TicketSummaryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {

        $ticketVolumeBreakdown = $this->resource->status->mapWithKeys(function($item) {
            return [strtolower($item->name) => $item->tickets_count];
        });

        $ticketCriticalityBreakdown = $this->resource->criticality->mapWithKeys(function($item) {
            return [strtolower($item->name) => $item->tickets_count];
        });

        $totalPrioritizedTickets = $this->resource->criticality->sum('tickets_count');

        return
        [
            "ticketVolumeBreakdown" => [
                "open" => $ticketVolumeBreakdown->get('open', 0),
                "assigned" => $ticketVolumeBreakdown->get('assigned', 0),
                "responded" => $ticketVolumeBreakdown->get('responded', 0),
                "resolved" => $ticketVolumeBreakdown->get('resolved', 0),
                "closed" => $ticketVolumeBreakdown->get('closed', 0),
                "cancelled" => $ticketVolumeBreakdown->get('cancelled', 0),
            ],
            "ticketCriticalityBreakdown" => [
                "low" => $ticketCriticalityBreakdown->get('low', 0),
                "medium" => $ticketCriticalityBreakdown->get('medium', 0),
                "high" => $ticketCriticalityBreakdown->get('high', 0),
                "critical" => $ticketCriticalityBreakdown->get('critical', 0),
            ],
            "ticketCriticalitySummary" => [
                "totalAssignedCriticality" => $totalPrioritizedTickets,
                "notAssigned" => $totalPrioritizedTickets < $this->resource->totalTickets ? $this->resource->totalTickets - $totalPrioritizedTickets : 0,
                "criticalityAverage" => $this->resource->criticalityAverage,
            ],
            "totalTickets" => $this->resource->totalTickets,
            "departmentBreakdown" => $this ->resource->departmentBreakdown->map(function($item) {
                $notPrioritizedCount = ($item->tickets_count ?? 0) - (($item->low_count ?? 0) + ($item->medium_count ?? 0) + ($item->high_count ?? 0) + ($item->critical_count ?? 0));
                $priotized = ($item->low_count ?? 0) + ($item->medium_count ?? 0) + ($item->high_count ?? 0) + ($item->critical_count ?? 0);

                return [
                    'department' => $item->name,
                    'departmentCode' => $item->officeCode,
                    'ticketBreakdown' => [
                        'open' => $item->open_count ?? 0,
                        'assigned' => $item->assigned_count ?? 0,
                        'responded' => $item->responded_count ?? 0,
                        'resolved' => $item->resolved_count ?? 0,
                        'closed' => $item->closed_count ?? 0,
                        'cancelled' => $item->cancelled_count ?? 0,
                    ],
                    'criticalityBreakdown' => [
                        'low' => $item->low_count ?? 0,
                        'medium' => $item->medium_count ?? 0,
                        'high' => $item->high_count ?? 0,
                        'critical' => $item->critical_count ?? 0,
                        ],
                    'ticketCriticalitySummary' => [
                            'totalAssignedCriticality' => $priotized,
                            'notAssigned' => $notPrioritizedCount,
                        'criticalityAverage' => $item->tickets_count > 0 ? round((($item->low_count ?? 0) * 1 + ($item->medium_count ?? 0) * 2 + ($item->high_count ?? 0) * 3 + ($item->critical_count ?? 0) * 4) / $priotized, 2) : 0,
                    ],
                    'totalTickets' => $item->tickets_count,
                ];
            })
        ];
    }
}

// department: `Department ${i + 1}`,
//         departmentCode: `DPT${String(i + 1).padStart(3, "0")}`,
//         ticketCount,
//         averageTicketCriticality: Number((2 + Math.random() * 3).toFixed(1)),
//         ticketBreakdown: {
//             "open": open,
//             "assigned": assigned,
//             "responded": responded,
//             "resolved": resolved,
//             "closed": closed,
//             "cancelled": cancelled,
//         },
//         criticalityBreakdown: {
//             "total": total,
//             "low": low,
//             "medium": medium,
//             "high": high,
//             "critical": critical
//         }
