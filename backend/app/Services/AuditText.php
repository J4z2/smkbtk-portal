<?php

namespace App\Services;

use App\Models\AuditLog;

/**
 * Turns audit action codes into the Malay sentences the portal shows.
 */
class AuditText
{
    private const TEXT = [
        'auth.login' => 'Log masuk ke portal.',
        'auth.logout' => 'Log keluar daripada portal.',
        'auth.password_changed' => 'Menukar kata laluan.',
        'consent.accepted' => 'Menerima notis privasi.',
        'report.updated' => 'Mengemas kini markah atau ulasan laporan.',
        'report.submitted' => 'Menghantar laporan untuk semakan.',
        'report.approved' => 'Meluluskan laporan.',
        'report.published' => 'Menerbitkan laporan kepada ibu bapa.',
        'report.returned' => 'Mengembalikan laporan kepada guru.',
        'report.acknowledged' => 'Penjaga mengesahkan laporan telah dibaca.',
        'attendance.saved' => 'Menyimpan rekod kehadiran.',
        'student.created' => 'Mendaftarkan pelajar baharu.',
        'student.updated' => 'Mengemas kini profil pelajar.',
        'student.moved' => 'Memindahkan pelajar ke kelas lain.',
        'student.status_changed' => 'Menukar status pelajar.',
        'student.photo_updated' => 'Mengemas kini foto pelajar.',
        'absence_notice.created' => 'Menghantar makluman ketidakhadiran.',
        'absence_notice.reviewed' => 'Menyemak makluman ketidakhadiran.',
        'intervention.created' => 'Merekod intervensi murid.',
        'intervention.resolved' => 'Menandakan intervensi selesai.',
        'settings.school_updated' => 'Mengemas kini maklumat sekolah.',
        'settings.coex_updated' => 'Mengemas kini tetapan COEx.',
        'assessment.updated' => 'Mengemas kini checkpoint peperiksaan.',
        'user.created' => 'Menambah akaun kakitangan.',
        'user.updated' => 'Mengemas kini akaun kakitangan.',
        'user.password_reset' => 'Menetapkan semula kata laluan kakitangan.',
        'parent.account_created' => 'Mencipta akaun ibu bapa.',
        'parent.password_reset' => 'Menetapkan semula kata laluan ibu bapa.',
        'class.created' => 'Menambah kelas.',
        'class.updated' => 'Mengemas kini kelas.',
        'class.deleted' => 'Memadam kelas.',
        'subject.created' => 'Menambah subjek.',
        'subject.removed' => 'Membuang subjek daripada tingkatan.',
        'import.students' => 'Mengimport data pelajar.',
        'targets.updated' => 'Mengemas kini sasaran subjek.',
        'privacy_notice.published' => 'Menerbitkan notis privasi.',
    ];

    public static function describe(AuditLog $log): string
    {
        $text = self::TEXT[$log->action] ?? $log->action;
        $name = $log->auditable?->name ?? $log->auditable?->student?->name ?? null;

        return $name ? rtrim($text, '.').': '.$name.'.' : $text;
    }

    public static function tone(string $action): string
    {
        return match (true) {
            str_ends_with($action, 'published'), str_ends_with($action, 'reset') => 'gold',
            str_ends_with($action, 'deleted'), str_ends_with($action, 'removed'), str_ends_with($action, 'returned') => 'red',
            str_ends_with($action, 'approved'), str_ends_with($action, 'submitted'), str_ends_with($action, 'created'), str_ends_with($action, 'saved') => 'green',
            default => 'info',
        };
    }
}
