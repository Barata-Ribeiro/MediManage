<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\RoleRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    //
    public function index(Request $request)
    {
        $perPage = (int)$request->input('per_page', 10);
        $search = $request->search;
        $sortBy = $request->input('sort_by', 'id');
        $sortDir = strtolower($request->input('sort_dir', 'desc')) === 'asc' ? 'asc' : 'desc';

        $allowedSorts = ['id', 'name', 'guard_name', 'created_at', 'updated_at', 'users_count'];
        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'id';
        }

        $roles = Role::withCount('users as users_count')
            ->when($request->filled('search'), fn($query) => $query->whereLike('name', "%{$search}%")
                ->orWhereLike('guard_name', "%{$search}%"))
            ->orderBy($sortBy, $sortDir)
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('admin/roles/Index', [
            'roles' => $roles
        ]);
    }

    public function edit(Role $role)
    {
        return Inertia::render('admin/roles/Edit', [
            'role' => $role
        ]);
    }

    public function update(RoleRequest $request, Role $role)
    {
        $data = $request->validated();
        $role->update($data);

        return to_route('admin.roles.index')->with('success', 'Role updated successfully.');
    }
}
