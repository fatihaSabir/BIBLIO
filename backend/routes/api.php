<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookController;
use App\Http\Controllers\Api\AdminController;
use Illuminate\Support\Facades\Route;

// ═══════════════════════════════════════
// PUBLIC — sans authentification
// ═══════════════════════════════════════
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);
Route::get('/books',              [BookController::class, 'index']);
Route::get('/books/{book}',       [BookController::class, 'show']);
Route::get('/categories',         [BookController::class, 'categories']);

// ═══════════════════════════════════════
// AUTHENTIFIE — token requis
// ═══════════════════════════════════════
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);

    // ── ADMIN seulement ──────────────────
    Route::middleware('role:admin')->group(function () {

        // Livres
        Route::post('/books',          [BookController::class, 'store']);
        Route::post('/books/{book}',   [BookController::class, 'update']);  // FormData
        Route::put('/books/{book}',    [BookController::class, 'update']);  // JSON
        Route::delete('/books/{book}', [BookController::class, 'destroy']);

        // Categories
        Route::post('/categories',             [BookController::class, 'storeCategory']);
        Route::delete('/categories/{category}',[BookController::class, 'destroyCategory']);

        // Utilisateurs
        Route::get('/users',                [AdminController::class, 'users']);
        Route::put('/users/{user}/role',    [AdminController::class, 'changeRole']);
        Route::post('/users/{user}/toggle', [AdminController::class, 'toggleStatus']);
        Route::delete('/users/{user}',      [AdminController::class, 'deleteUser']);
    });
});
