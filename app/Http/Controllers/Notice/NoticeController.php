<?php

namespace App\Http\Controllers\Notice;

use App\Http\Controllers\Controller;
use App\Http\Requests\Notice\NoticeRequest;
use App\Http\Requests\QueryRequest;
use App\Models\Notice;
use Auth;
use Exception;
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
    public function store(NoticeRequest $request)
    {
        try {
            $user = Auth::user();
            $data = $request->validated();

            Log::info('Notices: Created new notice', ['action_user_id' => $user->id, 'notice_title' => $data['title']]);
            $data['user_id'] = $user->id;
            Notice::create($data);

            return to_route('notices.index')->with('success', 'Notice created successfully.');
        } catch (Exception $e) {
            Log::error('Notices: Failed to create notice', ['action_user_id' => $user->id, 'error' => $e->getMessage()]);

            return redirect()->back()->withInput()->with('error', 'Failed to create notice. Please try again.');
        }
    }
}
