<?php

namespace App\Http\Controllers\Employee;

use App\Common\Helpers;
use App\Http\Controllers\Controller;
use App\Models\EmployeeInfo;
use DB;
use Illuminate\Http\Request;

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
}
