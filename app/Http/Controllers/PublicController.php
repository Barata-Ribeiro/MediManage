<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Inertia\Inertia;

class PublicController extends Controller
{
    /**
     * Display the homepage with the latest 3 published articles.
     */
    public function home()
    {
        $latestArticles = Article::whereIsPublished(true)
            ->with(['user' => fn($query) => $query->select('id', 'name', 'avatar')])
            ->latest()->take(3)
            ->get(['id', 'user_id', 'title', 'slug', 'thumbnail', 'created_at']);

        return Inertia::render('welcome', [
            'latestArticles' => $latestArticles,
        ]);
    }
}
