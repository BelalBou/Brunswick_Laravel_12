<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Dictionnary;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

final class DictionaryController extends Controller
{
    public function index(): JsonResponse
    {
        $dictionaries = Dictionnary::where('deleted', false)
            ->orderBy('tag')
            ->get();

        return response()->json($dictionaries);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'tag' => 'required|string|max:255|unique:dictionnaries,tag',
            'translation_fr' => 'required|string',
            'translation_en' => 'required|string'
        ]);

        try {
            DB::beginTransaction();

            $dictionary = Dictionnary::create([
                'tag' => $validated['tag'],
                'translation_fr' => $validated['translation_fr'],
                'translation_en' => $validated['translation_en'],
                'deleted' => false
            ]);

            DB::commit();

            return response()->json($dictionary, 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show(Dictionnary $dictionary): JsonResponse
    {
        return response()->json($dictionary);
    }

    public function update(Request $request, Dictionnary $dictionary): JsonResponse
    {
        $validated = $request->validate([
            'translation_fr' => 'required|string',
            'translation_en' => 'required|string'
        ]);

        try {
            DB::beginTransaction();

            $dictionary->update([
                'translation_fr' => $validated['translation_fr'],
                'translation_en' => $validated['translation_en']
            ]);

            DB::commit();

            return response()->json($dictionary);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy(Dictionnary $dictionary): JsonResponse
    {
        try {
            $dictionary->update(['deleted' => true]);
            return response()->json(['message' => 'Dictionary entry deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function getByKey(string $key): JsonResponse
    {
        $dictionary = Dictionnary::where('tag', $key)
            ->where('deleted', false)
            ->first();

        if (!$dictionary) {
            return response()->json(['error' => 'Dictionary entry not found'], 404);
        }

        return response()->json($dictionary);
    }

    public function getByLanguage(string $language): JsonResponse
    {
        $dictionaries = Dictionnary::where('deleted', false)
            ->select('tag', $language === 'en' ? 'translation_en as value' : 'translation_fr as value')
            ->orderBy('tag')
            ->get();

        return response()->json($dictionaries);
    }
} 