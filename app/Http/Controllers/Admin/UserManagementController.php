<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UserAccountRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserManagementController extends Controller
{
    //
    public function index(Request $request)
    {
        $perPage = (int)$request->input('per_page', 10);
        $search = $request->input('search');
        $sortBy = $request->input('sort_by', 'id');
        $sortDir = strtolower($request->input('sort_dir', 'desc')) === 'asc' ? 'asc' : 'desc';

        $allowedSorts = ['id', 'name', 'email', 'created_at', 'updated_at', 'roles'];
        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'id';
        }

        $query = User::with('roles');

        if ($sortBy === 'roles') {
            $query = $query
                ->leftJoin('model_has_roles', 'users.id', '=', 'model_has_roles.model_id')
                ->leftJoin('roles', 'model_has_roles.role_id', '=', 'roles.id')
                ->select('users.*')
                ->groupBy('users.id')
                ->orderBy('roles.name', $sortDir);
        } else {
            $query = $query->orderBy($sortBy, $sortDir);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('users.name', 'LIKE', "%{$search}%")
                    ->orWhere('users.email', 'LIKE', "%{$search}%")
                    ->orWhereHas('roles', function ($roleQuery) use ($search) {
                        $roleQuery->where('roles.name', 'LIKE', "%{$search}%");
                    });
            });
        }

        $users = $query->orderBy($sortBy, $sortDir)
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('admin/users/Index', [
            'users' => $users
        ]);
    }

    public function show(User $user)
    {
        $user->load('roles', 'permissions');
        return Inertia::render('admin/users/Show', [
            'user' => $user
        ]);
    }

    public function edit(User $user)
    {
        $user->load('roles', 'permissions');
        return Inertia::render('admin/users/Edit', [
            'user' => $user
        ]);
    }

    public function update(UserAccountRequest $request, User $user)
    {
        $data = $request->validated();
        $user->update($data);

        if (isset($data['roles'])) {
            $user->syncRoles($data['roles']);
        } else {
            $user->syncRoles([]);
        }

        return to_route('admin.users.edit', $user)->with('success', 'User updated successfully.');
    }
}
