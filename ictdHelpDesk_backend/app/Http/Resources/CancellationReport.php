<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CancellationReport extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "cancellation_data" => $this->resource->cancellationTrend->map(function ($item) {
                return [
                    "date" => $item["date"],
                    "cancelled_tickets" => $item["cancelled_tickets"]
                ];
            }),
            "cancellation_data_summary" => [
                "total_cancelled" => $this->resource->totalCancelled,
                "cancellation_percent" => $this->resource->cancellationPercent
            ],
            "cancellation_reason_data" =>  $this->resource->cancellationReasonList->map(function($item) {
                    return [
                        "id" => $item->id,
                        "reason" => $item->reason,
                        "cancelled_tickets_count" => $item->cancellations_count,
                        "percentage" => $this->resource->totalCancelled > 0 ? round(($item->cancellations_count / $this->resource->totalCancelled) * 100, 2) : 0
                    ];
            }),
            "cancelledTicketByDepartment" => $this->resource->cancelledTicketByDepartment->map(function($item) {
                return [
                    "id" => $item->id,
                    "name" => $item->name,
                    'officeCode' => $item->officeCode,
                    "cancelled_tickets_count" => $item->cancelled_count,
                    "percentage" => $this->resource->totalCancelled > 0 ? round(($item->cancelled_count / $this->resource->totalCancelled) * 100, 2) : 0
                ];
            }),
            "cancelledTicketByActivitySpecification" => $this->resource->cancelledTicketByActivitySpecification->map(function($item) {
                return [
                    "id" => $item->id,
                    "name" => $item->name,
                    "cancelled_tickets_count" => $item->cancelled_count,
                    "percentage" => $this->resource->totalCancelled > 0 ? round(($item->cancelled_count / $this->resource->totalCancelled) * 100, 2) : 0
                ];
            }),
        ];
    }
}
