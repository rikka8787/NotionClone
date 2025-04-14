<?php

namespace Tests\Feature;

use App\Models\Task;
use App\Models\User;
use App\Models\Group;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_task()
    {
        // 創建群組和用戶
        $group = Group::factory()->create();
        $user = User::factory()->create(['group_id' => $group->id]);
        
        // 創建任務，並明確指定用戶和群組
        $task = Task::factory()->create([
            'user_id' => $user->id,
            'group_id' => $group->id
        ]);
        
        // 確認 Task 已存在於資料庫
        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'title' => $task->title,
            'user_id' => $user->id,
            'group_id' => $group->id
        ]);
    }

    public function test_can_create_multiple_tasks()
    {
        // 創建群組和用戶
        $group = Group::factory()->create();
        $user = User::factory()->create(['group_id' => $group->id]);
        
        // 創建 5 個 Task
        $tasks = [];
        for ($i = 0; $i < 5; $i++) {
            $tasks[] = Task::factory()->create([
                'user_id' => $user->id,
                'group_id' => $group->id
            ]);
        }
        
        // 確認有 5 個 Task
        $this->assertCount(5, $tasks);
        $this->assertDatabaseCount('tasks', 5);
    }

    public function test_can_create_task_with_specific_attributes()
    {
        // 創建群組和用戶
        $group = Group::factory()->create();
        $user = User::factory()->create(['group_id' => $group->id]);
        
        // 創建有特定屬性的 Task
        $task = Task::factory()->create([
            'title' => '重要任務',
            'priority' => 'high',
            'user_id' => $user->id,
            'group_id' => $group->id
        ]);
        
        // 確認特定屬性
        $this->assertEquals('重要任務', $task->title);
        $this->assertEquals('high', $task->priority);
    }
}