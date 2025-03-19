<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Dictionary;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

final class DictionaryController extends Controller
{
    public function index(): JsonResponse
    {
        $dictionaries = Dictionary::where('deleted', false)
            ->orderBy('key')
            ->get();

        return response()->json($dictionaries);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'key' => 'required|string|max:255|unique:dictionaries,key',
            'value' => 'required|string',
            'value_en' => 'required|string'
        ]);

        try {
            DB::beginTransaction();

            $dictionary = Dictionary::create([
                'key' => $validated['key'],
                'value' => $validated['value'],
                'value_en' => $validated['value_en'],
                'deleted' => false
            ]);

            DB::commit();

            return response()->json($dictionary, 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show(Dictionary $dictionary): JsonResponse
    {
        return response()->json($dictionary);
    }

    public function update(Request $request, Dictionary $dictionary): JsonResponse
    {
        $validated = $request->validate([
            'value' => 'required|string',
            'value_en' => 'required|string'
        ]);

        try {
            DB::beginTransaction();

            $dictionary->update([
                'value' => $validated['value'],
                'value_en' => $validated['value_en']
            ]);

            DB::commit();

            return response()->json($dictionary);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy(Dictionary $dictionary): JsonResponse
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
        $dictionary = Dictionary::where('key', $key)
            ->where('deleted', false)
            ->first();

        if (!$dictionary) {
            return response()->json(['error' => 'Dictionary entry not found'], 404);
        }

        return response()->json($dictionary);
    }

    public function getByLanguage(string $language): JsonResponse
    {
        $dictionaries = Dictionary::where('deleted', false)
            ->select('key', $language === 'en' ? 'value_en as value' : 'value')
            ->orderBy('key')
            ->get();

        return response()->json($dictionaries);
    }
} 