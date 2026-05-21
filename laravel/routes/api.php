<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Hash;

use App\Models\Task;
use App\Models\User;

use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ProfileController;

/*
|--------------------------------------------------------------------------
| Public routes
|--------------------------------------------------------------------------
*/

// 👤 ユーザー作成
Route::post('/users', [UserController::class, 'store']);

// 🔐 ログイン
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


/*
|--------------------------------------------------------------------------
| Protected routes (Sanctum)
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    /*
    |-------------------------
    | Tasks
    |-------------------------
    */

    // 一覧
    Route::get('/tasks', function (Request $request) {
        return Task::where('user_id', $request->user()->id)->get();
    });

    // 詳細
    Route::get('/tasks/{id}', function (Request $request, $id) {
        return Task::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();
    });

    // 作成
    Route::post('/tasks', function (Request $request) {
        return Task::create([
            'title' => $request->title,
            'description' => $request->description,
            'completed' => false,
            'user_id' => $request->user()->id,
        ]);
    });

    // 更新
    Route::put('/tasks/{id}', function (Request $request, $id) {

        $task = Task::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $task->update([
            'title' => $request->title,
            'description' => $request->description,
        ]);

        return $task;
    });

    // 削除
    Route::delete('/tasks/{id}', function ($id) {
        Task::destroy($id);

        return response()->json([
            'message' => 'deleted'
        ]);
    });


    /*
    |-------------------------
    | Profile
    |-------------------------
    */

    // 自分の情報取得
    Route::get('/me', [ProfileController::class, 'me']);

    // 更新
    Route::put('/profile', [ProfileController::class, 'update']);

    // 削除
    Route::delete('/profile', [ProfileController::class, 'delete']);
});