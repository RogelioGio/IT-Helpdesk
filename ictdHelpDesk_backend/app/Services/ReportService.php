<?php

namespace App\Services;
use App\Models\User;
use App\Models\Ticket;
use Illuminate\Support\Str;


class ReportService
{

protected function applyFilters($query, $filters)
{
    // 1. Status Filter
    if (!empty($filters['status_filter'])) {
        $query->where('status_id', $filters['status_filter']);
    }

    $type = $filters['filter_type'] ?? '';

    // 2. Handle DAILY
    if ($type === 'day') {
        $date = !empty($filters['date']) ? \Carbon\Carbon::parse($filters['date']) : now();
        $query->whereDate('created_at', $date);
    }

    // 3. Handle WEEKLY
    if ($type === 'weekly') {
        $week = $filters['week'] ?? now()->weekOfYear;
        // WEEK(..., 1) ensures the week starts on Monday to match your Carbon logic
        $query->whereRaw('WEEK(created_at, 1) = ?', [$week])
              ->whereYear('created_at', now()->year);
    }

    // 4. Handle MONTHLY
    if ($type === 'monthly') {
        $month = $filters['month'] ?? now()->month;
        $query->whereMonth('created_at', $month)
              ->whereYear('created_at', now()->year);
    }

    // 5. Handle Department Filter
    if (!empty($filters['department_id'])) {
        $query->whereHas('requester', function ($q) use ($filters) {
            $q->where('office_department_division_id', $filters['department_id']);
        });
    }

    return $query;
} 

public function getSummaryData($filters) {
    $query = Ticket::with(['requester.office_department_division']);

    // Handle multiple departments (Keep your existing logic)
    if (!empty($filters['department_ids'])) {
        $deptIds = is_string($filters['department_ids']) 
            ? explode(',', $filters['department_ids']) 
            : $filters['department_ids'];

        $query->whereHas('requester', function ($q) use ($deptIds) {
            $q->whereIn('office_department_division_id', $deptIds);
        });
    }

    // CRITICAL FIX: Use the applyFilters method you already wrote!
    // This will now apply $query->where('status_id', $filters['status_filter'])
    $query = $this->applyFilters($query, $filters);

    $entries = $query->get();

    return $entries->groupBy(fn($t) => $t->requester->office_department_division->name ?? 'Unassigned')
        ->map(function ($deptTickets) {
            return [
                $deptTickets->where('status_id', 1)->count(), // Open
                $deptTickets->where('status_id', 2)->count(), // Assigned
                $deptTickets->where('status_id', 3)->count(), // Responded
                $deptTickets->where('status_id', 4)->count(), // Resolved
                $deptTickets->where('status_id', 5)->count(), // Closed
                $deptTickets->where('status_id', 6)->count(), // Cancelled
                $deptTickets->count(),                        // Total (Now correctly filtered)
            ];
        });
}
public function generateReportId($reportType)
    {
        // Hard-coded mapping: If 'summary' is picked, prefix is 'TS'
        $prefix = match ($reportType) {
            'summary'     => 'TS',
            'department'  => 'DEPT',
            'cancellation' => 'CAN',
            default       => 'RPT', // Fallback prefix
        };

        $datePart = now()->format('mdy'); // 031826
        $randomPart = strtoupper(Str::random(4)); // A1B1

        return "{$prefix}-RPT-{$datePart}-{$randomPart}";
    }

public function getOfficerPerformanceData($filters)
    {
        $query = Ticket::with(['responder', 'feedback']);
        $tickets = $this->applyFilters($query, $filters)->get();
        
        $stats = [];
        foreach ($tickets as $ticket) {
            foreach ($ticket->responder as $officer) {
                $name = $officer->firstName . ' ' . $officer->lastName;
                if (!isset($stats[$name])) {
                    $stats[$name] = ['total' => 0, 'feedback' => 0];
                }
                $stats[$name]['total']++;
                if ($ticket->feedback) $stats[$name]['feedback']++;
            }
        }
        return collect($stats);
    }

public function getCancellationData($filters){
    
$query = Ticket::where('status_id', 6)->with(['cancelReasons','requester.office_department_division']);
$entries = $this->applyFilters($query, $filters)->get();
$totalCount = max($entries->count(), 1);

$byReason = $entries->flatMap->cancelReasons
            ->groupBy(fn($r) => strtoupper($r->pivot->custom_reason ?? $r->reason ?? 'UNDEFINED'))
            ->map(fn($group) => [
                'count' => $group->count(),
                'rate'  => number_format(($group->count() / $totalCount) * 100, 2) . '%'
            ]);

        // Table 2: By Department
        $byDept = $entries->groupBy(fn($t) => strtoupper($t->requester->office_department_division->name ?? 'UNKNOWN'))
            ->map(fn($group) => [
                'total'    => $group->count(),
                'resolved' => $group->filter(fn($t) => $t->cancelReasons->contains('id', 2))->count(),
                'percent'  => number_format(($group->count() / $totalCount) * 100, 2) . '%'
            ]);

            return ['reasons' => $byReason, 'departments' => $byDept];

}

//Para sa Service Satisfaction Report
public function getSatisfactionData($filters)
{
    $query = Ticket::has('feedback')->with(['feedback', 'category', 'responder']);

    // 1. Apply Officer Filter
    if (!empty($filters['officer_id'])) {
        $query->whereHas('responder', function ($q) use ($filters) {
            $q->where('users.id', $filters['officer_id']);
        });
    }

    // 2. Apply existing filters (Date, Department, etc.)
    $tickets = $this->applyFilters($query, $filters)->get();

    // 3. Process categories (Same as before)
    $categories = $tickets->groupBy('category.name')->map(function ($group, $categoryName) {
        $dimensions = ['responsiveness', 'communication', 'assurance', 'reliability', 'integrity', 'outcome'];
        
        $dimensionData = collect($dimensions)->map(function ($dim) use ($group) {
            // Accessing the feedback relationship columns
            $avg = round($group->avg(fn($t) => $t->feedback->$dim), 1);
            $pct = ($avg / 5) * 100;
            
            return [
                'name' => ucfirst($dim),
                'average' => $avg,
                'percentage' => $pct . '%',
                'interpretation' => $this->getInterpretation($pct)
            ];
        });

        // Calculate average of the percentages
        $totalPct = $dimensionData->avg(fn($d) => (float)$d['percentage']);

        return [
            'category_name' => $categoryName,
            'dimensions' => $dimensionData,
            'category_rating' => round($totalPct) . '%',
            'category_interpretation' => $this->getInterpretation($totalPct)
        ];
    })->values();

    return $categories;
}
private function getInterpretation($pct) 
    {
        return match(true) {
            $pct >= 90 => 'Excellent',
            $pct >= 80 => 'Very Good',
            $pct >= 70 => 'Good',
            $pct >= 60 => 'Fair',
            default    => 'Poor',
        };
    }


//Para sa Officer Performance Report 
public function getOfficerPerformance($filters)
{
    // Start with the User model (assuming these are the "officers")
    return User::query()
        ->whereHas('AssignedTickets', function ($query) use ($filters) {
            // Apply ticket-specific filters here
            // Example: Filter by status if provided in $filters
            if (!empty($filters['status'])) {
                $query->where('status', $filters['status']);
            }

            // Example: Filter by date range
            if (!empty($filters['from_date']) && !empty($filters['to_date'])) {
                $query->whereBetween('created_at', [$filters['from_date'], $filters['to_date']]);
            }
        })
        ->withCount(['AssignedTickets as total_tickets']) // Adds a 'total_tickets' attribute
        ->with(['AssignedTickets']) // Eager load the tickets if you need the data
        ->get();
}
public function getFlattenedSatisfactionData(array $filters)
{
    // 1. Get the raw grouped data (Assuming this method already exists in your service)
    $categories = $this->getSatisfactionData($filters);
    
    $rows = collect();

    foreach ($categories as $cat) {
        // 2. Add a 'Header Row' for the Category (e.g., "Responsiveness")
        // We use a special key 'is_category_header' so Blade can style it differently
        $rows->push([
            'label' => strtoupper($cat['category_name']),
            'values' => ['', '', ''], // Empty columns for the header row
            'is_category_header' => true
        ]);

        // 3. Add the sub-dimensions under that category
        foreach ($cat['dimensions'] as $dim) {
            $rows->push([
                'label'  => $dim['name'],
                'values' => [
                    $dim['average'],
                    $dim['percentage'] . '%',
                    $dim['interpretation']
                ],
                'is_category_header' => false
            ]);
        }
    }

    return $rows;
}
public function resolveOfficeLabel(array $filters): string
{
    $rawDepts = $filters['department_ids'] ?? [];
    
    // Ensure $deptIds is always an array
    $deptIds = is_string($rawDepts) ? explode(',', $rawDepts) : (array) $rawDepts;

    // Handle single department_id override
    if (!empty($filters['department_id'])) {
        $deptIds = [$filters['department_id']];
    }

    $count = count($deptIds);

    if ($count === 0) {
        return "All Departments";
    }

    if ($count <= 10) {
        // Fetch only the codes to keep the header concise
        return \App\Models\Office_Department_Division::whereIn('id', $deptIds)
            ->pluck('officeCode')
            ->implode(', ');
    }

    return "$count Selected Departments";
}
public function getIncidentsData(array $filters): \Illuminate\Support\Collection
{
    // 1. Fetch tickets with your specific relationship names
    $query = Ticket::with([
        'activity', 
        'activitySpecification', 
        'requester.office_department_division'
    ])
    ->whereHas('category', function ($q) {
        $q->where('name', 'Incident');
    });

    // 2. Apply your existing filter logic (Date, Dept, etc.)
    $tickets = $this->applyFilters($query, $filters)->get();

    // 3. Group by Department Name
    return $tickets->groupBy(function ($ticket) {
        return $ticket->requester->office_department_division->name ?? 'Unknown Dept';
    })->map(function ($deptTickets, $deptName) {
        
        $totalInDept = $deptTickets->count();

        // 4. Group by Activity and Specification within the Department
        $groupedItems = $deptTickets->groupBy(function ($ticket) {
            // Unique key to group identical activity + specification pairs
            return ($ticket->activity->name ?? 'N/A') . '|' . ($ticket->activitySpecification->name ?? 'N/A');
        })->map(function ($itemsInGroup) use ($totalInDept) {
            $first = $itemsInGroup->first();
            $count = $itemsInGroup->count();

            return [
                'activity'      => $first->activity->name ?? 'N/A',
                'specification' => $first->activitySpecification->name ?? 'N/A',
                'count'         => $count,
                'percentage'    => round(($count / $totalInDept) * 100) . '%'
            ];
        })->values();

        return [
            'department' => $deptName,
            'total'      => $totalInDept,
            'items'      => $groupedItems
        ];
    });
}

public function getSingleTicketData($id)
{
    // Fetch with relationships to avoid N+1 issues
    $ticket = \App\Models\Ticket::with(['assignedOfficers', 'timeline'])->findOrFail($id);

    return [
        'ticket'       => $ticket,
        'reportTitle'  => 'Ticket Details',
        'reportId'     => $ticket->ticket_no,
        'reportPeriod' => strtoupper($ticket->created_at->format('F d, Y')),
    ];
}

}