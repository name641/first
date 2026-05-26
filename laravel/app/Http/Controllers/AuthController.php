<?php
<?php

namespace App\Http\Controllers;

use App\Models\AccessToken;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function me(
        Request $request
    )
    {
        // Bearer token取得
        $token =
            $request->bearerToken();

        if (!$token) {
            return response()->json([
                'message' =>
                    'No token'
            ],401);
        }

        // hash化して検索
        $hashedToken =
            hash(
                'sha256',
                $token
            );

        $accessToken =
            AccessToken::where(
                'token',
                $hashedToken
            )->first();

        if (!$accessToken) {
            return response()->json([
                'message' =>
                    'Invalid token'
            ],401);
        }

        // 期限チェック
        if (
            $accessToken->expires_at &&
            $accessToken
                ->expires_at
                ->isPast()
        ) {
            return response()->json([
                'message' =>
                    'Token expired'
            ],401);
        }

        // リレーション利用
        $user =
            $accessToken->user;

        if (!$user) {
            return response()->json([
                'message'=>
                    'Unauthorized'
            ],401);
        }

        return response()->json([
            'id'=>
                $user->id,

            'name'=>
                $user->name,

            'email'=>
                $user->email
        ]);
    }
}