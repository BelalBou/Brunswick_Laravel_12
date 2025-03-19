<?php

use Illuminate\Support\Facades\Route;
use App\Livewire\Pages\Home;
use App\Livewire\Pages\Login;
use App\Livewire\Pages\Menus;
use App\Livewire\Pages\Cart;
use App\Livewire\Pages\Orders;
use App\Livewire\Pages\MenusCarriedAway;
use App\Livewire\Pages\Account;
use App\Livewire\Admin\ManageUsers;
use App\Livewire\Admin\ManageSuppliers;
use App\Livewire\Admin\ManageCategories;
use App\Livewire\Admin\ManageMenuSizes;
use App\Livewire\Admin\ManageAllergies;
use App\Livewire\Admin\ManageExtras;
use App\Livewire\Admin\ManageMenus;
use App\Livewire\Admin\ManageSettings;

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

// Routes publiques
Route::get('/', Home::class)->name('home');
Route::get('/login', Login::class)->name('login');
Route::get('/login/{id}', Login::class)->name('login-as');

// Routes protégées
Route::middleware(['auth'])->group(function () {
    // Routes principales
    Route::get('/menus', Menus::class)->name('menus');
    Route::get('/menus/{id}', Menus::class)->name('menus.show');
    Route::get('/cart', Cart::class)->name('cart');
    Route::get('/cart/{id}', Cart::class)->name('cart.show');
    Route::get('/orders', Orders::class)->name('orders');
    Route::get('/orders/{id}', Orders::class)->name('orders.show');
    Route::get('/menus-carried-away', MenusCarriedAway::class)->name('menus-carried-away');
    Route::get('/account', Account::class)->name('account');

    // Routes d'administration
    Route::middleware(['admin'])->group(function () {
        Route::get('/manage-users', ManageUsers::class)->name('manage-users');
        Route::get('/manage-suppliers', ManageSuppliers::class)->name('manage-suppliers');
        Route::get('/manage-categories', ManageCategories::class)->name('manage-categories');
        Route::get('/manage-menu-sizes', ManageMenuSizes::class)->name('manage-menu-sizes');
        Route::get('/manage-allergies', ManageAllergies::class)->name('manage-allergies');
        Route::get('/manage-extras', ManageExtras::class)->name('manage-extras');
        Route::get('/manage-menus', ManageMenus::class)->name('manage-menus');
        Route::get('/manage-settings', ManageSettings::class)->name('manage-settings');
    });
});
