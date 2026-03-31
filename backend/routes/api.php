<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookController;
use App\Http\Controllers\Api\EmpruntController;
use App\Http\Controllers\Api\AdminController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — Application Bibliothèque
|--------------------------------------------------------------------------
|
| 3 niveaux d'accès :
|   PUBLIC    → accessible sans token
|   LECTEUR   → token requis (lecteur ou admin)
|   ADMIN     → token requis + rôle admin
|
*/

// ══════════════════════════════════════════════
// ROUTES PUBLIQUES — sans authentification
// ══════════════════════════════════════════════

// Authentification
Route::post('/register', [AuthController::class, 'register']);  // Inscription
Route::post('/login',    [AuthController::class, 'login']);     // Connexion

// Catalogue public — tout le monde peut voir les livres
Route::get('/books',           [BookController::class, 'index']);       // Liste des livres
Route::get('/books/{book}',    [BookController::class, 'show']);        // Détail d'un livre
Route::get('/categories',      [BookController::class, 'categories']); // Liste des catégories

// Statistiques publiques (page d'accueil)
Route::get('/statistics',      [EmpruntController::class, 'statistics']);


// ══════════════════════════════════════════════
// ROUTES AUTHENTIFIÉES — token Sanctum requis
// ══════════════════════════════════════════════
Route::middleware('auth:sanctum')->group(function () {

    // ── Profil utilisateur ────────────────────
    Route::post('/logout',           [AuthController::class, 'logout']);         // Déconnexion
    Route::get('/me',                [AuthController::class, 'me']);             // Mon profil
    Route::put('/profile',           [AuthController::class, 'updateProfile']); // Modifier profil
    Route::post('/change-password',  [AuthController::class, 'changePassword']); // Changer MDP


    // ══════════════════════════════════════════
    // ROUTES LECTEUR — rôle lecteur ou admin
    // ══════════════════════════════════════════
    Route::middleware('role:lecteur,admin')->group(function () {

        // Emprunts du lecteur
        Route::post('/emprunts',
            [EmpruntController::class, 'store']);                    // Demander un emprunt

        Route::get('/mes-emprunts',
            [EmpruntController::class, 'myEmprunts']);               // Mes emprunts

        Route::post('/emprunts/{emprunt}/signal-retour',
            [EmpruntController::class, 'signalRetour']);             // Signaler un retour
    });


    // ══════════════════════════════════════════
    // ROUTES ADMIN — rôle admin uniquement
    // ══════════════════════════════════════════
    Route::middleware('role:admin')->group(function () {

        // ── Gestion des livres ────────────────
        Route::post('/books',
            [BookController::class, 'store']);                       // Ajouter un livre

        Route::post('/books/{book}',
            [BookController::class, 'update']);                      // Modifier (avec FormData)

        Route::put('/books/{book}',
            [BookController::class, 'update']);                      // Modifier (JSON)

        Route::delete('/books/{book}',
            [BookController::class, 'destroy']);                     // Supprimer un livre

        // ── Gestion des catégories ────────────
        Route::post('/categories',
            [BookController::class, 'storeCategory']);               // Ajouter catégorie

        Route::put('/categories/{category}',
            [BookController::class, 'updateCategory']);              // Modifier catégorie

        Route::delete('/categories/{category}',
            [BookController::class, 'destroyCategory']);             // Supprimer catégorie

        // ── Gestion des emprunts ──────────────
        Route::get('/emprunts',
            [EmpruntController::class, 'index']);                    // Tous les emprunts

        Route::post('/emprunts/{emprunt}/approve',
            [EmpruntController::class, 'approve']);                  // Approuver emprunt

        Route::post('/emprunts/{emprunt}/confirm-retour',
            [EmpruntController::class, 'confirmRetour']);            // Confirmer retour

        Route::post('/emprunts/{emprunt}/refuse',
            [EmpruntController::class, 'refuse']);                   // Refuser emprunt

        // ── Gestion des utilisateurs ──────────
        Route::get('/users',
            [AdminController::class, 'users']);                      // Liste utilisateurs

        Route::get('/users/{user}',
            [AdminController::class, 'showUser']);                   // Détail utilisateur

        Route::post('/users/{user}/toggle-status',
            [AdminController::class, 'toggleUserStatus']);           // Activer/Désactiver

        Route::put('/users/{user}/role',
            [AdminController::class, 'changeRole']);                 // Changer rôle

        Route::delete('/users/{user}',
            [AdminController::class, 'deleteUser']);                 // Supprimer utilisateur

        Route::post('/admin/create-admin',
            [AdminController::class, 'createAdmin']);                // Créer un admin
    });
});