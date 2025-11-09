<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\RoleRequest;
use App\Http\Requests\QueryRequest;
use Auth;
use Exception;
use Inertia\Inertia;
use Log;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(QueryRequest $request)
    {
        Log::info('Role Management: Viewed role list', ['action_user_id' => Auth::id()]);

        $validated = $request->validated();

        $perPage = $validated['per_page'] ?? 10;
        $search = trim($validated['search'] ?? '');
        $sortBy = $validated['sort_by'] ?? 'id';
        $sortDir = $validated['sort_dir'] ?? 'asc';

        $allowedSorts = ['id', 'name', 'guard_name', 'created_at', 'updated_at', 'users_count'];
        if (! in_array($sortBy, $allowedSorts)) {
            $sortBy = 'id';
        }

        $roles = Role::withCount('users as users_count')
            ->when($request->filled('search'), fn ($query) => $query->whereLike('name', "%$search%")
                ->orWhereLike('guard_name', "%$search%"))
            ->orderBy($sortBy, $sortDir)
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('admin/roles/Index', [
            'roles' => $roles,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Role $role, QueryRequest $request)
    {
        Log::info('Role Management: Viewed role edit form', ['action_user_id' => Auth::id(), 'edited_role_id' => $role->id]);

        $validated = $request->validated();
        $search = trim($validated['search'] ?? '');

        $allPermissions = Permission::select(['id', 'name'])
            ->when($search, fn ($query) => $query->whereLike('name', "%$search%"))
            ->orderBy('name', 'ASC')->paginate(10);

        return Inertia::render('admin/roles/Edit', [
            'role' => $role->load('permissions:name'),
            'allPermissions' => $allPermissions,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(RoleRequest $request, Role $role)
    {
        try {
            $data = $request->validated();
            $role->update($data);

            Log::info('Role Management: Updated role', ['action_user_id' => Auth::id(), 'updated_role_id' => $role->id]);

            return to_route('admin.roles.index')->with('success', 'Role updated successfully.');
        } catch (Exception $e) {
            Log::error('Role Management: Failed to update role', [
                'action_user_id' => Auth::id(),
                'role_id' => $role->id,
                'error' => $e->getMessage(),
            ]);

            return back()->withInput()->with('error', 'Failed to update role. Please try again.');
        }
    }

    /**
     * Toggle permission for the specified role.
     */
    public function togglePermission(Role $role, Permission $permission)
    {
        try {
            $action = $role->permissions->contains($permission)
                ? 'block'
                : 'grant';

            $actionWord = $action === 'grant' ? 'granted' : 'revoked';

            $role->{$action === 'grant' ? 'givePermissionTo' : 'revokePermissionTo'}($permission);

            Log::info("Role Management: $actionWord permission", [
                'action_user_id' => Auth::id(),
                'role_id' => $role->id,
                'permission_id' => $permission->id,
                'action' => $action,
            ]);

            return to_route('admin.roles.edit', $role)->with('success', "Permission $actionWord to role $role->name successfully.");
        } catch (Exception $e) {
            Log::error('Role Management: Failed to toggle permission', [
                'action_user_id' => Auth::id(),
                'role_id' => $role->id,
                'permission_id' => $permission->id,
                'error' => $e->getMessage(),
            ]);

            return back()->withInput()->with('error', 'Failed to update permission. Please try again.');
        }
    }
}
