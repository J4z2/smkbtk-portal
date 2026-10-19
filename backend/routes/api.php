<?php

use App\Http\Controllers\Api\AbsenceNoticeController;
use App\Http\Controllers\Api\Admin\AnalyticsController;
use App\Http\Controllers\Api\Admin\AssessmentController;
use App\Http\Controllers\Api\Admin\AuditLogController;
use App\Http\Controllers\Api\Admin\ImportController;
use App\Http\Controllers\Api\Admin\ParentAccountController;
use App\Http\Controllers\Api\Admin\SettingsController;
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\AnnouncementController;
use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BootstrapController;
use App\Http\Controllers\Api\InterventionController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Middleware\EnsureAccountReady;
use Illuminate\Support\Facades\Route;

/*
| JSON API for the portal. Uses the web session (cookie) and CSRF
| protection, so the browser app must send the X-XSRF-TOKEN header.
*/

Route::post('login', [AuthController::class, 'login']);

Route::middleware('auth')->group(function () {
    // Allowed before the account is ready (password change, consent).
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('me', [AuthController::class, 'me']);
    Route::post('password', [AuthController::class, 'changePassword']);
    Route::get('privacy-notice', [AuthController::class, 'privacyNotice']);
    Route::post('privacy-notice/accept', [AuthController::class, 'acceptPrivacyNotice']);

    Route::middleware(EnsureAccountReady::class)->group(function () {
        Route::get('bootstrap', BootstrapController::class);

        Route::get('students', [StudentController::class, 'index']);
        Route::post('students', [StudentController::class, 'store']);
        Route::get('students/{student}', [StudentController::class, 'show']);
        Route::patch('students/{student}', [StudentController::class, 'update']);
        Route::post('students/{student}/move', [StudentController::class, 'move']);
        Route::post('students/{student}/status', [StudentController::class, 'setStatus']);
        Route::get('students/{student}/photo', [StudentController::class, 'photo']);
        Route::post('students/{student}/photo', [StudentController::class, 'uploadPhoto']);
        Route::get('students/{student}/reports', [ReportController::class, 'forStudent']);
        Route::get('students/{student}/attendance', [AttendanceController::class, 'studentMonth']);

        Route::get('classes/{class}/reports', [ReportController::class, 'forClass']);
        Route::post('classes/{class}/reports/bulk', [ReportController::class, 'bulk']);
        Route::get('classes/{class}/attendance', [AttendanceController::class, 'classDay']);
        Route::put('classes/{class}/attendance', [AttendanceController::class, 'saveClassDay']);
        Route::post('classes/{class}/parent-accounts', [ParentAccountController::class, 'createForClass']);

        Route::get('reports/{report}', [ReportController::class, 'show']);
        Route::patch('reports/{report}', [ReportController::class, 'update']);
        Route::post('reports/{report}/submit', [ReportController::class, 'submit']);
        Route::post('reports/{report}/approve', [ReportController::class, 'approve']);
        Route::post('reports/{report}/publish', [ReportController::class, 'publish']);
        Route::post('reports/{report}/return', [ReportController::class, 'returnToDraft']);
        Route::post('reports/{report}/acknowledge', [ReportController::class, 'acknowledge']);

        Route::get('absence-notices', [AbsenceNoticeController::class, 'index']);
        Route::post('absence-notices', [AbsenceNoticeController::class, 'store']);
        Route::post('absence-notices/{notice}/review', [AbsenceNoticeController::class, 'review']);

        Route::get('announcements', [AnnouncementController::class, 'index']);
        Route::post('announcements', [AnnouncementController::class, 'store']);
        Route::patch('announcements/{announcement}', [AnnouncementController::class, 'update']);

        Route::get('interventions', [InterventionController::class, 'index']);
        Route::post('interventions', [InterventionController::class, 'store']);
        Route::post('interventions/{intervention}/resolve', [InterventionController::class, 'resolve']);

        Route::post('guardians/{guardian}/reset-password', [ParentAccountController::class, 'reset']);
        Route::get('analytics/grades', [AnalyticsController::class, 'grades']);

        Route::prefix('admin')->group(function () {
            Route::put('settings/school', [SettingsController::class, 'updateSchool']);
            Route::put('settings/coex', [SettingsController::class, 'updateCoex']);
            Route::get('users', [UserController::class, 'index']);
            Route::post('users', [UserController::class, 'store']);
            Route::patch('users/{user}', [UserController::class, 'update']);
            Route::post('users/{user}/reset-password', [UserController::class, 'resetPassword']);
            Route::patch('assessments/{assessment}', [AssessmentController::class, 'update']);
            Route::get('audit-logs', [AuditLogController::class, 'index']);
            Route::get('imports', [ImportController::class, 'index']);
            Route::post('imports/students', [ImportController::class, 'students']);
        });
    });
});
