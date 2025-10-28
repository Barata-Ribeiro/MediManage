<?php

namespace App\Http\Controllers\Employee;

use App\Common\Helpers;
use App\Http\Controllers\Controller;
use App\Models\EmployeeInfo;
use Illuminate\Http\Request;

class EmployeeInfoController extends Controller
{
    /**
     * Simple search for doctors (for FETCH/AXIOS requests).
     */
    public function doctorSimpleSearch(Request $request)
    {
        $search = trim($request->q);

        $booleanQuery = Helpers::buildBooleanQuery($search);

        $employees = EmployeeInfo::whereIsActive(true)
            ->whereHas('user', fn ($q) => $q->where('role', 'Doctor'))
            ->when($request->filled('q'), fn ($q) => $q->whereFullText(['first_name', 'last_name', 'phone_number', 'address', 'specialization', 'position'], $booleanQuery, ['mode' => 'boolean'])
                ->orWhereHas('user', fn ($q2) => $q2->whereLike('name', "%$search%")->orWhereLike('email', "%$search%")))
            ->select(['id', 'first_name', 'last_name'])
            ->orderBy('first_name', 'asc')
            ->paginate(10)
            ->withQueryString();

        return response()->json($employees);
    }
}
