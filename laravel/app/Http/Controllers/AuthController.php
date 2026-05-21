<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AccessToken;
use App\Models\User;

class AuthController extends Controller
{
    public function me(Request $request)
    {
        // 1. Authorizationヘッダー取得
        $authHeader = $request->header('Authorization');

        if (!$authHeader) {
            return response()->json(['message' => 'No token'], 401);
        }

        // 2. "Bearer xxx" からtoken部分だけ取得
        $token = str_replace('Bearer ', '', $authHeader);

        // 3. token検索
        $accessToken = AccessToken::where('token', $token)->first();

        if (!$accessToken) {
            return response()->json(['message' => 'Invalid token'], 401);
        }

        // 4. 期限チェック（任意）
        if ($accessToken->expires_at < now()) {
            return response()->json(['message' => 'Token expired'], 401);
        }

        // 5. user取得
        $user = User::find($accessToken->user_id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // 6. 返す
        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
        ]);
    }
}