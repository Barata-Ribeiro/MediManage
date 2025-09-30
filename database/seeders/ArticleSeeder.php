<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Seeder;

class ArticleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::role('Doctor')->get();
        $categories = Category::all();

        $users->each(fn($user) => Article::factory()
            ->count(5)
            ->create(['user_id' => $user->id])
            ->each(fn($article) => $article->categories()
                ->attach($categories->random(rand(1, 3))->pluck('id')->toArray())
            )
        );
    }
}
