<?php

namespace App\Observers;

use App\Events\NewNotificationReceived;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Support\Facades\Log;

class NotificationObserver
{
    public function created(DatabaseNotification $notification)
    {
        broadcast(new NewNotificationReceived($notification));
    }
}
