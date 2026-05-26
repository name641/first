<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_login()
    {
        // テスト用ユーザー作成
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('password'),
        ]);

        // ログイン実行
        $response = $this->post('/login', [
            'email' => 'test@example.com',
            'password' => 'password',
        ]);

        // ログイン成功確認
        $this->assertAuthenticated();

        // リダイレクト先確認
        $response->assertRedirect('/dashboard');
    }

    public function test_user_can_logout()
    {
        // テスト用ユーザー
        $user = User::factory()->create();

        // ログイン状態にする
        $this->actingAs($user);

        // ログアウト実行
        $response = $this->post('/logout');

        // ログアウト確認
        $this->assertGuest();

        // リダイレクト確認
        $response->assertRedirect('/');
    }
}