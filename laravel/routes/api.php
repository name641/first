<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Task;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Api\UserController;

Route::post('/users', [UserController::class, 'store']);

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

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/tasks', fn (Request $request)
        => Task::where('user_id', $request->user()->id)->get()
    );

    Route::get('/tasks/{id}', function (Request $request, $id) {
        return Task::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();
    });

    Route::post('/tasks', function (Request $request) {
        return Task::create([
            'title' => $request->title,
            'description' => $request->description,
            'completed' => false,
            'user_id' => $request->user()->id,
        ]);
    });

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

    Route::delete('/tasks/{id}', function ($id) {
        return Task::destroy($id);
    });

});