<?php

namespace App\Enums;

enum Role: string
{
    case Parent = 'parent';
    case ClassTeacher = 'class_teacher';
    case Admin = 'admin';
    case SuperAdmin = 'super_admin';

    /**
     * Admin and super admin can see and manage every class.
     */
    public function isAdmin(): bool
    {
        return $this === self::Admin || $this === self::SuperAdmin;
    }

    public function isStaff(): bool
    {
        return $this !== self::Parent;
    }
}
