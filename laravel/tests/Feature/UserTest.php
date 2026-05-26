<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_get_profile()
    {
        $user = User::factory()->create([
            'name' => 'Taro'
        ]);

        $this->actingAs($user);

        $response = $this->getJson(
            '/api/me'
        );

        $response->assertStatus(200);

        $response->assertJsonFragment([
            'name' => 'Taro'
        ]);
    }

    public function test_guest_cannot_get_profile()
    {
        $response = $this->getJson(
            '/api/me'
        );

        $response->assertStatus(401);
    }
}