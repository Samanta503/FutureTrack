<?php

use App\Http\Controllers\CareerController;
use Illuminate\Support\Facades\Route;

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

Route::get('/health', [CareerController::class, 'health']);
Route::get('/users/{id}', [CareerController::class, 'user']);
Route::get('/jobs', [CareerController::class, 'jobs']);
Route::get('/courses', [CareerController::class, 'courses']);
Route::get('/recommendations', [CareerController::class, 'recommendations']);
