<?php

// @formatter:off
// phpcs:ignoreFile
/**
 * A helper file for your Eloquent Models
 * Copy the phpDocs from this file to the correct Model,
 * And remove them from this file, to prevent double declarations.
 *
 * @author Barry vd. Heuvel <barryvdh@gmail.com>
 */


namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property string $description
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string|null $deleted_at
 * @method static \Database\Factories\AccountRolesFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountRoles newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountRoles newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountRoles query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountRoles whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountRoles whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountRoles whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountRoles whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountRoles whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountRoles whereUpdatedAt($value)
 */
	class AccountRoles extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $activityCode
 * @property string $name
 * @property string $description
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ActivitySpecifications> $activitySpecifications
 * @property-read int|null $activity_specifications_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Audit> $audits
 * @property-read int|null $audits_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Activity newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Activity newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Activity onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Activity query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Activity whereActivityCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Activity whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Activity whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Activity whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Activity whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Activity whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Activity whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Activity withTrashed(bool $withTrashed = true)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Activity withoutTrashed()
 */
	class Activity extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $activitySpecificationCode
 * @property string $name
 * @property string $description
 * @property int $activity_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read \App\Models\Activity $activity
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Audit> $audits
 * @property-read int|null $audits_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivitySpecifications newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivitySpecifications newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivitySpecifications onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivitySpecifications query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivitySpecifications whereActivityId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivitySpecifications whereActivitySpecificationCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivitySpecifications whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivitySpecifications whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivitySpecifications whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivitySpecifications whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivitySpecifications whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivitySpecifications whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivitySpecifications withTrashed(bool $withTrashed = true)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivitySpecifications withoutTrashed()
 */
	class ActivitySpecifications extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $event
 * @property string $auditable_type
 * @property string $auditable_id
 * @property int|null $user_id
 * @property array<array-key, mixed>|null $old_values
 * @property array<array-key, mixed>|null $new_values
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Model|\Eloquent $auditable
 * @property-read array $diff
 * @property-read string $message
 * @property-read \App\Models\User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Audit newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Audit newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Audit query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Audit whereAuditableId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Audit whereAuditableType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Audit whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Audit whereEvent($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Audit whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Audit whereNewValues($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Audit whereOldValues($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Audit whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Audit whereUserId($value)
 */
	class Audit extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $officeCode
 * @property string $name
 * @property string $description
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Audit> $audits
 * @property-read int|null $audits_count
 * @method static \Database\Factories\Office_Department_DivisionFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Office_Department_Division newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Office_Department_Division newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Office_Department_Division onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Office_Department_Division query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Office_Department_Division whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Office_Department_Division whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Office_Department_Division whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Office_Department_Division whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Office_Department_Division whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Office_Department_Division whereOfficeCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Office_Department_Division whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Office_Department_Division withTrashed(bool $withTrashed = true)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Office_Department_Division withoutTrashed()
 */
	class Office_Department_Division extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $ticketId
 * @property int $activity_id
 * @property int $activitySpecification_id
 * @property string $assetSerialNumber
 * @property int $status_id
 * @property int|null $priority_id
 * @property int|null $responder_id
 * @property int $requester_id
 * @property \Illuminate\Support\Carbon|null $assignementDate
 * @property string|null $findings
 * @property string|null $resolution
 * @property string|null $dateClosed
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string|null $description
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $respondedDate
 * @property-read \App\Models\Activity $activity
 * @property-read \App\Models\ActivitySpecifications $activitySpecification
 * @property-read \App\Models\User|null $assignee
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Audit> $audits
 * @property-read int|null $audits_count
 * @property-read \App\Models\TicketRelevance|null $priority
 * @property-read \App\Models\User $requester
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\User> $responder
 * @property-read int|null $responder_count
 * @property-read \App\Models\TicketStatus $status
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ticket newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ticket newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ticket onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ticket query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ticket whereActivityId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ticket whereActivitySpecificationId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ticket whereAssetSerialNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ticket whereAssignementDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ticket whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ticket whereDateClosed($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ticket whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ticket whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ticket whereFindings($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ticket whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ticket wherePriorityId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ticket whereRequesterId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ticket whereResolution($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ticket whereRespondedDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ticket whereResponderId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ticket whereStatusId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ticket whereTicketId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ticket whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ticket withTrashed(bool $withTrashed = true)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ticket withoutTrashed()
 */
	class Ticket extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $relevanceCode
 * @property string $name
 * @property string $description
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string|null $deleted_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Audit> $audits
 * @property-read int|null $audits_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketRelevance newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketRelevance newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketRelevance query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketRelevance whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketRelevance whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketRelevance whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketRelevance whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketRelevance whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketRelevance whereRelevanceCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketRelevance whereUpdatedAt($value)
 */
	class TicketRelevance extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property string $description
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string|null $deleted_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketStatus newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketStatus newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketStatus query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketStatus whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketStatus whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketStatus whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketStatus whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketStatus whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketStatus whereUpdatedAt($value)
 */
	class TicketStatus extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $email
 * @property string $password
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string $employeeID
 * @property string $firstName
 * @property string $lastName
 * @property string $username
 * @property string $designation
 * @property int $office_department_division_id
 * @property int $account_role_id
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property string|null $middleName
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Ticket> $AssignedTickets
 * @property-read int|null $assigned_tickets_count
 * @property-read \App\Models\AccountRoles $account_role
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection<int, \Illuminate\Notifications\DatabaseNotification> $notifications
 * @property-read int|null $notifications_count
 * @property-read \App\Models\Office_Department_Division $office_department_division
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \Laravel\Sanctum\PersonalAccessToken> $tokens
 * @property-read int|null $tokens_count
 * @method static \Database\Factories\UserFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereAccountRoleId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereDesignation($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmployeeID($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereFirstName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereLastName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereMiddleName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereOfficeDepartmentDivisionId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereUsername($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User withTrashed(bool $withTrashed = true)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User withoutTrashed()
 */
	class User extends \Eloquent {}
}

