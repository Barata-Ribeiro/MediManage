<?php

namespace App\Http\Controllers\Employee;

use App\Common\Helpers;
use App\Http\Controllers\Controller;
use App\Models\EmployeeInfo;
use Auth;
use DB;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Log;

class EmployeeInfoController extends Controller
{
    private bool $isSqlDriver;

    public function __construct()
    {
        $this->isSqlDriver = in_array(DB::getDriverName(), ['mysql', 'pgsql']);
    }

    /**
     * Simple search for doctors (for FETCH/AXIOS requests).
     */
    public function doctorSimpleSearch(Request $request)
    {
        $search = trim($request->query('q'));

        $isSql = $this->isSqlDriver;

        $employees = EmployeeInfo::whereIsActive(true)
            ->wherePosition('doctor')
            ->when($request->filled('q'), function ($q) use ($search, $isSql) {
                if ($isSql) {
                    $booleanQuery = Helpers::buildBooleanQuery($search);
                    $q->whereFullText(['first_name', 'last_name', 'phone_number', 'address', 'specialization', 'position'], $booleanQuery, ['mode' => 'boolean'])
                        ->orWhereHas('user', fn ($q2) => $q2->whereLike('name', "%$search%")->orWhereLike('email', "%$search%"));
                } else {
                    $q->whenLike('first_name', "%$search%")->orWhenLike('last_name', "%$search%")
                        ->orWhenLike('phone_number', "%$search%")->orWhenLike('address', "%$search%")
                        ->orWhenLike('specialization', "%$search%")->orWhenLike('position', "%$search%");
                }
            })
            ->select(['id', 'first_name', 'last_name'])
            ->orderBy('first_name', 'asc')
            ->paginate(10)
            ->withQueryString();

        return response()->json($employees);
    }

    /**
     * Display a listing of the employee info.
     */
    public function index(Request $request)
    {
        Log::info('Employee Info: Employees registered list', ['action_user_id' => Auth::id()]);

        $perPage = (int) $request->query('per_page', 10);
        $search = trim($request->query('search'));
        $sortBy = $request->query('sort_by', 'id');
        $sortDir = strtolower($request->query('sort_dir', 'desc')) === 'asc' ? 'asc' : 'desc';

        $allowedSorts = ['id', 'first_name', 'last_name', 'position', 'is_active', 'created_at', 'updated_at'];
        if (! in_array($sortBy, $allowedSorts)) {
            $sortBy = 'id';
        }

        $isSql = $this->isSqlDriver;

        $employees = EmployeeInfo::select(['id', 'first_name', 'last_name', 'position', 'is_active', 'created_at', 'updated_at'])
            ->with('user')->when($request->filled('search'), function ($q) use ($isSql, $search) {
                if ($isSql) {
                    $booleanQuery = Helpers::buildBooleanQuery($search);
                    $q->whereFullText(['first_name', 'last_name', 'phone_number', 'address', 'specialization', 'position'], $booleanQuery, ['mode' => 'boolean'])
                        ->orWhereHas('user', fn ($q2) => $q2->whereLike('name', "%$search%")->orWhereLike('email', "%$search%"));
                } else {
                    $q->whenLike('first_name', "%$search%")
                        ->orWhenLike('last_name', "%$search%")->orWhenLike('phone_number', "%$search%")
                        ->orWhenLike('address', "%$search%")->orWhenLike('specialization', "%$search%")->orWhenLike('position', "%$search%")
                        ->orWhereHas('user', fn ($q2) => $q2->whereLike('name', "%$search%")->orWhereLike('email', "%$search%"));
                }
            })
            ->orderBy($sortBy, $sortDir)
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('employees/Index', ['employees' => $employees]);
    }

    public function create()
    {
        Log::info('Employee Info: Accessed employee registration page', ['action_user_id' => Auth::id()]);

        return Inertia::render('employees/Create');
    }
}
