<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// Toutes les routes non-API seront gérées par React
Route::get('/{any?}', function () {
    return view('app'); // Assurez-vous d'avoir un fichier resources/views/app.blade.php
})->where('any', '.*');

// Routes protégées
Route::middleware(['auth'])->group(function () {
    // Routes principales
    
    // Routes d'administration
    Route::middleware(['admin'])->group(function () {
        // Routes d'administration ici
    });
});
