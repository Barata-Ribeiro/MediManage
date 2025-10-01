<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Category;
use Illuminate\Http\Request;
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

    /**
     * Display a listing of all published articles.
     */
    public function articles(Request $request)
    {
        $category = $request->query('category');

        $articles = Article::whereIsPublished(true)
            ->with(['user' => fn($query) => $query->select('id', 'name', 'avatar')])
            ->with(['categories' => fn($query) => $query->select('id', 'name')])
            ->when($request->filled('category'), fn($query) => $query->whereHas('categories', fn($q) => $q->where('name', $category)))
            ->latest()
            ->paginate(10, ['id', 'user_id', 'title', 'slug', 'excerpt', 'thumbnail', 'created_at'])
            ->withQueryString();

        $categories = Category::withCount('articles')->get();

        return Inertia::render('home/articles/Index', [
            'articles' => $articles,
            'categories' => $categories,
        ]);
    }

    /**
     * Display a specific published article.
     */
    public function article(Article $article)
    {
        if (!$article->is_published) {
            abort(404);
        }

        $article
            ->with('user')
            ->with(['categories' => fn($query) => $query->select('id', 'name')]);

        return Inertia::render('home/articles/Show', [
            'article' => $article,
        ]);
    }
}
