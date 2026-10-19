<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ImportBatch;
use App\Services\Import\StudentImporter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ImportController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        abort_unless($request->user()->isAdmin(), 403);

        return response()->json(ImportBatch::latest()->limit(50)->get());
    }

    /**
     * Upload a students CSV. Rows with problems are skipped and listed.
     */
    public function students(Request $request, StudentImporter $importer): JsonResponse
    {
        abort_unless($request->user()->isAdmin(), 403);
        $request->validate(['file' => ['required', 'file', 'mimes:csv,txt', 'max:10240']]);
        $file = $request->file('file');
        $batch = $importer->import($file->getRealPath(), $file->getClientOriginalName(), $request->user()->id);

        return response()->json($batch, $batch->status === 'failed' ? 422 : 200);
    }
}
