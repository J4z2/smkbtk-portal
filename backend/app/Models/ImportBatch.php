<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['type', 'file_name', 'uploaded_by', 'rows_total', 'rows_imported', 'rows_skipped', 'errors', 'status'])]
class ImportBatch extends Model
{
    protected function casts(): array
    {
        return ['errors' => 'array'];
    }
}
