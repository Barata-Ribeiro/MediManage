<?php

namespace App\Http\Controllers\Article;

use App\Http\Controllers\Controller;
use App\Http\Requests\Article\CategoryRequest;
use App\Models\Category;
use Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Log;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Log::info('Categories: Viewed categories list', ['action_user_id' => Auth::id()]);

        $perPage = (int)$request->input('per_page', 10);
        $search = $request->search;
        $sortBy = $request->input('sort_by', 'id');
        $sortDir = strtolower($request->input('sort_dir', 'asc')) === 'desc' ? 'desc' : 'asc';

        $allowedSorts = ['id', 'name', 'created_at', 'updated_at'];
        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'id';
        }

        $categories = Category::when($request->filled('search'), fn($qr) => $qr
            ->whereLike('name', "%$search%"))
            ->orderBy($sortBy, $sortDir)
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('manage/categories/Index', ['categories' => $categories]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CategoryRequest $request)
    {
        $category = Category::create($request->validated());
        Log::info('Categories: Created new category', ['action_user_id' => Auth::id(), 'category_id' => $category->id]);
        return to_route('categories.index')->with('success', 'Category created successfully.');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        Log::info('Categories: Viewed create category page', ['action_user_id' => Auth::id()]);
        return Inertia::render('manage/categories/Create');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category)
    {
        Log::info('Categories: Viewed edit category page', ['action_user_id' => Auth::id(), 'category_id' => $category->id]);
        return Inertia::render('manage/categories/Edit', ['category' => $category]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CategoryRequest $request, Category $category)
    {
        $category->update($request->validated());
        Log::info('Categories: Updated category', ['action_user_id' => Auth::id(), 'category_id' => $category->id]);
        return to_route('categories.index')->with('success', 'Category updated successfully.');
    }
}
