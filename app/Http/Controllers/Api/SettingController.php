<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

final class SettingController extends Controller
{
    public function index(): JsonResponse
    {
        $settings = Setting::where('deleted', false)
            ->orderBy('key')
            ->get();

        return response()->json($settings);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'key' => 'required|string|max:255|unique:settings,key',
            'value' => 'required|string',
            'description' => 'nullable|string',
            'description_en' => 'nullable|string'
        ]);

        try {
            DB::beginTransaction();

            $setting = Setting::create([
                'key' => $validated['key'],
                'value' => $validated['value'],
                'description' => $validated['description'],
                'description_en' => $validated['description_en'],
                'deleted' => false
            ]);

            DB::commit();

            return response()->json($setting, 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show(Setting $setting): JsonResponse
    {
        return response()->json($setting);
    }

    public function update(Request $request, Setting $setting): JsonResponse
    {
        $validated = $request->validate([
            'value' => 'required|string',
            'description' => 'nullable|string',
            'description_en' => 'nullable|string'
        ]);

        try {
            DB::beginTransaction();

            $setting->update([
                'value' => $validated['value'],
                'description' => $validated['description'],
                'description_en' => $validated['description_en']
            ]);

            DB::commit();

            return response()->json($setting);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy(Setting $setting): JsonResponse
    {
        try {
            $setting->update(['deleted' => true]);
            return response()->json(['message' => 'Setting deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function getByKey(string $key): JsonResponse
    {
        $setting = Setting::where('key', $key)
            ->where('deleted', false)
            ->first();

        if (!$setting) {
            return response()->json(['error' => 'Setting not found'], 404);
        }

        return response()->json($setting);
    }
} 