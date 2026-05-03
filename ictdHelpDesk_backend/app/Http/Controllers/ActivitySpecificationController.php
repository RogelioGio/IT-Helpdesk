<?php

namespace App\Http\Controllers;

use App\Models\ActivitySpecifications;
use App\Http\Resources\ActivitySpecificationResource;
use Illuminate\Http\Request;
use App\Http\Requests\AddActivitySpecification;
use App\Http\Requests\UpdateActivity;

class ActivitySpecificationController extends Controller
{


public function index(Request $request)
{
    // Ensure this class name matches your Model file exactly!
    // $activities = ActivitySpecifications::search($request->query('search', ''))
    //     ->query(function ($eloquentQuery) use ($request) {

    //         // Handle Soft Deletes
    //         if ($request->query('status') === 'archived') {
    //             $eloquentQuery->onlyTrashed();
    //         } else {
    //             $eloquentQuery->withoutTrashed();
    //         }

    //         // Apply Sorting
    //         $eloquentQuery->orderBy('name', 'asc');
    //     })
    //     ->get();

    // return ActivitySpecificationResource::collection($activities)->additional([
    //     'success' => true,
    //     'message' => $request->query('status') === 'archived'
    //         ? 'Archived Activity Specifications retrieved successfully.'
    //         : 'Activity Specifications retrieved successfully.',
    //     'meta' => [
    //         'total' => $activities->count(),
    //     ]
    // ]);
    $activitySpecification = ActivitySpecifications::search($request->query('search', ''))->
        query(function ($eloquentQuery) use ($request) {
            if ($request->query('status') === 'archived') {
                $eloquentQuery->onlyTrashed();
            } else {
                $eloquentQuery->withoutTrashed();
            }
            $eloquentQuery->orderBy('name', 'asc');
        })
        ->take(100)
        ->get();
    return ActivitySpecificationResource::collection($activitySpecification)->additional([
        'success' => true,
        'message' => 'Activity Specifications retrieved successfully.',
        'meta' => [
            'total' => $activitySpecification->count(),
        ]
    ]);
}
    public function store(AddActivitySpecification $request)
    {
        $data = $request->validated();
        $specification = ActivitySpecifications::create($data);

        return (new ActivitySpecificationResource($specification))
            ->additional(['message' => 'Activity Specification created successfully.'])
            ->response()
            ->setStatusCode(201);

    }


    /**
     * Display the specified resource.
     */
    public function show($Id)
    {
        $specification = ActivitySpecifications::findOrFail($Id);
        return new ActivitySpecificationResource($specification);

    }


    public function update(UpdateActivity $request, $Id)
    {
        $specification = ActivitySpecifications::findOrFail($Id);
        $specification->update($request->validated());
        return (new ActivitySpecificationResource($specification))
            ->additional(['message' => 'Activity Specification updated successfully.']);
    }


    public function destroy($Id)
    {
        $specification = ActivitySpecifications::findOrFail($Id);
        $specification->delete();

        return response()->json([
            'success' => true,
            'message' => 'Activity Specification moved to archive.'
        ]);
    }

    public function restore($Id)
    {
        $specification = ActivitySpecifications::onlyTrashed()->findOrFail($Id);
        $specification->restore();

        return response()->json([
            'success' => true,
            'message' => 'Activity Specification restored successfully.'
        ]);
    }

}
