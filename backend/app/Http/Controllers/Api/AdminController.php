<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\{Request, JsonResponse};

class AdminController extends Controller
{
    // LISTE UTILISATEURS
    public function users(Request $request): JsonResponse
    {
        $q = User::query();
        if ($request->search) {
            $s = $request->search;
            $q->where(fn($x) => $x->where('name','like',"%$s%")->orWhere('email','like',"%$s%"));
        }
        if ($request->role) $q->where('role', $request->role);
        return response()->json($q->withCount('emprunts')->latest()->paginate(15), 200);
    }

    // CHANGER ROLE
    public function changeRole(Request $request, User $user): JsonResponse
    {
        $request->validate(['role'=>'required|in:lecteur,admin']);
        if ($user->id === $request->user()->id)
            return response()->json(['message'=>'Impossible de changer votre propre role.'], 403);
        $user->update(['role'=>$request->role]);
        return response()->json(['message'=>'Role mis a jour.','user'=>$user], 200);
    }

    // ACTIVER / DESACTIVER
    public function toggleStatus(User $user): JsonResponse
    {
        if ($user->isAdmin())
            return response()->json(['message'=>'Impossible de modifier un admin.'], 403);
        $user->update(['is_active'=>!$user->is_active]);
        return response()->json(['message'=>'Statut mis a jour.','user'=>$user], 200);
    }

    // SUPPRIMER
    public function deleteUser(User $user): JsonResponse
    {
        if ($user->isAdmin())
            return response()->json(['message'=>'Impossible de supprimer un admin.'], 403);
        if ($user->emprunts()->whereIn('status',['en_attente','approuve'])->exists())
            return response()->json(['message'=>'Emprunts actifs existent.'], 422);
        $user->delete();
        return response()->json(['message'=>'Utilisateur supprime.'], 200);
    }
}
