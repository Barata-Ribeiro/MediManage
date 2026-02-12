<?php

namespace App\Http\Controllers\Article;

use App\Http\Controllers\Controller;
use App\Http\Requests\Article\CategoryRequest;
use App\Http\Requests\QueryRequest;
use App\Models\Category;
use Auth;
use Exception;
use Inertia\Inertia;
use Log;

use function in_array;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(QueryRequest $request)
    {
        Log::info('Categories: Viewed categories list', ['action_user_id' => Auth::id()]);

        $validated = $request->validated();

        $perPage = $validated['per_page'] ?? 10;
        $search = trim($validated['search'] ?? '');
        $sortBy = $validated['sort_by'] ?? 'id';
        $sortDir = $validated['sort_dir'] ?? 'asc';

        $allowedSorts = ['id', 'name', 'created_at', 'updated_at'];
        if (! in_array($sortBy, $allowedSorts)) {
            $sortBy = 'id';
        }

        $categories = Category::when($search, fn ($qr) => $qr
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
        try {
            $category = Category::create($request->validated());
            Log::info('Categories: Created new category', ['action_user_id' => Auth::id(), 'category_id' => $category->id]);

            return to_route('categories.index')->with('success', 'Category created successfully.');
        } catch (Exception $e) {
            Log::error('Categories: Failed to create category', ['action_user_id' => Auth::id(), 'error' => $e->getMessage()]);

            return back()->withInput()->with('error', 'Failed to create category. Please try again.');
        }
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
        try {
            $category->update($request->validated());
            Log::info('Categories: Updated category', ['action_user_id' => Auth::id(), 'category_id' => $category->id]);

            return to_route('categories.index')->with('success', 'Category updated successfully.');
        } catch (Exception $e) {
            Log::error('Categories: Failed to update category', ['action_user_id' => Auth::id(), 'category_id' => $category->id, 'error' => $e->getMessage()]);

            return back()->withInput()->with('error', 'Failed to update category. Please try again.');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        try {
            $category->delete();
            Log::info('Categories: Deleted category', ['action_user_id' => Auth::id(), 'category_id' => $category->id]);

            return to_route('categories.index')->with('success', 'Category deleted successfully.');
        } catch (Exception $e) {
            Log::error('Categories: Failed to delete category', ['action_user_id' => Auth::id(), 'category_id' => $category->id, 'error' => $e->getMessage()]);

            return back()->with('error', 'Failed to delete category. Please try again.');
        }
    }
}
