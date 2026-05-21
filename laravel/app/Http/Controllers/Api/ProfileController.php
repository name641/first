<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    // 👤 自分の情報取得
    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    // ✏️ 更新
    public function update(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password
                ? Hash::make($request->password)
                : $user->password,
        ]);

        return response()->json([
            'message' => 'updated',
            'user' => $user
        ]);
    }

    // 🗑 削除
    // public function delete(Request $request)
    // {
    //     $request->user()->delete();

    //     return response()->json([
    //         'message' => 'deleted'
    //     ]);
    // }
    public function delete(Request $request)
{
    $user = $request->user();

    // トークン削除（重要）
    $user->tokens()->delete();

    // ユーザー削除
    $user->delete(); // or forceDelete()

    return response()->json([
        'message' => 'deleted'
    ]);
}
}