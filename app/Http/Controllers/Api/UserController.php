<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\Rule;

final class UserController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'emailAddress' => 'required|email',
            'password' => 'required|string'
        ]);

        $user = User::with('supplier')
            ->where('email_address', $validated['emailAddress'])
            ->where('deleted', false)
            ->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return response()->json(['error' => 'wrong credentials'], 400);
        }

        $tokenDuration = $user->type === 'administrator' ? '12h' : '10m';
        $token = $user->createToken('auth_token', ['*'], now()->add($tokenDuration))->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token
        ]);
    }

    public function loginAs(int $id): JsonResponse
    {
        $user = User::with('supplier')
            ->where('id', $id)
            ->where('deleted', false)
            ->first();

        if (!$user) {
            return response()->json(['error' => 'wrong credentials'], 400);
        }

        $tokenDuration = '24h';
        $token = $user->createToken('auth_token', ['*'], now()->add($tokenDuration))->plainTextToken;

        return response()->json([
            'loginLink' => config('app.url') . '/login/' . $token
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'type' => 'required|string|in:administrator,supplier,customer',
            'language' => 'required|string|in:fr,en',
            'emailAddress' => 'required|email|unique:users,email_address',
            'supplierId' => 'nullable|integer|exists:suppliers,id'
        ]);

        try {
            DB::beginTransaction();

            $user = User::create([
                'first_name' => $validated['firstName'],
                'last_name' => $validated['lastName'],
                'type' => $validated['type'],
                'language' => $validated['language'],
                'email_address' => $validated['emailAddress'],
                'password' => Hash::make(Str::random(16)),
                'supplier_id' => $validated['type'] === 'supplier' && $validated['supplierId'] > 0 
                    ? $validated['supplierId'] 
                    : null,
                'pending_registration' => true,
                'deleted' => false
            ]);

            $tokenDuration = $user->type === 'administrator' ? '12h' : '1h';
            $token = $user->createToken('auth_token', ['*'], now()->add($tokenDuration))->plainTextToken;
            $passwordLink = config('app.url') . '/login/' . $token;

            // Envoyer l'email de finalisation d'inscription
            Mail::send('emails.finalize-registration', [
                'name' => $user->first_name . ' ' . strtoupper($user->last_name),
                'passwordLink' => $passwordLink,
                'language' => $user->language
            ], function ($message) use ($user) {
                $message->to($user->email_address)
                    ->subject('Finalize your registration');
            });

            DB::commit();

            return response()->json($user, 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'type' => 'required|string|in:administrator,supplier,customer',
            'language' => 'required|string|in:fr,en',
            'emailAddress' => [
                'required',
                'email',
                Rule::unique('users')->ignore($user->id)
            ],
            'supplierId' => 'nullable|integer|exists:suppliers,id',
            'resetPassword' => 'boolean'
        ]);

        try {
            DB::beginTransaction();

            $updateData = [
                'first_name' => $validated['firstName'],
                'last_name' => $validated['lastName'],
                'type' => $validated['type'],
                'language' => $validated['language'],
                'email_address' => $validated['emailAddress'],
                'supplier_id' => $validated['type'] === 'supplier' && $validated['supplierId'] > 0 
                    ? $validated['supplierId'] 
                    : null,
                'deleted' => false
            ];

            if ($validated['resetPassword'] ?? false) {
                $updateData['password'] = Hash::make(Str::random(16));
                $updateData['pending_registration'] = true;

                $tokenDuration = $validated['type'] === 'administrator' ? '12h' : '1h';
                $token = $user->createToken('auth_token', ['*'], now()->add($tokenDuration))->plainTextToken;
                $passwordLink = config('app.url') . '/login/' . $token;

                // Envoyer l'email de réinitialisation de mot de passe
                Mail::send('emails.finalize-registration', [
                    'name' => $validated['firstName'] . ' ' . strtoupper($validated['lastName']),
                    'passwordLink' => $passwordLink,
                    'language' => $validated['language']
                ], function ($message) use ($validated) {
                    $message->to($validated['emailAddress'])
                        ->subject('Reset your password');
                });
            }

            $user->update($updateData);

            DB::commit();

            return response()->json($user);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function updateLanguage(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'language' => 'required|string|in:fr,en'
        ]);

        try {
            $user = Auth::user();
            $user->update(['language' => $validated['language']]);
            return response()->json($user);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy(User $user): JsonResponse
    {
        try {
            $user->update(['deleted' => true]);
            return response()->json(['message' => 'User deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function index(): JsonResponse
    {
        $users = User::with('supplier')
            ->where('deleted', false)
            ->get();

        return response()->json($users);
    }

    public function show(User $user): JsonResponse
    {
        return response()->json($user->load('supplier'));
    }
} 