<?php

namespace App\Enums;

enum StudentStatus: string
{
    case Active = 'active';
    case TransferredOut = 'transferred_out';
    case Graduated = 'graduated';
    case Archived = 'archived';
}
