<?php

use Illuminate\Support\Facades\Route;

/*
| The portal is one page; all data comes from /api. Asset URLs carry a
| version so browsers fetch new CSS/JS after each deploy.
*/
Route::get('/', function () {
    $version = substr(md5((string) (filemtime(public_path('assets/app.js')) + filemtime(public_path('assets/styles.css')))), 0, 10);
    $html = str_replace('__ASSET_VERSION__', $version, file_get_contents(resource_path('portal/index.html')));

    return response($html)->header('Content-Type', 'text/html; charset=UTF-8');
});
