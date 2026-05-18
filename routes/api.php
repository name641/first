<?php

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/tasks', function () {
    return Task::all();
});

Route::post('/tasks', function (Request $request) {

    return Task::create([
        'title' => $request->title,
        'description' => $request->description,
        'completed' => false,
        'user_id' => $request->user_id,
    ]);
});

Route::delete('/tasks/{id}', function ($id) {
    return Task::destroy($id);
});