<?php

namespace Database\Factories;

use App\Models\Task;
use App\Models\User;
use App\Models\Group;
use Illuminate\Database\Eloquent\Factories\Factory;

class TaskFactory extends Factory
{
    protected $model = Task::class;

    public function definition()
    {
        $user = User::factory()->create();
        $group = Group::factory()->create();
        return [
            'title' => $this->faker->sentence(),
            'description' => $this->faker->paragraph(),
            'user_id' => $user,
            'group_id' => $group,
            'priority' => $this->faker->randomElement(['low', 'middle', 'high']),
            'start_time' => $this->faker->dateTimeBetween('now', '+1 week'),
            'end_time' => $this->faker->dateTimeBetween('+1 week', '+2 weeks'),
        ];
    }
}