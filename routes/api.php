<?php

use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Api\UserController;

Route::get('/tasks', function () {
    return Task::all();
});
Route::get('/users', [UserController::class, 'index']);


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

Route::post('/login', function (Request $request) {

    $user = User::where('email', $request->email)->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json([
            'message' => 'Login failed'
        ], 401);
    }

    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'token' => $token
    ]);
});