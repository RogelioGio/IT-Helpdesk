<?php
use App\Http\Controllers\Api\SearchController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AccountRoleController;
use App\Http\Controllers\OfficeDepartmentController;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\ActivitySpecificationController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\AuditController;
use App\Http\Controllers\AssignmentController;
use App\Http\Controllers\CancelReasonTicket;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\RemarkController;
use App\Http\Controllers\ReportsController;
use App\Models\CancelReason;
use App\Models\Ticket;
use Illuminate\Support\Facades\Broadcast;
use Laravel\Mcp\Enums\Role;

Route::post('/login', [AuthController::class, 'login']);
// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);


    Route::get('users/role/{roleID}', [UserController::class, 'userPerRole']);
    Route::get('responders', [UserController::class, 'getResponders']);

    Route::get('users/archive', [UserController::class, 'archived']);
    Route::post('users/{id}/restore', [UserController::class, 'restore']);
    Route::delete('users/{id}/force', [UserController::class, 'forceDelete']);
    Route::post('users/{id}/reset-password', [UserController::class, 'resetPassword']);
    Route::delete('users/bulk-archive', [UserController::class, 'bulkDestroy']);
    Route::post('users/bulk-restore', [UserController::class, 'bulkRestore']);
    Route::post('', [UserController::class,'']);
    Route::apiResource('users', UserController::class);


    Route::apiResource('departments', OfficeDepartmentController::class);
    Route::post('departments/{id}/restore', [OfficeDepartmentController::class, 'restore']);
    Route::get('/offices', [OfficeDepartmentController::class, 'index']);
    Route::get('roles', [AccountRoleController::class, 'index']);
    Route::get('roles/{id}', [AccountRoleController::class, 'show']);

    Route::delete('tickets/bulk-delete', [TicketController::class, 'bulkDelete']);
    Route::post('tickets/bulk-restore', [TicketController::class, 'bulkRestore']);
    Route::apiResource('tickets', TicketController::class);
    Route::patch('tickets/{ticket}/priority',[TicketController::class, 'patchTicketCriticalLevel']);

    Route::apiResource('activities', ActivityController::class);
    Route::apiResource('activitiesSpeciefications', ActivitySpecificationController::class);
    });






    //users
    Route::delete('users/bulk-archive', [UserController::class, 'bulkDestroy']);
    Route::post('users/bulk-restore', [UserController::class, 'bulkRestore']);
    Route::post('users/{id}/restore', [UserController::class, 'restore']);
    Route::apiResource('users', UserController::class);
    //tickets
    Route::get('tickets/recent', [TicketController::class, 'recentCreated']);
    Route::patch('tickets/{ticket}/assign', [TicketController::class, 'patchTicketAssignment']);
    Route::patch('tickets/{ticket}/responded', [TicketController::class, 'patchTicketResponded']);
    Route::patch('tickets/{ticket}/resolve', [TicketController::class, 'patchTicketResolved']);
    Route::patch('tickets/{ticket}/close', [TicketController::class, 'closeTicket']);
    Route::patch('tickets/{ticket}/cancel', [TicketController::class, 'cancelTicket']);
    Route::post('/tickets/{ticket}/request', [AssignmentController::class, 'requestAssignment']);
    Route::post('/assignments/{assignment}/accept', [AssignmentController::class, 'accept']);
    Route::post('/assignments/{assignment}/reject', [AssignmentController::class, 'reject']);
    Route::apiResource('assignments', AssignmentController::class);
    Route::post('tickets/bulk-restore', [TicketController::class, 'bulkRestore']);
    Route::delete('tickets/bulk-delete', [TicketController::class, 'bulkDelete']);
    Route::get('/tickets/recent/view', [TicketController::class, 'getRecentTickets']);
    Route::get('/tickets/{id}/history', [AuditController::class, 'getTicketHistory']);
    Route::apiResource('tickets', TicketController::class);

    Route::apiResource('departments', OfficeDepartmentController::class);
    Route::get('/search/tickets', [TicketController::class, 'search']);
    Route::get('/search/users', [UserController::class, 'search']);
    Route::get('/activityspecs', [ActivitySpecificationController::class]);
    //activities
    Route::get('/audit-trail', [AuditController::class, 'index']);
    Route ::post('activities/{id}/restore', [ActivityController::class,'restore']);
    Route::apiResource('activities', ActivityController::class);
    Route::post('activitiesSpecifications/{id}/restore', [ActivitySpecificationController::class,'restore']);
    Route::apiResource('activitiesSpecifications', ActivitySpecificationController::class);


    Route::get('/report/{type}', [ReportsController::class, 'generate']);
    Route::post('tickets/{ticket}/feedback', [FeedbackController::class, 'handleSubmit']);
    Route::get('tickets/{ticket}/getFeedback', [FeedbackController::class, 'getFeedback']);

    Route::get('/feedback/dimensions', [FeedbackController::class, 'getDimensions']);
    // Route::get('/reports/latest-status', [ReportsController::class, 'getLatestStatus']);

    Route::get('/officer/tickets', [TicketController::class, 'officerTicket']);
    Route::get('/user/tickets', [TicketController::class, 'userTickets']);

    Route::apiResource('/cancel-reasons', CancelReasonTicket::class);

    Route::get('/dashboard/initialize', [DashboardController::class, 'dashboardinitialze']);
    Route::get('/dashboard/testdata', [DashboardController::class, 'testdata']);

    Route::apiResource('/remarks', RemarkController::class);
    Route::apiResource('/notifications', NotificationController::class);
    Route::post('/notifications/read', [NotificationController::class, 'read']);

    Route::post('/ticket-summary', [ReportsController::class, 'ticketsummarydata']);
    Route::post('/incident-density', [ReportsController::class, 'incidentdensitydata']);
    Route::post('/cancellation-report', [ReportsController::class, 'cancellationreportdata']);
    Route::post('/service-satisfaction', [ReportsController::class, 'servicesatisfactiondata']);

    Route::post('gen/user', [ReportsController::class, 'generate_userMastlist']);
    Route::post('gen/ticket', [ReportsController::class, 'generate_ticketMastlist']);
    Route::post('gen/incident', [ReportsController::class, 'generate_incident']);
    Route::post('gen/cancellation', [ReportsController::class, 'generate_cancelation']);
    Route::post('gen/volume', [ReportsController::class, 'generate_volume']);
    Route::post('gen/service', [ReportsController::class, 'generate_service']);
    Route::post('gen/performance', [ReportsController::class, 'generate_performance']);
    Route::post('gen/assignment', [ReportsController::class, 'generate_assignment']);
    Route::post('gen/audit', [ReportsController::class, 'generate_audit']);

    Route::get('gen/ticket/{type}/{id}' , [ReportsController::class, 'generate']);

    Route::get('gen/test', [ReportsController::class, 'testpaperToPrint']);


