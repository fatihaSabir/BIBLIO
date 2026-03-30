<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\BookController;
Route::get('/', function () {
    return view('welcome');
});
Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/admin/users', [UserController::class, 'index']);
    Route::post('/admin/users/{id}/role', [UserController::class, 'updateRole']);
    
    Route::get('/admin/books', [BookController::class, 'index']);
    Route::post('/admin/books', [BookController::class, 'store']);
    Route::put('/admin/books/{id}', [BookController::class, 'update']);
    Route::delete('/admin/books/{id}', [BookController::class, 'destroy']);
});