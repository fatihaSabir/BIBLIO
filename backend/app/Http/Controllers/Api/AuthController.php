<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    // INSCRIPTION
    public function register(Request $request): JsonResponse
    {
        $request->validate([
            'name'                  => 'required|string|max:255',
            'email'                 => 'required|email|unique:users,email',
            'password'              => 'required|string|min:8|confirmed',
            'password_confirmation' => 'required',
            'phone'                 => 'nullable|string|max:20',
            'address'               => 'nullable|string|max:255',
        ]);

        $user  = User::create([
            'name'      => $request->name,
            'email'     => $request->email,
            'password'  => Hash::make($request->password),
            'phone'     => $request->phone,
            'address'   => $request->address,
            'role'      => 'lecteur',
            'is_active' => true,
        ]);
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json(['message'=>'Inscription reussie.','user'=>$user,'token'=>$token], 201);
    }

    // CONNEXION
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Email ou mot de passe incorrect.'],
            ]);
        }

        if (!$user->is_active) {
            return response()->json(['message'=>'Compte desactive.'], 403);
        }

        $user->tokens()->delete();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json(['message'=>'Connexion reussie.','user'=>$user,'token'=>$token], 200);
    }

    // DECONNEXION
    public function logout(Request $request): JsonResponse
    {
        $request->user()->tokens()->delete();
        return response()->json(['message'=>'Deconnexion reussie.'], 200);
    }

    // PROFIL
    public function me(Request $request): JsonResponse
    {
        return response()->json($request->user(), 200);
    }
}
