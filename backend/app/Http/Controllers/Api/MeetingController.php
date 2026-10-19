<?php

namespace App\Http\Controllers\Api;

use App\Enums\Role;
use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\MeetingBooking;
use App\Models\MeetingSlot;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Support\Access;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

/**
 * Parent–teacher meetings: the class teacher (or an admin) opens slots
 * for a class; parents of that class book them for one child.
 */
class MeetingController extends Controller
{
    public function storeSlot(Request $request, SchoolClass $class): JsonResponse
    {
        abort_unless(Access::canManageClass($request->user(), $class), 403);
        $data = $request->validate([
            'date' => ['required', 'date_format:Y-m-d', 'after_or_equal:today'],
            'starts_at' => ['required', 'date_format:H:i'],
            'ends_at' => ['required', 'date_format:H:i', 'after:starts_at'],
            'capacity' => ['sometimes', 'integer', 'between:1,20'],
        ]);
        $slot = MeetingSlot::create($data + ['class_id' => $class->id, 'teacher_id' => $class->class_teacher_id]);
        AuditLog::record('meeting.slot_created', $slot, null, $data);

        return response()->json($slot, 201);
    }

    public function destroySlot(Request $request, MeetingSlot $slot): JsonResponse
    {
        abort_unless(Access::canManageClass($request->user(), $slot->schoolClass), 403);
        abort_if($slot->bookings()->where('status', 'booked')->exists(), 422, 'Slot ini telah ditempah. Batalkan tempahan dahulu.');
        AuditLog::record('meeting.slot_deleted', $slot, $slot->toArray());
        $slot->delete();

        return response()->json(['ok' => true]);
    }

    /**
     * A parent books a slot for one of their children in that class.
     */
    public function book(Request $request, MeetingSlot $slot): JsonResponse
    {
        abort_unless($request->user()->role === Role::Parent, 403);
        $data = $request->validate([
            'student_id' => ['required', 'integer'],
            'topic' => ['required', 'string', 'max:100'],
        ]);
        $student = Student::findOrFail($data['student_id']);
        Gate::authorize('view', $student);
        abort_unless($student->currentEnrolment?->class_id === $slot->class_id, 422, 'Slot ini bukan untuk kelas anak anda.');
        abort_if($slot->date->isPast() && ! $slot->date->isToday(), 422, 'Slot ini telah berlalu.');

        $booking = DB::transaction(function () use ($slot, $student, $data, $request) {
            // Lock the slot so two parents cannot take the last place together.
            $locked = MeetingSlot::whereKey($slot->id)->lockForUpdate()->first();
            $taken = $locked->bookings()->where('status', 'booked')->count();
            abort_if($taken >= $locked->capacity, 422, 'Slot ini sudah penuh.');
            abort_if($locked->bookings()->where('status', 'booked')->where('student_id', $student->id)->exists(), 422, 'Anak ini sudah menempah slot ini.');

            return MeetingBooking::create([
                'meeting_slot_id' => $locked->id,
                'student_id' => $student->id,
                'booked_by' => $request->user()->id,
                'topic' => $data['topic'],
            ]);
        });
        AuditLog::record('meeting.booked', $booking);

        return response()->json($booking, 201);
    }

    /**
     * The parent who booked, or the class's teacher/admin, may cancel;
     * staff may also mark a meeting as done.
     */
    public function updateBooking(Request $request, MeetingBooking $booking): JsonResponse
    {
        $user = $request->user();
        $data = $request->validate(['status' => ['required', Rule::in(['cancelled', 'done'])]]);
        $isStaff = Access::canManageClass($user, $booking->slot->schoolClass);
        $isOwner = $user->role === Role::Parent && $booking->booked_by === $user->id;
        abort_unless($isStaff || ($isOwner && $data['status'] === 'cancelled'), 403);
        abort_unless($booking->status === 'booked', 422, 'Tempahan ini telah ditutup.');
        $booking->update($data);
        AuditLog::record('meeting.'.$data['status'], $booking);

        return response()->json($booking);
    }
}
