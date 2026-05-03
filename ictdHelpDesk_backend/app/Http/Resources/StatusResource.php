<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StatusResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
        'Date'     => $this->created_at,    
        'Open'      => $this->status === 'Open' ? $this->id : 0,
        'Assigned'  => $this->status === 'Assigned' ?  $this->id : 0,
        'Responded' => $this->status === 'Responded' ?  $this->id : 0,
        'Resolved'  => $this->status === 'Resolved' ?  $this->id : 0,
        'Closed'    => $this->status === 'Closed' ? $this->id : 0,
        ];
    }
}
