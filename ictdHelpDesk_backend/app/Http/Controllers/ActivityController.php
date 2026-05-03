<?php

namespace App\Http\Controllers;

use App\Http\Requests\AddActivityRequest;
use App\Models\Activity;
use Illuminate\Http\Request;
use App\Http\Resources\ActivityResource;
use App\Http\Requests\UpdateActivityRequest;

class ActivityController extends Controller
{

 public function store(AddActivityRequest $request)
    {
        $data = $request->validated();
        $activity = Activity::create($data);

        return (new ActivityResource($activity))
            ->additional(['message' => 'Activity created successfully.'])
            ->response()
            ->setStatusCode(201);
        
    }


   public function index(Request $request) 
{
    $activity = Activity::search($request->query('search', ''))
        ->query(function ($eloquentQuery) use ($request) {
            if ($request->query('status') === 'archived') {
                $eloquentQuery->onlyTrashed();
            } else {
                $eloquentQuery->withoutTrashed();
            }
            $eloquentQuery->orderBy('name', 'asc');
        })
        ->get();
    // $query = Activity::query();

    
    // if ($request->query('status') === 'archived') {
    //     $query->onlyTrashed(); 
    // } else {
    //     $query->withoutTrashed(); 
    // }

    
    // $activities = $query->get();

    // return ActivityResource::collection($activities)->additional([
    //     'success' => true,
    //     'message' => $request->query('status') === 'archived' 
    //         ? 'Archived activities retrieved successfully.' 
    //         : 'Activities retrieved successfully.',
    //     'meta' => [
    //         'total' => $activities->count(),
    //     ]
    // ]);
    return ActivityResource::collection($activity)->additional([
        'success' => true,
        'message' => $request->query('status') === 'archived' 
            ? 'Archived activities retrieved successfully.' 
            : 'Activities retrieved successfully.',
        'meta' => [
            'total' => $activity->count(),
        ]
    ]);
}

    public function show($id)
    {
        $activity = Activity::findOrFail($id);
        return (new ActivityResource($activity))
            ->additional(['message' => 'Activity retrieved successfully.']);
    }

 
    public function update(Request $request, Activity $activity)
    {
        
    }

    public function destroy($id)
    {
         $activity = Activity::findOrFail($id);

    $activity->delete();

    return response()->json([
        'success' => true,
        'message' => 'Activity moved to archive.'
    ]);
    }

    public function restore($id)
{

    $activity = Activity::withTrashed()->findOrFail($id);

    if (!$activity->trashed()) {
        return response()->json([
            'success' => false,
            'message' => 'Activity is already active.'
        ], 400);
    }

    $activity->restore();

    return response()->json([
        'success' => true,
        'message' => 'Activity restored successfully.'
    ]);
}


}


