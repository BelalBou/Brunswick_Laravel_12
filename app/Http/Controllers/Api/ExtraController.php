<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Extra;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

final class ExtraController extends Controller
{
    public function index(): JsonResponse
    {
        $extras = Extra::where('deleted', false)
            ->orderBy('title')
            ->get();

        return response()->json($extras);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'title_en' => 'required|string|max:255',
            'description' => 'nullable|string',
            'description_en' => 'nullable|string',
            'pricing' => 'required|numeric',
            'supplierId' => 'required|integer|exists:suppliers,id'
        ]);

        try {
            DB::beginTransaction();

            $extra = Extra::create([
                'title' => $validated['title'],
                'title_en' => $validated['title_en'],
                'description' => $validated['description'],
                'description_en' => $validated['description_en'],
                'pricing' => $validated['pricing'],
                'supplier_id' => $validated['supplierId'],
                'deleted' => false
            ]);

            DB::commit();

            return response()->json($extra, 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show(Extra $extra): JsonResponse
    {
        return response()->json($extra);
    }

    public function update(Request $request, Extra $extra): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'title_en' => 'required|string|max:255',
            'description' => 'nullable|string',
            'description_en' => 'nullable|string',
            'pricing' => 'required|numeric',
            'supplierId' => 'required|integer|exists:suppliers,id'
        ]);

        try {
            DB::beginTransaction();

            $extra->update([
                'title' => $validated['title'],
                'title_en' => $validated['title_en'],
                'description' => $validated['description'],
                'description_en' => $validated['description_en'],
                'pricing' => $validated['pricing'],
                'supplier_id' => $validated['supplierId']
            ]);

            DB::commit();

            return response()->json($extra);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy(Extra $extra): JsonResponse
    {
        try {
            $extra->update(['deleted' => true]);
            return response()->json(['message' => 'Extra deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function listBySupplier(int $supplierId): JsonResponse
    {
        $extras = Extra::where('supplier_id', $supplierId)
            ->where('deleted', false)
            ->orderBy('title')
            ->get();

        return response()->json($extras);
    }
} 