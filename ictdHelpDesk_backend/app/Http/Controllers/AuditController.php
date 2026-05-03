<?php

namespace App\Http\Controllers;

use App\Http\Resources\AuditResource;
use App\Models\Audit;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AuditController extends Controller
{
    public function index(Request $request)
    {
        $query = Audit::with(['user', 'auditable'])->latest();

        // 1. Filter by User
        $query->when($request->user_id, function ($q, $userId) {
            return $q->where('user_id', $userId);
        });

        // 2. Filter by Model Type
        $query->when($request->type, function ($q, $type) {
            $modelClass = "App\\Models\\" . ucfirst($type);
            return $q->where('auditable_type', $modelClass);
        });

        // 3. Filter by Date Range
        $query->when($request->start_date, function ($q, $startDate) {
            return $q->whereDate('created_at', '>=', Carbon::parse($startDate));
        });
        
        $query->when($request->end_date, function ($q, $endDate) {
            return $q->whereDate('created_at', '<=', Carbon::parse($endDate));
        });

        $audits = $query->paginate(15);
       
        return AuditResource::collection($audits);
    }

    public function getTicketHistory($id)
    {
        $history = Audit::where('auditable_id', $id)
            ->with('user')
            ->latest()
            ->get();

        // CHANGE: Use the Resource here too so the output matches!
        return AuditResource::collection($history);
    }
}