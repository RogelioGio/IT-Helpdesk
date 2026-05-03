<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceSatisfactionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "Feedbacks" => $this->FeedbackTrend,
            "FeedbackTrendSummary" => [
                "CurrentMonthServiceSatifaction" => $this->CurrentMonthServiceSatifaction,
                "TotalFeedbackCount" => $this->TotalFeedbackCount,
            ],
            "FeedbackSatisfactionBreakDown" => $this->FeedbackSatisfactionBreakDown->map(function($item){
                return [
                    "label" => $item['dimension'],
                    "rating" => round($item['average'], 2),
                ];
            }),
            "ActivitySatisfactionBreakDown" => $this->ActivitySatisfactionBreakDown->map(function($item){
                return [
                    "label" => $item['activityName'],
                    "rating" => round($item['average'], 2),
                    "breakdown" => $item['breakdown']->map(function($breakdownItem){
                        return [
                            "label" => $breakdownItem['dimension'],
                            "rating" => round($breakdownItem['average'], 2),
                        ];
                    })
                ];
            }),
            "ActivitySpecificationSatisfactionBreakDown" => $this->ActivitySpecificationSatisfactionBreakDown->map(function($item){
                return [
                    "label" => $item['activitySpecificationName'],
                    "rating" => round($item['average'], 2),
                    "breakdown" => $item['breakdown']->map(function($breakdownItem){
                        return [
                            "label" => $breakdownItem['dimension'],
                            "rating" => round($breakdownItem['average'], 2),
                        ];
                    })
                ];
            }),
            "DepartmentSatisfactionBreakDown" => $this->DepartmentSatisfactionBreakDown->map(function($item){
                return [
                    "label" => $item['officeDepartmentDivisionName'],
                    "rating" => round($item['average'], 2),
                    "breakdown" => $item['breakdown']->map(function($breakdownItem){
                        return [
                            "label" => $breakdownItem['dimension'],
                            "rating" => round($breakdownItem['average'], 2),
                        ];
                    })
                ];
            })
        ];
    }
}
