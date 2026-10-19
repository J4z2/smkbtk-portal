<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AnnouncementController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json(Announcement::visibleTo($request->user())->limit(100)->get());
    }

    public function store(Request $request): JsonResponse
    {
        abort_unless($request->user()->isAdmin(), 403);
        $announcement = Announcement::create($this->validated($request) + ['created_by' => $request->user()->id]);
        AuditLog::record('announcement.created', $announcement);

        return response()->json($announcement, 201);
    }

    public function update(Request $request, Announcement $announcement): JsonResponse
    {
        abort_unless($request->user()->isAdmin(), 403);
        $announcement->update($this->validated($request));
        AuditLog::record('announcement.updated', $announcement);

        return response()->json($announcement);
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request): array
    {
        return $request->validate([
            'title_ms' => ['required', 'string', 'max:200'],
            'title_en' => ['nullable', 'string', 'max:200'],
            'body_ms' => ['required', 'string', 'max:5000'],
            'body_en' => ['nullable', 'string', 'max:5000'],
            'category' => ['required', 'string', 'max:40'],
            'audience' => ['required', Rule::in(['all', 'form', 'class'])],
            'audience_value' => ['nullable', 'required_unless:audience,all', 'string', 'max:32'],
            'published_at' => ['nullable', 'date'],
        ]);
    }
}
