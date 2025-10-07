<?php

namespace App\Http\Controllers\Article;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Log;

class ArticleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Log::info('Articles: Viewed articles list', ['action_user_id' => Auth::id()]);

        $perPage = (int)$request->input('per_page', 10);
        $search = $request->search;
        $sortBy = $request->input('sort_by', 'id');
        $sortDir = strtolower($request->input('sort_dir', 'asc')) === 'desc' ? 'desc' : 'asc';

        $allowedSorts = ['id', 'title', 'user.name', 'is_published', 'created_at', 'updated_at'];
        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'id';
        }

        if (str_starts_with($sortBy, 'user.')) {
            $sortBy = 'users.name';
        }

        $query = Article::select([
            'articles.id',
            'articles.user_id',
            'articles.title',
            'articles.slug',
            'articles.is_published',
            'articles.created_at',
            'articles.updated_at',
        ])
            ->with(['user' => fn($q) => $q->select('id', 'name')])
            ->when($request->filled('search'), fn($qr) => $qr
                ->whereFullText(['title', 'subtitle', 'excerpt', 'content_html'], $search)
                ->orWhereHas('user', fn($q) => $q->whereLike('name', "%$search%")))
            ->when(str_starts_with($sortBy, 'users.'), fn($qr) => $qr->leftJoin('users', 'users.id', '=', 'articles.user_id'));

        $articles = $query->orderBy($sortBy, $sortDir)
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('manage/articles/Index', ['articles' => $articles]);
    }

    /**
     * Display a listing of the resource owned by the authenticated user.
     */
    public function myIndex(Request $request)
    {
        $user_id = Auth::id();

        Log::info("Articles: Viewed own articles list", ['action_user_id' => $user_id]);

        $perPage = (int)$request->input('per_page', 10);
        $search = $request->search;
        $sortBy = $request->input('sort_by', 'id');
        $sortDir = strtolower($request->input('sort_dir', 'arc')) === 'desc' ? 'desc' : 'asc';

        $allowedSorts = ['id', 'title', 'is_published', 'created_at', 'updated_at'];
        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'id';
        }

        $query = Article::select(['id', 'user_id', 'title', 'slug', 'is_published', 'created_at', 'updated_at'])
            ->where('user_id', $user_id)
            ->when($request->filled('search'), fn($qr) => $qr
                ->whereFullText(['title', 'subtitle', 'excerpt', 'content_html'], $search));

        $articles = $query->orderBy($sortBy, $sortDir)
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('manage/articles/MyIndex', ['articles' => $articles]);
    }
}
