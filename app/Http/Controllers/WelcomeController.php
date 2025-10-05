<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WelcomeController extends Controller
{
    /**
     * Mostrar la página de bienvenida después del registro
     */
    public function index(): Response
    {
        return Inertia::render('welcome', [
            'auth' => [
                'user' => [
                    'id' => auth()->user()->id,
                    'name' => auth()->user()->name,
                    'avatar' => auth()->user()->avatar,
                ]
            ]
        ]);
    }
}
