<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UserAccountRequest;
use App\Models\User;
use DB;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserManagementController extends Controller
{
    public function index(Request $request)
    {
        $perPage = (int)$request->input('per_page', 10);
        $search = $request->search;
        $sortBy = $request->input('sort_by', 'id');
        $sortDir = strtolower($request->input('sort_dir', 'desc')) === 'asc' ? 'asc' : 'desc';

        $allowedSorts = ['id', 'name', 'email', 'created_at', 'updated_at', 'roles'];
        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'id';
        }

        $query = User::with('roles')->select('users.*');

        $query->when($request->filled('search'), fn($qr) => $qr->whereLike('users.name', "%$search%")
            ->orWhereLike('users.email', "%$search%")
            ->orWhereHas('roles', fn($q) => $q->whereLike('roles.name', "%$search%")));

        if ($sortBy === 'roles') {
            $rolesSub = DB::table('model_has_roles')
                ->join('roles', 'roles.id', '=', 'model_has_roles.role_id')
                ->select('model_has_roles.model_id', DB::raw("GROUP_CONCAT(roles.name ORDER BY roles.name SEPARATOR ', ') as roles_names"))
                ->where('model_has_roles.model_type', User::class)
                ->groupBy('model_has_roles.model_id');

            $query->leftJoinSub($rolesSub, 'r', fn($join) => $join->on('users.id', '=', 'r.model_id'));

            $query->orderBy(DB::raw('COALESCE(r.roles_names, "")'), $sortDir);
        } else {
            $query->orderBy("users.$sortBy", $sortDir);
        }

        $users = $query->paginate($perPage)->withQueryString();

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
