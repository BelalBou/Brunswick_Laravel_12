<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\MenuController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ExtraController;
use App\Http\Controllers\Api\AllergyController;
use App\Http\Controllers\Api\SupplierController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\DictionaryController;
use App\Http\Controllers\Api\DailyEmailController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Routes publiques
Route::post('/login', [UserController::class, 'login']);
Route::get('/login-as/{id}', [UserController::class, 'loginAs']);

// Routes protégées
Route::middleware('auth:sanctum')->group(function () {
    // Route de déconnexion
    Route::post('/logout', [UserController::class, 'logout']);
    
    // Routes principales
    Route::apiResource('menus', MenuController::class);
    Route::post('menus/upload-picture', [MenuController::class, 'uploadPicture']);
    Route::get('menus/supplier/{id}', [MenuController::class, 'listBySupplier']);

    Route::apiResource('orders', OrderController::class);
    Route::get('orders/date/{date}', [OrderController::class, 'listByDate']);
    Route::get('orders/customer/{id}', [OrderController::class, 'listByCustomer']);
    Route::get('orders/supplier/{id}', [OrderController::class, 'listBySupplier']);

    Route::apiResource('users', UserController::class);
    Route::put('users/language', [UserController::class, 'updateLanguage']);

    // Routes d'administration
    Route::middleware('admin')->group(function () {
        Route::apiResource('categories', CategoryController::class);
        Route::apiResource('extras', ExtraController::class);
        Route::get('extras/supplier/{id}', [ExtraController::class, 'listBySupplier']);
        Route::apiResource('allergies', AllergyController::class);
        Route::apiResource('suppliers', SupplierController::class);
        Route::apiResource('settings', SettingController::class);
        Route::get('settings/key/{key}', [SettingController::class, 'getByKey']);
        Route::apiResource('dictionaries', DictionaryController::class);
        Route::get('dictionaries/key/{key}', [DictionaryController::class, 'getByKey']);
        Route::get('dictionaries/language/{language}', [DictionaryController::class, 'getByLanguage']);
        Route::apiResource('daily-emails', DailyEmailController::class);
        Route::post('daily-emails/{dailyEmail}/send', [DailyEmailController::class, 'send']);
        Route::get('daily-emails/date/{date}', [DailyEmailController::class, 'getByDate']);
    });
}); 