<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

final class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = Category::where('deleted', false)
            ->orderBy('title')
            ->get();

        return response()->json($categories);
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

            $category = Category::create([
                'title' => $validated['title'],
                'title_en' => $validated['title_en'],
                'description' => $validated['description'],
                'description_en' => $validated['description_en'],
                'deleted' => false
            ]);

            DB::commit();

            return response()->json($category, 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show(Category $category): JsonResponse
    {
        return response()->json($category);
    }

    public function update(Request $request, Category $category): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'title_en' => 'required|string|max:255',
            'description' => 'nullable|string',
            'description_en' => 'nullable|string'
        ]);

        try {
            DB::beginTransaction();

            $category->update([
                'title' => $validated['title'],
                'title_en' => $validated['title_en'],
                'description' => $validated['description'],
                'description_en' => $validated['description_en']
            ]);

            DB::commit();

            return response()->json($category);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy(Category $category): JsonResponse
    {
        try {
            $category->update(['deleted' => true]);
            return response()->json(['message' => 'Category deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
} 