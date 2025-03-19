<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DailyEmail;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

final class DailyEmailController extends Controller
{
    public function index(): JsonResponse
    {
        $dailyEmails = DailyEmail::where('deleted', false)
            ->orderBy('date', 'desc')
            ->get();

        return response()->json($dailyEmails);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'subject' => 'required|string|max:255',
            'subject_en' => 'required|string|max:255',
            'content' => 'required|string',
            'content_en' => 'required|string'
        ]);

        try {
            DB::beginTransaction();

            $dailyEmail = DailyEmail::create([
                'date' => $validated['date'],
                'subject' => $validated['subject'],
                'subject_en' => $validated['subject_en'],
                'content' => $validated['content'],
                'content_en' => $validated['content_en'],
                'sent' => false,
                'deleted' => false
            ]);

            DB::commit();

            return response()->json($dailyEmail, 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show(DailyEmail $dailyEmail): JsonResponse
    {
        return response()->json($dailyEmail);
    }

    public function update(Request $request, DailyEmail $dailyEmail): JsonResponse
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'subject_en' => 'required|string|max:255',
            'content' => 'required|string',
            'content_en' => 'required|string'
        ]);

        try {
            DB::beginTransaction();

            $dailyEmail->update([
                'subject' => $validated['subject'],
                'subject_en' => $validated['subject_en'],
                'content' => $validated['content'],
                'content_en' => $validated['content_en']
            ]);

            DB::commit();

            return response()->json($dailyEmail);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy(DailyEmail $dailyEmail): JsonResponse
    {
        try {
            $dailyEmail->update(['deleted' => true]);
            return response()->json(['message' => 'Daily email deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function send(DailyEmail $dailyEmail): JsonResponse
    {
        try {
            DB::beginTransaction();

            $users = User::where('deleted', false)
                ->where('type', 'customer')
                ->get();

            foreach ($users as $user) {
                $orders = Order::with(['menus' => function ($query) use ($dailyEmail) {
                    $query->whereDate('date', $dailyEmail->date)
                        ->where('deleted', false);
                }])
                ->where('user_id', $user->id)
                ->where('deleted', false)
                ->get();

                if ($orders->isNotEmpty()) {
                    Mail::send('emails.daily', [
                        'name' => $user->first_name . ' ' . strtoupper($user->last_name),
                        'subject' => $user->language === 'en' ? $dailyEmail->subject_en : $dailyEmail->subject,
                        'content' => $user->language === 'en' ? $dailyEmail->content_en : $dailyEmail->content,
                        'orders' => $orders,
                        'language' => $user->language
                    ], function ($message) use ($user, $dailyEmail) {
                        $message->to($user->email_address)
                            ->subject($user->language === 'en' ? $dailyEmail->subject_en : $dailyEmail->subject);
                    });
                }
            }

            $dailyEmail->update(['sent' => true]);

            DB::commit();

            return response()->json(['message' => 'Daily email sent successfully']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function getByDate(string $date): JsonResponse
    {
        $dailyEmail = DailyEmail::whereDate('date', Carbon::parse($date))
            ->where('deleted', false)
            ->first();

        if (!$dailyEmail) {
            return response()->json(['error' => 'Daily email not found'], 404);
        }

        return response()->json($dailyEmail);
    }
} 