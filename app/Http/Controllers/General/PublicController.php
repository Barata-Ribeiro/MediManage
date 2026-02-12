<?php

namespace App\Http\Controllers\General;

use App\Common\Helpers;
use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Category;
use App\Models\Prescription;
use DB;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;

use function in_array;

class PublicController extends Controller
{
    private bool $isSqlDriver;

    public function __construct()
    {
        $this->isSqlDriver = in_array(DB::getDriverName(), ['mysql', 'pgsql']);
    }

    /**
     * Display the homepage with the latest 3 published articles.
     */
    public function home()
    {
        $latestArticles = Article::whereIsPublished(true)
            ->with(['user' => fn ($query) => $query->select('id', 'name', 'avatar')])
            ->latest()->take(3)
            ->get(['id', 'user_id', 'title', 'slug', 'thumbnail', 'created_at']);

        return Inertia::render('welcome', [
            'latestArticles' => $latestArticles,
        ]);
    }

    /**
     * Display the about page.
     */
    public function about()
    {
        return Inertia::render('home/about/about');
    }

    /**
     * Display a listing of all published articles.
     */
    public function articles(Request $request)
    {
        $validated = $request->validate([
            'category' => ['sometimes', 'nullable', 'string'],
            'search' => ['sometimes', 'nullable', 'string'],
            'start_date_creation' => ['sometimes', 'nullable', 'date'],
            'end_date_creation' => ['sometimes', 'nullable', 'date'],
        ]);

        $category = trim($validated['category'] ?? '');
        $search = trim($validated['search'] ?? '');
        $start_date = trim($validated['start_date_creation'] ?? '');
        $end_date = trim($validated['end_date_creation'] ?? '');

        $isSql = $this->isSqlDriver;

        $articles = Article::query()
            ->whereIsPublished(true)
            ->with(['user' => fn (Builder $query) => $query->select('id', 'name', 'avatar')])
            ->with(['categories' => fn (Builder $query) => $query->select('id', 'name')])
            ->when($category, function (Builder $query) use ($category) {
                $names = array_filter(array_map('trim', explode(',', $category)));

                return $query->whereHas('categories', fn (Builder $q) => $q->whereIn('name', $names));
            })
            ->when($search, fn (Builder $q) => $q->where(function (Builder $query) use ($search, $isSql) {
                if ($isSql) {
                    $booleanQuery = Helpers::buildBooleanQuery($search);
                    $query->whereFullText(['title', 'subtitle', 'excerpt', 'content_html'], $booleanQuery, ['mode' => 'boolean']);
                } else {
                    $query->whereLike('title', "%$search%")->orWhereLike('subtitle', "%$search%")
                        ->orWhereLike('excerpt', "%$search%")->orWhereLike('content_html', "%$search%");
                }
            })->orWhereHas('user', fn (Builder $q) => $q->whereLike('name', "%$search%")))
            ->when($start_date, fn (Builder $query) => $query->whereDate('created_at', '>=', $start_date))
            ->when($end_date, fn (Builder $query) => $query->whereDate('created_at', '<=', $end_date))
            ->latest()
            ->paginate(10, ['id', 'user_id', 'title', 'slug', 'excerpt', 'thumbnail', 'created_at'])
            ->withQueryString();

        $categories = Category::withCount(['articles as articles_count' => fn (Builder $query) => $query->whereIsPublished(true)])->get();

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
        if (! $article->is_published) {
            abort(404);
        }

        $article->load([
            'user:id,name,avatar',
            'categories:id,name',
        ]);

        $categoryIds = $article->categories->pluck('id')->all();

        $relatedArticlesQuery = Article::whereIsPublished(true)
            ->where('id', '<>', $article->id)
            ->with(['user' => fn ($q) => $q->select('id', 'name', 'avatar')]);

        if (! empty($categoryIds)) {
            $relatedArticlesQuery->whereHas('categories', fn ($q) => $q->whereIn('id', $categoryIds));
        }

        $relatedArticles = $relatedArticlesQuery
            ->latest()
            ->take(3)
            ->get(['id', 'user_id', 'title', 'slug', 'thumbnail', 'created_at']);

        return Inertia::render('home/articles/Show', [
            'article' => $article,
            'relatedArticles' => Inertia::defer(fn () => $relatedArticles),
        ]);
    }

    /**
     * Display the prescription validation page with a form to enter the validation code.
     */
    public function prescription()
    {
        return Inertia::render('home/prescription/Index');
    }

    /**
     * Display if the prescription is valid or not based on the validation code.
     */
    public function prescriptionValidation(Prescription $prescription)
    {
        $prescription = Prescription::select([
            'id',
            'validation_code',
            'is_valid',
            'patient_info_id',
            'employee_info_id',
            'date_issued',
            'date_expires',
        ])
            ->find($prescription->id);

        $prescription->load([
            'employeeInfo:id,first_name,last_name,gender,date_of_birth,license_number,license_expiry_date,specialization,phone_number',
            'patientInfo:id,first_name,last_name,gender,date_of_birth',
        ])->getAppends();

        return Inertia::render('home/prescription/Show', ['prescription' => $prescription]);
    }
}
