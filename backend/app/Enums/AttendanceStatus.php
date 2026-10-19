<?php

namespace App\Enums;

enum AttendanceStatus: string
{
    case Present = 'P';
    case Absent = 'A';
    case Late = 'L';
    case Sick = 'MC';
    case OfficialDuty = 'U';

    public function label(): string
    {
        return match ($this) {
            self::Present => 'Hadir',
            self::Absent => 'Tidak hadir',
            self::Late => 'Lewat',
            self::Sick => 'Cuti sakit',
            self::OfficialDuty => 'Urusan rasmi',
        };
    }

    /**
     * Matches the prototype: present and late count as attended.
     */
    public function countsAsPresent(): bool
    {
        return $this === self::Present || $this === self::Late;
    }
}
