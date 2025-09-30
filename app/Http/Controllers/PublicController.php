<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Carbon\Carbon;
use Inertia\Inertia;

class PublicController extends Controller
{
    /**
     * Display the homepage with the latest 3 published articles.
     */
    public function home()
    {
        $latestArticles = Article::select(['id', 'title', 'slug', 'created_at'])
            ->latest()
            ->where('is_published', true)
            ->take(3)
            ->get();

        $latestArticles->transform(fn($article) => [
            'id' => $article->id,
            'title' => $article->title,
            'slug' => $article->slug,
            'created_at' => Carbon::parse($article->created_at)->format('M d, Y h:i A'),
        ]);

        return Inertia::render('welcome', [
            'latestArticles' => $latestArticles,
        ]);
    }
}
