<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/admin/users', [UserController::class, 'index']);
    Route::post('/admin/users/{id}/role', [UserController::class, 'updateRole']);
    Route::get('/admin/books', [BookController::class, 'index']);
    Route::post('/admin/books', [BookController::class, 'store']);
Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/admin/users', [UserController::class, 'index']);
    Route::post('/admin/users/{id}/role', [UserController::class, 'updateRole']);
});
});