<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Identity hashing key
    |--------------------------------------------------------------------------
    |
    | IC numbers are stored encrypted, plus an HMAC used for login and for
    | matching siblings. This key must never change once data exists, so it
    | is kept separate from APP_KEY (which may be rotated).
    |
    */

    'identity_key' => env('IDENTITY_HASH_KEY', env('APP_KEY')),

    // Years to keep a student's record after they leave, then anonymise.
    'retention_years' => (int) env('PORTAL_RETENTION_YEARS', 5),

    // Failed logins allowed per identifier and IP before a one-minute wait.
    'login_max_attempts' => 5,

    // Subject codes used by the LMS rule (BM and Sejarah must both pass).
    'subjects' => [
        'bm' => 'BM',
        'sejarah' => 'SEJ',
    ],

];
