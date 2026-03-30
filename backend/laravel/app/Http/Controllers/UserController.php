<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    // Afficher liste des users
    public function index()
    {
        $users = User::all();
        return view('admin.users.index', compact('users'));
    }

    // Modifier rôle d'un user
    public function updateRole(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $user->role = $request->role; // admin / lecteur
        $user->save();

        return redirect()->back()->with('success', 'Rôle mis à jour !');
    }
}