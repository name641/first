<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Hash;

use App\Models\User;

use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\TaskController;

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
    
    $request
    ->user()
    ->currentAccessToken()
    ->delete();

return response()->json([
'message'=>'Logged out'
]);
});

Route::middleware('auth:sanctum')->group(function () {

    // 一覧（★フィルター対応済みControllerを使う）
    Route::get('/tasks', [TaskController::class, 'index']);

    // 詳細
    Route::get('/tasks/{task}', [TaskController::class, 'show']);

    // 作成
    Route::post('/tasks', [TaskController::class, 'store']);

    // ★追加（並び替え保存）
    Route::put('/tasks/reorder', [TaskController::class, 'reorder']);

    // 更新（PUT/PATCHどっちでもOK）
    Route::put('/tasks/{task}', [TaskController::class, 'update']);
    Route::patch('/tasks/{task}', [TaskController::class, 'update']);

    // 削除
    Route::delete('/tasks/{task}', [TaskController::class, 'destroy']);

    // 自分の情報取得
    Route::get('/me', [ProfileController::class, 'me']);

    // 更新
    Route::put('/profile', [ProfileController::class, 'update']);

    // 削除
    Route::delete('/profile', [ProfileController::class, 'delete']);
});