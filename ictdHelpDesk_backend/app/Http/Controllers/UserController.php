<?php

namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Requests\AddUserRequest;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\Ticket;
use App\Notifications\TicketCreated;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;

class UserController extends Controller
{

    public function store(AddUserRequest $request)
    {
        $data = $request->validated();
        $data['password'] = Hash::make($data['password']);
        $user = User::create($data);

        return (new UserResource($user))
            ->additional(['message' => 'User created successfully.'])
            ->response()
            ->setStatusCode(201);
    }

    public function index(Request $request)
    {

        $paginate = $request->query('per_page', 10);

        $users = User::search($request->query('search', ''))
            ->when($request->office_department_division_id && $request->office_department_division_id !== 'all', function($scoutQuery) use ($request) {
                $scoutQuery->where('office_department_division_id', $request->office_department_division_id);
            })
            ->when($request->account_role_id && $request->account_role_id !== 'all', function($scoutQuery) use ($request) {
                $scoutQuery->where('account_role_id', $request->account_role_id);
            })
            ->query(
                function($eloquentQuery) {
                    $eloquentQuery->with(['office_department_division', 'account_role'])->withTrashed();
                }
            )->where('account_role_id', '!=', 1)
            ->paginate($paginate);

            $total = (int) collect($users->total())->first();
            $lastPage = (int) collect($users->lastPage())->first();
            $currentPage = (int) collect($users->currentPage())->first();

        return UserResource::collection($users)->additional([
            'success' => true,
            'meta' => [
                'total' => $total,
                'last_page' => $lastPage,
                'current_page' => $currentPage,
            ]
        ]);
    }

    public function search(Request $request)
    {
        $searchTerm = $request->query('query', '');

        $user = User::search($searchTerm)->get();

        return UserResource::collection($user)->additional([
            'success' => true,
            'message' => 'Search results retrieved.',
            'meta'    => [
                'total' => $user->count(),
            ]
        ]);
    }

public function show(Request $request, $id)
{
    // 1. Identifying requested includes from the URL
    $includes = explode(',', $request->query('include', ''));

    // 2. Fetch the user with their base relationships
    $user = User::withTrashed()
        ->with(['office_department_division', 'account_role'])
        // Load the tickets only if requested in Postman
        ->when(in_array('tickets', $includes), function ($query) {
            $query->with(['AssignedTickets' => function($q) {
                // As an admin, you might want to see even the soft-deleted assignments
                $q->withTrashed();
            }]);
        })
        ->findOrFail($id);

    return (new UserResource($user))->additional([
        'success' => true,
        'message' => 'User and assigned tickets retrieved successfully.'
    ]);
}

    public function update(UpdateUserRequest $request, $id)
    {
        $user = User::withTrashed()->findOrFail($id);
        $data = $request->validated();

        if ($request->filled('password')) {
            $data['password'] = Hash::make($data['password']);

        } else {
            unset($data['password']);
        }

        $user->update($data);

        return (new UserResource($user))
            ->additional(['message' => 'User updated successfully.']);
    }

 public function destroy($id)
{

    $user = User::findOrFail($id);

    $user->delete();

    return response()->json([
        'success' => true,
        'message' => 'User moved to archive.'
    ]);
}


public function restore($id)
{

    $user = User::withTrashed()->findOrFail($id);

    if (!$user->trashed()) {
        return response()->json([
            'success' => false,
            'message' => 'User is already active.'
        ], 400);
    }

    $user->restore();

    return response()->json([
        'success' => true,
        'message' => 'User restored successfully.'
    ]);
}

// public function forceDelete($id)
// {

//     $user = User::withTrashed()->findOrFail($id);


//     if (!$user->trashed()) {
//         return response()->json([
//             'success' => false,
//             'message' => 'Only archived users can be permanently deleted.'
//         ], 400);
//     }

//     $user->forceDelete();

//     return response()->json([
//         'success' => true,
//         'message' => 'User permanently deleted from the system.'
//     ]);
// }

public function resetPassword($id)
{
    $user = User::findOrFail($id);
    $newPassword = 'lra@123'; // default password for reset
    $user->password = Hash::make($newPassword);
    $user->save();

    return response()->json([
        'success' => true,
        'message' => 'User password has been reset.',
        'new_password' => $newPassword
    ]);


}

    public function userPerRole($roleID){
        $officers = User::whereHas('account_role', function($query) use ($roleID) {
            $query->where('id', $roleID);
        })->get();

        return UserResource::collection($officers)->additional([
            'success' => true,
            'meta'    => [
                'total' => $officers->count(),
            ]
        ]);
    }

    public function getResponders(Request$request)
    {
        $responders = User::whereHas('account_role', function($query) {
            $query->whereIn('id', [3, 4]); // Assuming 'Responder' has ID 2, 'Officer' has ID 3, 'Admin' has ID 4, and 'Super Admin' has ID 5
        })
        ->when($request->account_role_id && $request->account_role_id !== 'all', function($query) use ($request) {
            $query->where('account_role_id', $request->account_role_id);
        })
        ->get();

        return UserResource::collection($responders)->additional([
            'meta'    => [
                'total' => $responders->count(),
            ]
        ]);
    }
public function bulkDestroy(Request $request) {
    $request->validate([
        'ids' => 'required|array', // Ensure this matches your Postman key
        'ids.*' => 'exists:users,id',
    ]);

    // Use a safety check for the current user
    $currentUser = $request->user();
    $idsToArchive = array_filter($request->ids, function($id) use ($currentUser) {
        return $currentUser ? $id != $currentUser->id : true;
    });

    User::whereIn('id', $idsToArchive)->delete();
    return response()->json(['success' => true, 'message' => 'Users archived.']);
}

public function bulkRestore(Request $request)
{
    $request->validate([
        'ids' => 'required|array',
        'ids.*' => 'exists:users,id',
    ]);

    // We use withTrashed() to find the users who are currently archived
    $usersToRestore = User::withTrashed()->whereIn('id', $request->ids);

    $count = $usersToRestore->count();

    if ($count === 0) {
        return response()->json([
            'success' => false,
            'message' => 'No archived users found for the provided IDs.'
        ], 404);
    }

    $usersToRestore->restore();

    return response()->json([
        'success' => true,
        'message' => "Successfully restored {$count} users."
    ]);
}

// Test function to send notification to user
    public function NotificateUser() {
        $ticket = Ticket::first(); // Get the first ticket for testing

       $targets = User::all(); // Get all users to notify

        foreach ($targets as $user) {
            $user->notify(new TicketCreated($ticket, $user));
        }
    }


}


