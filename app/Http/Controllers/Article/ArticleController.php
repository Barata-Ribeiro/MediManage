<?php

namespace App\Http\Controllers\Article;

use App\Http\Controllers\Controller;
use App\Http\Requests\Article\ArticleRequest;
use App\Models\Article;
use App\Models\Category;
use Auth;
use Exception;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Log;
use Str;

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

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Article $article)
    {
        $requestingUser = Auth::user();

        if ($article->user_id !== $requestingUser->id && !$requestingUser->hasRole('Super Admin|Manager')) {
            abort(403, 'You do not have permission to edit this article.');
        }

        Log::info("Articles: Viewed edit page for article ID {$article->id}", ['action_user_id' => $requestingUser->id]);

        $categories = Category::select(['name'])->orderBy('name')->get();
        $article->load('categories:id,name');

        return Inertia::render('manage/articles/Edit', [
            'article' => $article,
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ArticleRequest $request, Article $article)
    {
        try {
            $requestingUser = Auth::user();

            if ($article->user_id !== $requestingUser->id && !$requestingUser->hasRole('Super Admin|Manager')) {
                abort(403, 'You do not have permission to update this article.');
            }

            $data = $request->validated();
            if (isset($data['title']) && $data['title'] !== $article->title) {
                $data['slug'] = Str::slug($data['title'], '-');
            }

            $article->update($data);
            if ($request->has('categories')) {
                $categoryNames = $data['categories'];
                $categoryIds = collect($categoryNames)
                    ->map(fn($name) => Category::firstOrCreate(['name' => $name])->id)
                    ->all();
                $article->categories()->sync($categoryIds);
            } else {
                $article->categories()->detach();
            }

            Log::info("Articles: Updated article ID {$article->id}", ['action_user_id' => $requestingUser->id]);

            return to_route($article->user_id === $requestingUser->id ? 'articles.my' : 'articles.index')->with('success', 'Article updated successfully.');
        } catch (Exception $e) {
            Log::error('Articles: Failed to update article', [
                'action_user_id' => Auth::id(),
                'article_id' => $article->id,
                'error' => $e->getMessage()
            ]);

            return back()->withInput()->with('error', 'Failed to update article. Please try again.');
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ArticleRequest $request)
    {
        try {
            $data = $request->validated();
            $data['user_id'] = Auth::id();
            $data['slug'] = Str::slug($data['title'], '-');

            $article = Article::create($data);
            if ($request->has('categories')) {
                $categoryNames = $data['categories'];
                $categoryIds = collect($categoryNames)
                    ->map(fn($name) => Category::firstOrCreate(['name' => $name])->id)
                    ->all();
                $article->categories()->sync($categoryIds);
            }

            Log::info('Articles: Created new article', ['action_user_id' => Auth::id(), 'article_id' => $article->id]);

            return to_route('articles.my')->with('success', 'Article created successfully.');
        } catch (Exception $e) {
            Log::error('Articles: Failed to create article', [
                'action_user_id' => Auth::id(),
                'error' => $e->getMessage()
            ]);

            return back()->withInput()->with('error', 'Failed to create article. Please try again.');
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        Log::info('Articles: Viewed create article page', ['action_user_id' => Auth::id()]);
        $categories = Category::select(['name'])->orderBy('name')->get();
        return Inertia::render('manage/articles/Create', ['categories' => $categories]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Article $article)
    {
        try {
            $requestingUser = Auth::user();

            if ($article->user_id !== $requestingUser->id && !$requestingUser->hasRole('Super Admin|Manager')) {
                abort(403, 'You do not have permission to delete this article.');
            }

            $articleId = $article->id;
            $article->delete();

            Log::info("Articles: Deleted article ID {$articleId}", ['action_user_id' => $requestingUser->id]);

            return to_route($article->user_id === $requestingUser->id ? 'articles.my' : 'articles.index')->with('success', 'Article deleted successfully.');
        } catch (Exception $e) {
            Log::error('Articles: Failed to delete article', [
                'action_user_id' => Auth::id(),
                'article_id' => $article->id,
                'error' => $e->getMessage()
            ]);

            return back()->with('error', 'Failed to delete article. Please try again.');
        }
    }
}
