<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\CoexRule;
use App\Models\Setting;
use App\Services\Coex;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

/**
 * School details and COEx rules. Super admin only.
 */
class SettingsController extends Controller
{
    private const SCHOOL_KEYS = ['name', 'address', 'phone', 'email', 'office_hours'];

    public function updateSchool(Request $request): JsonResponse
    {
        $this->superAdmin($request);
        $data = $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'address' => ['nullable', 'string', 'max:500'],
            'phone' => ['nullable', 'string', 'max:40'],
            'email' => ['nullable', 'email', 'max:190'],
            'office_hours' => ['nullable', 'string', 'max:150'],
        ]);
        foreach (self::SCHOOL_KEYS as $key) {
            Setting::put("school.{$key}", $data[$key] ?? '');
        }
        AuditLog::record('settings.school_updated', null, null, $data);

        return response()->json($data);
    }

    /**
     * Replace all 11 rules and the LMS / credit / Purple thresholds at once.
     */
    public function updateCoex(Request $request, Coex $coex): JsonResponse
    {
        $this->superAdmin($request);
        $data = $request->validate([
            'lms_pass_mark' => ['required', 'integer', 'between:0,100'],
            'credit_gear' => ['required', 'integer', 'between:1,11'],
            'purple_gear' => ['required', 'integer', 'between:1,11'],
            'rules' => ['required', 'array', 'size:11'],
            'rules.*.gear' => ['required', 'integer', 'between:1,11'],
            'rules.*.min_mark' => ['required', 'integer', 'between:0,100'],
            'rules.*.max_mark' => ['required', 'integer', 'between:0,100'],
            'rules.*.grade' => ['required', 'string', 'max:4'],
            'rules.*.zone' => ['required', 'string', 'max:60'],
            'rules.*.level' => ['required', 'string', 'max:60'],
            'rules.*.action_ms' => ['required', 'string', 'max:1000'],
            'rules.*.action_en' => ['nullable', 'string', 'max:1000'],
            'rules.*.color' => ['required', 'regex:/^#[0-9a-fA-F]{6}$/'],
        ]);
        try {
            Coex::validateRules($data['rules']);
        } catch (InvalidArgumentException $e) {
            abort(422, $e->getMessage());
        }
        $old = CoexRule::orderBy('gear')->get()->toArray();
        DB::transaction(function () use ($data) {
            foreach ($data['rules'] as $rule) {
                CoexRule::updateOrCreate(['gear' => $rule['gear']], $rule);
            }
            foreach (['lms_pass_mark', 'credit_gear', 'purple_gear'] as $key) {
                Setting::put("coex.{$key}", $data[$key]);
            }
        });
        $coex->forget();
        AuditLog::record('settings.coex_updated', null, ['rules' => $old], $data);

        return response()->json(['ok' => true]);
    }

    private function superAdmin(Request $request): void
    {
        abort_unless($request->user()->role->value === 'super_admin', 403);
    }
}
