<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class DashboardHeaderStatistics extends ResourceCollection
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return $this->collection->mapWithKeys(function ($item) {
            return [
                $item->metric_key => [
                    'value' => $item->value,
                    'last_updated' => $item->updated_at->diffForHumans(),
                    'recorded' => $item->updated_at,
                ],
            ];
        })->all();

    }
}
// namespace App\Http\Resources;

// use Illuminate\Http\Request;
// // Change JsonResource to ResourceCollection
// use Illuminate\Http\Resources\Json\ResourceCollection;

// class DashboardHeaderStatistics extends ResourceCollection
// {
//     public function toArray(Request $request): array
//     {
//         // Now $this->collection is available!
//         return $this->collection->mapWithKeys(function ($item) {
//             return [
//                 $item->metric_key => [
//                     'value' => $item->value,
//                     'last_updated' => $item->updated_at->diffForHumans(),
//                     'recorded' => $item->updated_at,
//                 ],
//             ];
//         })->all();
//     }
// }
