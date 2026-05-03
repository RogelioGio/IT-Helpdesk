<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Event;
use App\Listeners\ModelAuditSubscriber;
use App\Models\Ticket;
use App\Observers\NotificationObserver;
use App\Observers\TicketObserver;
use Illuminate\Notifications\DatabaseNotification;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //

    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
        Ticket::observe(TicketObserver::class);
        DatabaseNotification::observe(NotificationObserver::class);
        Event::subscribe(ModelAuditSubscriber::class);
    }
}
