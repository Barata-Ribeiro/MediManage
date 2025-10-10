<?php

namespace App\Http\Controllers\General;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Category;
use App\Models\Prescription;
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
        $search = $request->query('search');
        $start_date = $request->query('start_date_creation');
        $end_date = $request->query('end_date_creation');

        $articles = Article::whereIsPublished(true)
            ->with(['user' => fn($query) => $query->select('id', 'name', 'avatar')])
            ->with(['categories' => fn($query) => $query->select('id', 'name')])
            ->when($request->filled('category'), function ($query) use ($category) {
                $names = array_filter(array_map('trim', explode(',', $category)));
                return $query->whereHas('categories', fn($q) => $q->whereIn('name', $names));
            })
            ->when($request->filled('search'), fn($query) => $query->whereFullText(['title', 'subtitle', 'excerpt', 'content_html'], "%$search%")
                ->orWhereHas('user', fn($q) => $q->whereLike('name', "%$search%")))
            ->when($request->filled('start_date_creation'), fn($query) => $query->whereDate('created_at', '>=', $start_date))
            ->when($request->filled('end_date_creation'), fn($query) => $query->whereDate('created_at', '<=', $end_date))
            ->latest()
            ->paginate(10, ['id', 'user_id', 'title', 'slug', 'excerpt', 'thumbnail', 'created_at'])
            ->withQueryString();

        $categories = Category::withCount(['articles as articles_count' => fn($query) => $query->whereIsPublished(true)])->get();

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
            ->load('user')
            ->load(['categories' => fn($query) => $query->select('id', 'name')]);

        return Inertia::render('home/articles/Show', [
            'article' => $article,
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
        $prescription = Prescription::select(['id', 'validation_code', 'is_valid', 'patient_info_id',
            'employee_info_id', 'date_issued', 'date_expires'])
            ->find($prescription->id);

        $prescription->load([
            'employeeInfo:id,first_name,last_name,gender,date_of_birth,license_number,license_expiry_date,specialization,phone_number',
            'patientInfo:id,first_name,last_name,gender,date_of_birth'
        ])->getAppends();

        return Inertia::render('home/prescription/Show', ['prescription' => $prescription]);
    }
}
