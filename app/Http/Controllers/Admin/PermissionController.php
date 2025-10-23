<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Log;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Log::info('Permission Management: Viewed permission list', ['action_user_id' => Auth::id()]);

        $perPage = (int)$request->input('per_page', 10);
        $search = $request->search;
        $sortBy = $request->input('sort_by', 'id');
        $sortDir = strtolower($request->input('sort_dir', 'asc')) === 'desc' ? 'desc' : 'asc';

        $allowedSorts = ['id', 'title', 'name', 'guard_name', 'created_at', 'updated_at'];
        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'id';
        }

        $permissions = Permission::when($request->filled('search'), fn($query) => $query->whereLike('name', "%$search%")
            ->orWhereLike('title', "%$search%")
            ->orWhereLike('guard_name', "%$search%"))
            ->orderBy($sortBy, $sortDir)
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('admin/permissions/Index', [
            'permissions' => $permissions
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Permission $permission)
    {
        Log::info('Permission Management: Viewed permission details', ['action_user_id' => Auth::id(), 'permission_id' => $permission->id]);

        $permission->load('roles');

        return Inertia::render('admin/permissions/Show', [
            'permission' => $permission
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Permission $permission)
    {
        Log::info('Permission Management: Accessed permission edit page', ['action_user_id' => Auth::id(), 'permission_id' => $permission->id]);

        return Inertia::render('admin/permissions/Edit', [
            'permission' => $permission,
            'defaultGuard' => config('auth.defaults.guard'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Permission $permission)
    {
        try {
            $validatedData = $request->validate([
                'title' => 'required|string|max:255',
                'guard_name' => 'required|string|max:255',
            ]);

            $permission->update($validatedData);

            Log::info('Permission Management: Updated permission', ['action_user_id' => Auth::id(), 'permission_id' => $permission->id]);

            return to_route('admin.permissions.index')->with('success', 'Permission updated successfully.');
        } catch (\Exception $e) {
            Log::error('Permission Management: Failed to update permission', ['action_user_id' => Auth::id(), 'permission_id' => $permission->id, 'error' => $e->getMessage()]);

            return back()->withInput()->with('error', 'Failed to update permission. Please try again.');
        }
    }
}
