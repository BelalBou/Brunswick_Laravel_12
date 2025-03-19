<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

final class SupplierController extends Controller
{
    public function index(): JsonResponse
    {
        $suppliers = Supplier::where('deleted', false)
            ->orderBy('name')
            ->get();

        return response()->json($suppliers);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'name_en' => 'required|string|max:255',
            'description' => 'nullable|string',
            'description_en' => 'nullable|string',
            'address' => 'nullable|string',
            'phone' => 'nullable|string',
            'email' => 'nullable|email'
        ]);

        try {
            DB::beginTransaction();

            $supplier = Supplier::create([
                'name' => $validated['name'],
                'name_en' => $validated['name_en'],
                'description' => $validated['description'],
                'description_en' => $validated['description_en'],
                'address' => $validated['address'],
                'phone' => $validated['phone'],
                'email' => $validated['email'],
                'deleted' => false
            ]);

            DB::commit();

            return response()->json($supplier, 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show(Supplier $supplier): JsonResponse
    {
        return response()->json($supplier);
    }

    public function update(Request $request, Supplier $supplier): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'name_en' => 'required|string|max:255',
            'description' => 'nullable|string',
            'description_en' => 'nullable|string',
            'address' => 'nullable|string',
            'phone' => 'nullable|string',
            'email' => 'nullable|email'
        ]);

        try {
            DB::beginTransaction();

            $supplier->update([
                'name' => $validated['name'],
                'name_en' => $validated['name_en'],
                'description' => $validated['description'],
                'description_en' => $validated['description_en'],
                'address' => $validated['address'],
                'phone' => $validated['phone'],
                'email' => $validated['email']
            ]);

            DB::commit();

            return response()->json($supplier);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy(Supplier $supplier): JsonResponse
    {
        try {
            $supplier->update(['deleted' => true]);
            return response()->json(['message' => 'Supplier deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
} 