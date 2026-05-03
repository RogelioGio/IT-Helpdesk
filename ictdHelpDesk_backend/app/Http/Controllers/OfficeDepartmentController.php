<?php

namespace App\Http\Controllers;

use App\Http\Requests\AddOfficeDepartmentDivisionRequest;
use App\Http\Resources\OfficeResource; // Import the Resource
use App\Models\Office_Department_Division;
use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Resources\UserResource;
class OfficeDepartmentController extends Controller
{
public function index(Request $request)
{
    $departments = Office_Department_Division::search($request->query('search', ''))
        ->when($request->filled('officeCode'), function($scoutQuery) use ($request) {
            $scoutQuery->where('officeCode', $request->officeCode);
        })
        ->when($request->filled('account_role_id') && $request->account_role_id !== 'all', function($scoutQuery) use ($request) {
            $scoutQuery->where('account_role_id', $request->account_role_id);
        })
        ->query(function($eloquentQuery) use ($request) {
            if ($request->query('status') === 'archived') {
                $eloquentQuery->onlyTrashed();
            } else {
                $eloquentQuery->withoutTrashed();
            }

            $eloquentQuery->orderBy('name', 'asc');
        })
        ->get();

    return OfficeResource::collection($departments)->additional([
        'success' => true,
    ]);
}

    public function store(AddOfficeDepartmentDivisionRequest $request)
    {
        $data = $request->validated();
        $office = Office_Department_Division::create($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Created successfully',
            'data'   => new OfficeResource($office) // Wrap in Resource
        ], 201);
    }

    public function show($id)
    {
        $office = Office_Department_Division::withTrashed()->findOrFail($id);
        // Return single resource
        return new OfficeResource($office);
    }

    public function update(Request $request, $id)
    {
        $office = Office_Department_Division::findOrFail($id);

        $data = $request->validate([
            'officeCode'  => 'sometimes|required|string|unique:office_department_division,officeCode,' . $id,
            'name'        => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $office->update($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Updated successfully',
            'data'   => new OfficeResource($office) // Wrap in Resource
        ]);
    }

    public function destroy($id)
    {
        $office = Office_Department_Division::findOrFail($id);
        $office->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Office archived successfully'
        ]);
    }

    public function restore($id)
    {
        $office = Office_Department_Division::withTrashed()->findOrFail($id);
        $office->restore();

        return response()->json([
            'status' => 'success',
            'message' => 'Office restored successfully',
            'data'   => new OfficeResource($office)
        ]);
    }

    public function force(Request $request, $id)
    {
        $office = Office_Department_Division::withTrashed()->findOrFail($id);
        $office->forceDelete();

        return response()->json([
            'status' => 'success',
            'message' => 'Office permanently deleted successfully'
        ]);
    }

}
