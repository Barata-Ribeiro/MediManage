<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    //
    public function index()
    {
        $roles = Role::orderBy('id', 'DESC')->paginate(10);
        return Inertia::render('admin/roles/Index', [
            'roles' => $roles
        ]);
    }
}
