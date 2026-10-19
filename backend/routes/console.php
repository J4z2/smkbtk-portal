<?php

use Illuminate\Support\Facades\Schedule;

// PDPA retention. On the server, cron runs `php artisan schedule:run` every minute.
Schedule::command('portal:anonymise-leavers')->dailyAt('02:00');
