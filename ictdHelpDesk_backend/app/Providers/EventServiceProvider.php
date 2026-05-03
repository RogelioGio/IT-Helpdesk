<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Listeners\ModelAuditSubscriber; // Don't forget to import this!

class EventServiceProvider extends ServiceProvider
{
    /**
     * The subscriber classes to register.
     * Add this property here:
     */
    protected $subscribe = [
        ModelAuditSubscriber::class,
    ];

    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}