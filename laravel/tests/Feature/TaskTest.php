<?php
namespace Tests\Feature;

use App\Models\User;
use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskTest extends TestCase
{
    use RefreshDatabase;
    //タスク作成
    public function test_task_can_be_created()
    {
        $user = User::factory()->create();

        $this->actingAs($user);

        $response = $this->postJson('/api/tasks', [
            'title' => '買い物',
            'description' => '牛乳を買う',
        ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('tasks', [
            'title' => '買い物',
            'description' => '牛乳を買う',
            'user_id' => $user->id,
        ]);
    }
    //タスク編集
    public function test_task_can_be_updated()
    {
        $user = User::factory()->create();

        $task = Task::factory()->create([
            'user_id' => $user->id,
            'title' => '古いタイトル',
            'description' => '古い説明',
        ]);

        $this->actingAs($user);

        $response = $this->putJson(
            "/api/tasks/{$task->id}",
            [
                'title' => '新タイトル',
                'description' => '新しい説明',
            ]
        );

        $response->assertStatus(200);

        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'title' => '新タイトル',
            'description' => '新しい説明',
        ]);
    }
    //タスク消去
    public function test_task_can_be_deleted()
    {
        $user = User::factory()->create();

        $task = Task::factory()->create([
            'user_id' => $user->id,
        ]);

        $this->actingAs($user);

        $response = $this->deleteJson(
            "/api/tasks/{$task->id}"
        );

        $response->assertStatus(200);

        $this->assertDatabaseMissing(
            'tasks',
            [
                'id' => $task->id
            ]
        );
    }
    //タスクの取得と一覧表示
    public function test_tasks_can_be_listed()
    {
        $user = User::factory()->create();

        Task::factory()->count(3)->create([
            'user_id' => $user->id,
        ]);

        $this->actingAs($user);

        $response = $this->getJson('/api/tasks');

        $response->assertStatus(200);

        $response->assertJsonCount(3);
    }
    //バリデーション
        public function test_guest_cannot_create_task()
    {
        $response = $this->postJson('/api/tasks', [
            'title' => '買い物',
            'description' => '牛乳を買う',
        ]);

        $response->assertStatus(401);
    }

    public function test_title_is_required()
    {
        $user = User::factory()->create();

        $this->actingAs($user);

        $response = $this->postJson(
            '/api/tasks',
            [
                'title' => '',
                'description' => '説明'
            ]
        );

        $response->assertStatus(422);

        $response->assertJsonValidationErrors([
            'title'
        ]);
    }
    //権限
    public function test_description_is_required()
    {
        $user = User::factory()->create();

        $this->actingAs($user);

        $response = $this->postJson(
            '/api/tasks',
            [
                'title' => '買い物',
                'description' => ''
            ]
        );

        $response->assertStatus(422);

        $response->assertJsonValidationErrors([
            'description'
        ]);
    }

    public function test_other_users_task_cannot_be_updated()
    {
        $user = User::factory()->create();

        $otherUser = User::factory()->create();

        $task = Task::factory()->create([
            'user_id' => $otherUser->id,
        ]);

        $this->actingAs($user);

        $response = $this->putJson(
            "/api/tasks/{$task->id}",
            [
                'title' => '変更',
                'description' => '変更内容'
            ]
        );

        $response->assertStatus(403);
    }

    public function test_other_users_task_cannot_be_deleted()
    {
        $user = User::factory()->create();

        $otherUser = User::factory()->create();

        $task = Task::factory()->create([
            'user_id' => $otherUser->id,
        ]);

        $this->actingAs($user);

        $response = $this->deleteJson(
            "/api/tasks/{$task->id}"
        );

        $response->assertStatus(403);
    }
    //機能面
    //検索
    public function test_tasks_can_be_filtered_by_title()
    {
        $user = User::factory()->create();

        Task::factory()->create([
            'user_id' => $user->id,
            'title' => '買い物',
        ]);

        Task::factory()->create([
            'user_id' => $user->id,
            'title' => '勉強',
        ]);

        $this->actingAs($user);

        $response = $this->getJson(
            '/api/tasks?search=買い物'
        );

        $response->assertStatus(200);

        $response->assertJsonCount(1);

        $response->assertJsonFragment([
            'title' => '買い物'
        ]);
    }
    //フィルター
    public function test_tasks_can_be_filtered_by_status()
    {
        $user = User::factory()->create();

        Task::factory()->create([
            'user_id' => $user->id,
            'title' => 'タスク1',
            'status' => 'todo'
        ]);

        Task::factory()->create([
            'user_id' => $user->id,
            'title' => 'タスク2',
            'status' => 'done'
        ]);

        $this->actingAs($user);

        $response = $this->getJson(
            '/api/tasks?status=todo'
        );

        $response->assertStatus(200);

        $response->assertJsonCount(1);

        $response->assertJsonFragment([
            'title' => 'タスク1'
        ]);
    }
    public function test_tasks_can_be_filtered_by_deadline()
{
    $user = User::factory()->create();

    Task::factory()->create([
        'user_id' => $user->id,
        'title' => '期限切れタスク',
        'deadline' => now()->subDay(),
    ]);

    Task::factory()->create([
        'user_id' => $user->id,
        'title' => '未来タスク',
        'deadline' => now()->addDays(3),
    ]);

    $this->actingAs($user);

    $response = $this->getJson(
        '/api/tasks?deadline=future'
    );

    $response->assertStatus(200);

    $response->assertJsonCount(1);

    $response->assertJsonFragment([
        'title' => '未来タスク'
    ]);
}
    //ドラッグ＆ドロップ
    public function test_tasks_can_be_reordered()
    {
        $user = User::factory()->create();

        $task1 = Task::factory()->create([
            'user_id' => $user->id,
            'status' => 'todo',
            'order' => 0,
        ]);

        $task2 = Task::factory()->create([
            'user_id' => $user->id,
            'status' => 'todo',
            'order' => 1,
        ]);

        $this->actingAs($user);

        $response = $this->putJson(
            '/api/tasks/reorder',
            [
                [
                    'id' => $task1->id,
                    'status' => 'doing',
                    'order' => 0,
                ],
                [
                    'id' => $task2->id,
                    'status' => 'todo',
                    'order' => 0,
                ]
            ]
        );

        $response->assertStatus(200);

        $this->assertDatabaseHas(
            'tasks',
            [
                'id' => $task1->id,
                'status' => 'doing',
                'order' => 0
            ]
        );
    }

     public function test_user_can_get_task_detail()
    {
        $user = User::factory()->create();

        $task = Task::factory()->create([
            'user_id' => $user->id,
            'title' => '買い物',
        ]);

        $this->actingAs($user);

        $response = $this->getJson(
            "/api/tasks/{$task->id}"
        );

        $response->assertStatus(200);

        $response->assertJsonFragment([
            'title' => '買い物'
        ]);
    }
    public function test_other_users_task_cannot_be_viewed()
    {
        $user = User::factory()->create();

        $otherUser = User::factory()->create();

        $task = Task::factory()->create([
            'user_id' => $otherUser->id,
        ]);

        $this->actingAs($user);

        $response = $this->getJson(
            "/api/tasks/{$task->id}"
        );

        $response->assertStatus(403);
    }
    //壊れる入力をちゃんと拒否するか
    public function test_title_cannot_exceed_max_length()
    {
        $user = User::factory()->create();

        $this->actingAs($user);

        $response = $this->postJson(
            '/api/tasks',
            [
                'title' => str_repeat('a',256),
                'description' => '説明'
            ]
        );

        $response->assertStatus(422);

        $response->assertJsonValidationErrors([
            'title'
        ]);
    }
    //他人のタスクは更新されない
    public function test_other_users_tasks_cannot_be_reordered()
    {
        $user = User::factory()->create();

        $otherUser = User::factory()->create();

        $task = Task::factory()->create([
            'user_id' => $otherUser->id,
            'status' => 'todo',
            'order' => 0
        ]);

        $this->actingAs($user);

        $response = $this->putJson(
            '/api/tasks/reorder',
            [
                [
                    'id' => $task->id,
                    'status' => 'done',
                    'order' => 99
                ]
            ]
        );

        $response->assertStatus(200);

        $this->assertDatabaseHas(
            'tasks',
            [
                'id' => $task->id,
                'status' => 'todo',
                'order' => 0
            ]
        );
    }

    public function test_task_update_requires_title()
    {
        $user = User::factory()->create();

        $task = Task::factory()->create([
            'user_id' => $user->id,
        ]);

        $this->actingAs($user);

        $response = $this->putJson(
            "/api/tasks/{$task->id}",
            [
                'title' => '',
                'description' => '変更内容'
            ]
        );

        $response->assertStatus(422);

        $response->assertJsonValidationErrors([
            'title'
        ]);
    }
    public function test_task_update_requires_description()
    {
        $user = User::factory()->create();

        $task = Task::factory()->create([
            'user_id' => $user->id,
        ]);

        $this->actingAs($user);

        $response = $this->putJson(
            "/api/tasks/{$task->id}",
            [
                'title' => '更新タイトル',
                'description' => ''
            ]
        );

        $response->assertStatus(422);

        $response->assertJsonValidationErrors([
            'description'
        ]);
    }


    public function test_guest_cannot_view_tasks()
    {
        $response = $this->getJson('/api/tasks');

        $response->assertStatus(401);
    }

    public function test_guest_cannot_update_task()
    {
        $user = User::factory()->create();

        $task = Task::factory()->create([
            'user_id' => $user->id,
        ]);

        $response = $this->putJson(
            "/api/tasks/{$task->id}",
            [
                'title' => '変更',
                'description' => '変更内容',
            ]
        );

        $response->assertStatus(401);
    }   

    public function test_guest_cannot_delete_task()
    {
        $user = User::factory()->create();

        $task = Task::factory()->create([
            'user_id' => $user->id,
        ]);

        $response = $this->deleteJson(
            "/api/tasks/{$task->id}"
        );

        $response->assertStatus(401);
    }


    //存在しないIDテスト
    public function test_nonexistent_task_returns_404()
    {
        $user = User::factory()->create();

        $this->actingAs($user);

        $response = $this->getJson(
            '/api/tasks/999999'
        );

        $response->assertStatus(404);
    }
    public function test_nonexistent_task_update_returns_404()
    {
        $user = User::factory()->create();

        $this->actingAs($user);

        $response = $this->putJson(
            '/api/tasks/999999',
            [
                'title' => '更新',
                'description' => '内容'
            ]
        );

        $response->assertStatus(404);
    }
    //ユーザーごとのでーたの分離
    public function test_user_can_only_see_own_tasks()
    {
        $user = User::factory()->create();

        $otherUser = User::factory()->create();

        Task::factory()->create([
            'user_id' => $user->id,
            'title' => '自分のタスク',
        ]);

        Task::factory()->create([
            'user_id' => $otherUser->id,
            'title' => '他人のタスク',
        ]);

        $this->actingAs($user);

        $response = $this->getJson(
            '/api/tasks'
        );

        $response->assertStatus(200);

        $response->assertJsonFragment([
            'title' => '自分のタスク'
        ]);

        $response->assertJsonMissing([
            'title' => '他人のタスク'
        ]);
    }
}