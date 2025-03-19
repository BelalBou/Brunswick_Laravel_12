<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Allergy;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

final class AllergyController extends Controller
{
    public function index(): JsonResponse
    {
        $allergies = Allergy::where('deleted', false)
            ->orderBy('title')
            ->get();

        return response()->json($allergies);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'title_en' => 'required|string|max:255',
            'description' => 'nullable|string',
            'description_en' => 'nullable|string'
        ]);

        try {
            DB::beginTransaction();

            $allergy = Allergy::create([
                'title' => $validated['title'],
                'title_en' => $validated['title_en'],
                'description' => $validated['description'],
                'description_en' => $validated['description_en'],
                'deleted' => false
            ]);

            DB::commit();

            return response()->json($allergy, 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show(Allergy $allergy): JsonResponse
    {
        return response()->json($allergy);
    }

    public function update(Request $request, Allergy $allergy): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'title_en' => 'required|string|max:255',
            'description' => 'nullable|string',
            'description_en' => 'nullable|string'
        ]);

        try {
            DB::beginTransaction();

            $allergy->update([
                'title' => $validated['title'],
                'title_en' => $validated['title_en'],
                'description' => $validated['description'],
                'description_en' => $validated['description_en']
            ]);

            DB::commit();

            return response()->json($allergy);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy(Allergy $allergy): JsonResponse
    {
        try {
            $allergy->update(['deleted' => true]);
            return response()->json(['message' => 'Allergy deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
} 