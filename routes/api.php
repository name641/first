<?php

use Illuminate\Support\Facades\Route;

Route::get('/test', function () {
    return [
        'message' => 'Laravel API OK',
        'time' => now(),
    ];
});