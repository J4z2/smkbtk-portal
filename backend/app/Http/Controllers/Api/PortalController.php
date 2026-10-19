<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Services\PortalSnapshot;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PortalController extends Controller
{
    /**
     * Everything the portal page shows, for the signed-in user.
     */
    public function snapshot(Request $request, PortalSnapshot $snapshot): JsonResponse
    {
        return response()->json($snapshot->for($request->user()));
    }

    /**
     * Public school details for the landing page (no login needed).
     */
    public function school(): JsonResponse
    {
        return response()->json([
            'name' => Setting::get('school.name', 'SMK Bandar Tasik Kesuma'),
            'address' => Setting::get('school.address', ''),
            'phone' => Setting::get('school.phone', ''),
        ]);
    }
}
