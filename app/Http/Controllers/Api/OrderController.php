<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Menu;
use App\Models\User;
use App\Models\Extra;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

final class OrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Order::with([
            'user' => function ($query) {
                $query->select('id', 'name', 'email', 'phone')
                    ->where('deleted', false);
            },
            'menus' => function ($query) {
                $query->select('menus.id', 'title', 'title_en', 'pricing', 'picture')
                    ->where('menus.deleted', false)
                    ->with([
                        'menuSize' => function ($query) {
                            $query->select('id', 'title', 'title_en');
                        },
                        'supplier' => function ($query) {
                            $query->select('id', 'name', 'name_en');
                        }
                    ])
                    ->orderBy('title')
                    ->orderBy('menu_size_id');
            }
        ])
        ->where('deleted', false)
        ->orderBy('date', 'desc')
        ->orderBy('id', 'desc');

        if ($request->has('limit')) {
            $query->limit($request->input('limit'));
        }

        if ($request->has('offset')) {
            $query->offset($request->input('offset'));
        }

        return response()->json($query->get());
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|integer',
            'date' => 'required|date',
            'menus' => 'required|array',
            'menus.*.id' => 'required|integer',
            'menus.*.quantity' => 'required|integer',
            'menus.*.pricing' => 'required|numeric',
            'menus.*.remark' => 'nullable|string',
            'menus.*.extras' => 'nullable|array',
            'menus.*.extras.*.id' => 'required|integer',
            'menus.*.extras.*.quantity' => 'required|integer',
            'menus.*.extras.*.pricing' => 'required|numeric'
        ]);

        try {
            DB::beginTransaction();

            $order = Order::create([
                'user_id' => $validated['user_id'],
                'date' => $validated['date'],
                'deleted' => false
            ]);

            foreach ($validated['menus'] as $menuData) {
                $orderMenu = $order->menus()->attach($menuData['id'], [
                    'quantity' => $menuData['quantity'],
                    'pricing' => $menuData['pricing'],
                    'remark' => $menuData['remark'] ?? null,
                    'date' => $validated['date']
                ]);

                if (!empty($menuData['extras'])) {
                    foreach ($menuData['extras'] as $extraData) {
                        $order->extras()->attach($extraData['id'], [
                            'order_menu_id' => $orderMenu->id,
                            'quantity' => $extraData['quantity'],
                            'pricing' => $extraData['pricing']
                        ]);
                    }
                }
            }

            DB::commit();

            return response()->json($order->load(['user', 'menus', 'extras']), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show(Order $order): JsonResponse
    {
        return response()->json($order->load([
            'user',
            'menus' => function ($query) {
                $query->with(['menuSize', 'supplier'])
                    ->orderBy('title')
                    ->orderBy('menu_size_id');
            },
            'extras'
        ]));
    }

    public function update(Request $request, Order $order): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|integer',
            'date' => 'required|date',
            'menus' => 'required|array',
            'menus.*.id' => 'required|integer',
            'menus.*.quantity' => 'required|integer',
            'menus.*.pricing' => 'required|numeric',
            'menus.*.remark' => 'nullable|string',
            'menus.*.extras' => 'nullable|array',
            'menus.*.extras.*.id' => 'required|integer',
            'menus.*.extras.*.quantity' => 'required|integer',
            'menus.*.extras.*.pricing' => 'required|numeric'
        ]);

        try {
            DB::beginTransaction();

            $order->update([
                'user_id' => $validated['user_id'],
                'date' => $validated['date']
            ]);

            // Supprimer les anciennes relations
            $order->menus()->detach();
            $order->extras()->detach();

            // Ajouter les nouvelles relations
            foreach ($validated['menus'] as $menuData) {
                $orderMenu = $order->menus()->attach($menuData['id'], [
                    'quantity' => $menuData['quantity'],
                    'pricing' => $menuData['pricing'],
                    'remark' => $menuData['remark'] ?? null,
                    'date' => $validated['date']
                ]);

                if (!empty($menuData['extras'])) {
                    foreach ($menuData['extras'] as $extraData) {
                        $order->extras()->attach($extraData['id'], [
                            'order_menu_id' => $orderMenu->id,
                            'quantity' => $extraData['quantity'],
                            'pricing' => $extraData['pricing']
                        ]);
                    }
                }
            }

            DB::commit();

            return response()->json($order->load(['user', 'menus', 'extras']));
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy(Order $order): JsonResponse
    {
        try {
            $order->update(['deleted' => true]);
            return response()->json(['message' => 'Order deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function listByDate(string $date): JsonResponse
    {
        $orders = Order::with([
            'user' => function ($query) {
                $query->select('id', 'name', 'email', 'phone')
                    ->where('deleted', false);
            },
            'menus' => function ($query) {
                $query->select('menus.id', 'title', 'title_en', 'pricing', 'picture')
                    ->where('menus.deleted', false)
                    ->with([
                        'menuSize' => function ($query) {
                            $query->select('id', 'title', 'title_en');
                        },
                        'supplier' => function ($query) {
                            $query->select('id', 'name', 'name_en');
                        }
                    ])
                    ->orderBy('title');
            }
        ])
        ->whereDate('date', Carbon::parse($date))
        ->where('deleted', false)
        ->orderBy('date', 'desc')
        ->orderBy('id', 'desc')
        ->get();

        return response()->json($orders);
    }

    public function listByCustomer(int $userId): JsonResponse
    {
        $orders = Order::with([
            'user' => function ($query) {
                $query->select('id', 'name', 'email', 'phone');
            },
            'menus' => function ($query) {
                $query->select('menus.id', 'title', 'title_en', 'pricing', 'picture')
                    ->where('menus.deleted', false)
                    ->with([
                        'menuSize' => function ($query) {
                            $query->select('id', 'title', 'title_en');
                        }
                    ])
                    ->orderBy('title')
                    ->orderBy('menu_size_id');
            }
        ])
        ->where('user_id', $userId)
        ->where('deleted', false)
        ->orderBy('date', 'desc')
        ->orderBy('id', 'desc')
        ->get();

        return response()->json($orders);
    }

    public function listBySupplier(int $supplierId): JsonResponse
    {
        $orders = Order::with([
            'user' => function ($query) {
                $query->select('id', 'name', 'email', 'phone')
                    ->where('deleted', false);
            },
            'menus' => function ($query) use ($supplierId) {
                $query->select('menus.id', 'title', 'title_en', 'pricing', 'picture')
                    ->where('menus.deleted', false)
                    ->whereHas('supplier', function ($query) use ($supplierId) {
                        $query->where('id', $supplierId);
                    })
                    ->with([
                        'menuSize' => function ($query) {
                            $query->select('id', 'title', 'title_en');
                        },
                        'supplier' => function ($query) {
                            $query->select('id', 'name', 'name_en');
                        }
                    ])
                    ->orderBy('title')
                    ->orderBy('menu_size_id');
            }
        ])
        ->where('deleted', false)
        ->orderBy('date', 'desc')
        ->orderBy('id', 'desc')
        ->get();

        return response()->json($orders);
    }
} 