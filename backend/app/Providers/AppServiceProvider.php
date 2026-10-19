<?php

namespace App\Providers;

use App\Models\AbsenceNotice;
use App\Models\MeetingBooking;
use App\Models\MeetingSlot;
use App\Models\SchoolClass;
use App\Services\Coex;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // One rule set per request, loaded on first use.
        $this->app->scoped(Coex::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Route::bind('class', fn (string $id) => SchoolClass::findOrFail($id));
        Route::bind('notice', fn (string $id) => AbsenceNotice::findOrFail($id));
        Route::bind('slot', fn (string $id) => MeetingSlot::findOrFail($id));
        Route::bind('booking', fn (string $id) => MeetingBooking::findOrFail($id));
    }
}
