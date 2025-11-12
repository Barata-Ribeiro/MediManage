<?php

namespace App\Http\Controllers\Notice;

use App\Http\Controllers\Controller;
use App\Http\Requests\QueryRequest;
use App\Models\Notice;
use Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class NoticeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(QueryRequest $request)
    {
        Log::info('Notices: Viewed notices list', ['action_user_id' => Auth::id()]);

        $validated = $request->validated();

        $perPage = $validated['per_page'] ?? 10;
        $search = trim($validated['search'] ?? '');
        $sortBy = $validated['sort_by'] ?? 'id';
        $sortDir = $validated['sort_dir'] ?? 'asc';

        $allowedSorts = ['id', 'title', 'type', 'is_active', 'created_at', 'updated_at'];
        if (! in_array($sortBy, $allowedSorts)) {
            $sortBy = 'id';
        }

        $notices = Notice::without('description')->with('user')
            ->when($search, fn ($query) => $query->where('title', 'like', "%$search%")
                ->orWhere('type', 'like', "%$search%"))
            ->orderBy($sortBy, $sortDir)->paginate($perPage)->withQueryString();

        return Inertia::render('notices/Index', ['notices' => $notices]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        Log::info('Notices: Accessed create notice page', ['action_user_id' => Auth::id()]);

        return Inertia::render('notices/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // TODO: Implement notice creation after frontend is ready
        dd($request->all());
    }
}
