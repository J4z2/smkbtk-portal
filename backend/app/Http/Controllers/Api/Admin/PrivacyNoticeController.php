<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\PrivacyNotice;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * The super admin reviews the latest privacy notice and publishes it.
 * Once published, parents must accept it before seeing any data.
 */
class PrivacyNoticeController extends Controller
{
    public function latest(Request $request): JsonResponse
    {
        abort_unless($request->user()->isAdmin(), 403);

        return response()->json(PrivacyNotice::latest('id')->firstOrFail());
    }

    public function publish(Request $request): JsonResponse
    {
        abort_unless($request->user()->role->value === 'super_admin', 403);
        $notice = PrivacyNotice::latest('id')->firstOrFail();
        abort_if($notice->published_at !== null, 422, 'Notis ini telah diterbitkan.');
        $notice->update(['published_at' => now()]);
        AuditLog::record('privacy_notice.published', $notice);

        return response()->json($notice);
    }
}
