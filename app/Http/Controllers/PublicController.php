<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class PublicController extends Controller
{
    /**
     * Display the homepage with the latest 3 published articles.
     */
    public function home()
    {
        return Inertia::render('welcome');
    }
}
