<?php

namespace App\Http\Controllers\Employee;

use App\Common\Helpers;
use App\Http\Controllers\Controller;
use App\Http\Requests\Employee\EmployeeRequest;
use App\Http\Requests\QueryRequest;
use App\Mail\EmployeeInfoMail;
use App\Models\EmployeeInfo;
use Auth;
use DB;
use Exception;
use Inertia\Inertia;
use Log;
use Mail;
use Str;

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
    public function doctorSimpleSearch(QueryRequest $request)
    {
        $validated = $request->validated();

        $search = trim($validated['q'] ?? '');

        $isSql = $this->isSqlDriver;

        $employees = EmployeeInfo::whereIsActive(true)
            ->wherePosition('doctor')
            ->when($search, function ($q) use ($search, $isSql) {
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
    public function index(QueryRequest $request)
    {
        Log::info('Employee Info: Employees registered list', ['action_user_id' => Auth::id()]);

        $validated = $request->validated();

        $perPage = $validated['per_page'] ?? 10;
        $search = trim($validated['search'] ?? '');
        $sortBy = $validated['sort_by'] ?? 'id';
        $sortDir = $validated['sort_dir'] ?? 'asc';

        $allowedSorts = ['id', 'first_name', 'last_name', 'position', 'is_active', 'created_at', 'updated_at'];
        if (! in_array($sortBy, $allowedSorts)) {
            $sortBy = 'id';
        }

        $isSql = $this->isSqlDriver;

        $employees = EmployeeInfo::select(['id', 'first_name', 'last_name', 'position', 'is_active', 'created_at', 'updated_at'])
            ->with('user')->when($search, function ($q) use ($isSql, $search) {
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

    /**
     * Show the form for creating a new employee info.
     */
    public function create()
    {
        Log::info('Employee Info: Accessed employee registration page', ['action_user_id' => Auth::id()]);

        return Inertia::render('employees/Create');
    }

    /**
     * Store a newly created employee info in storage.
     */
    public function store(EmployeeRequest $request)
    {
        try {
            $data = $request->validated();

            $genPassword = Str::random(12);
            $request->merge(['password' => $genPassword]);

            $userData = [
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => $request['password'],
            ];

            $employeeData = $request->except(['name', 'email', 'password']);

            $employee = EmployeeInfo::create($employeeData);
            $employee->user()->create($userData);

            Log::info('Employee Info: A new employee was registered in the system.', ['action_user_id' => Auth::id()]);

            Mail::to($employee->user->email)->send(new EmployeeInfoMail($employee, $genPassword));

            return to_route('employee_info.show', ['employee' => $employee->id])->with('success', 'Employee registered successfully.');
        } catch (Exception $e) {
            Log::error('Employee Info: Error while registering new employee', [
                'action_user_id' => Auth::id(),
                'error' => $e->getMessage(),
            ]);

            return back()->withInput()->with('error', 'An error occurred while registering the employee. Please try again.');
        }

    }

    /**
     * Display the specified employee info.
     */
    public function show(EmployeeInfo $employeeInfo)
    {
        Log::info('Employee Info: Accessed employee details page', [
            'action_user_id' => Auth::id(),
            'employee_info_id' => $employeeInfo->id,
        ]);

        $employeeInfo->load([
            'user',
            'contracts' => fn ($q) => $q->orderByDesc('end_date'),
        ]);

        return Inertia::render('employees/Show', ['employee' => $employeeInfo]);
    }
}
