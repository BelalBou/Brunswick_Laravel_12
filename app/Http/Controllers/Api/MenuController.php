<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use App\Models\Allergy;
use App\Models\Extra;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

final class MenuController extends Controller
{
    public function index(): JsonResponse
    {
        $menus = Menu::with(['supplier', 'category', 'menuSize', 'extras', 'allergies'])
            ->where('deleted', false)
            ->get();

        return response()->json($menus);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'title_en' => 'required|string|max:255',
            'description' => 'nullable|string',
            'description_en' => 'nullable|string',
            'sizeId' => 'nullable|integer',
            'pricing' => 'required|numeric',
            'supplierId' => 'required|integer',
            'categoryId' => 'required|integer',
            'allergyIds' => 'nullable|array',
            'allergyIds.*' => 'integer',
            'extraIds' => 'nullable|array',
            'extraIds.*' => 'integer',
            'picture' => 'nullable|string'
        ]);

        try {
            DB::beginTransaction();

            $menu = Menu::create([
                'title' => $validated['title'],
                'title_en' => $validated['title_en'],
                'description' => $validated['description'],
                'description_en' => $validated['description_en'],
                'menu_size_id' => $validated['sizeId'] > 0 ? $validated['sizeId'] : null,
                'pricing' => $validated['pricing'],
                'supplier_id' => $validated['supplierId'],
                'category_id' => $validated['categoryId'],
                'picture' => $validated['picture'] ?? null,
                'deleted' => false
            ]);

            if (!empty($validated['allergyIds'])) {
                $menu->allergies()->attach($validated['allergyIds']);
            }

            if (!empty($validated['extraIds'])) {
                $menu->extras()->attach($validated['extraIds']);
            }

            DB::commit();

            return response()->json($menu->load(['supplier', 'category', 'menuSize', 'extras', 'allergies']), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show(Menu $menu): JsonResponse
    {
        return response()->json($menu->load(['supplier', 'category', 'menuSize', 'extras', 'allergies']));
    }

    public function update(Request $request, Menu $menu): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'title_en' => 'required|string|max:255',
            'description' => 'nullable|string',
            'description_en' => 'nullable|string',
            'sizeId' => 'nullable|integer',
            'pricing' => 'required|numeric',
            'supplierId' => 'required|integer',
            'categoryId' => 'required|integer',
            'allergyIds' => 'nullable|array',
            'allergyIds.*' => 'integer',
            'extraIds' => 'nullable|array',
            'extraIds.*' => 'integer',
            'picture' => 'nullable|string'
        ]);

        try {
            DB::beginTransaction();

            $menu->update([
                'title' => $validated['title'],
                'title_en' => $validated['title_en'],
                'description' => $validated['description'],
                'description_en' => $validated['description_en'],
                'menu_size_id' => $validated['sizeId'] > 0 ? $validated['sizeId'] : null,
                'pricing' => $validated['pricing'],
                'supplier_id' => $validated['supplierId'],
                'category_id' => $validated['categoryId'],
                'picture' => $validated['picture'] ?? $menu->picture
            ]);

            $menu->allergies()->sync($validated['allergyIds'] ?? []);
            $menu->extras()->sync($validated['extraIds'] ?? []);

            DB::commit();

            return response()->json($menu->load(['supplier', 'category', 'menuSize', 'extras', 'allergies']));
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy(Menu $menu): JsonResponse
    {
        try {
            $menu->update(['deleted' => true]);
            return response()->json(['message' => 'Menu deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function uploadPicture(Request $request): JsonResponse
    {
        $request->validate([
            'picture' => 'required|image|max:2048'
        ]);

        try {
            $path = $request->file('picture')->store('menus', 'public');
            return response()->json(['path' => $path]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function listBySupplier(int $supplierId): JsonResponse
    {
        $menus = Menu::with(['supplier', 'category', 'menuSize', 'extras', 'allergies'])
            ->where('supplier_id', $supplierId)
            ->where('deleted', false)
            ->get();

        return response()->json($menus);
    }
} 