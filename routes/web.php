<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\GroupController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/index', [NoteController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('Index');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::resource('notes', NoteController::class);
    Route::resource('groups', GroupController::class);
    Route::post('groups/join', [GroupController::class, 'join'])->name('groups.join');
    Route::post('groups/leave', [GroupController::class, 'leave'])->name('groups.leave');
});


require __DIR__ . '/auth.php';


