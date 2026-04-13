<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Auth\Events\Registered;

class MagicLoginController extends Controller
{
    public function handle(\Illuminate\Http\Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
        ]);

        // Check if user exists
        $user = User::where('email', $request->email)->first();

        if ($user) {
            // check if email is verified
            if (!$user->hasVerifiedEmail()) {
                return response()->json([
                    'exists' => true,
                    'message' => 'Please verify your email first.'
                ], 403);
            }

            // Verified > create token
            $token = $user->createToken("auth_token")->plainTextToken;

            return response()->json([
                'exists' => true,
                'user' => $user,
                'token' => $token,
                'message' => 'Welcome back!',
            ]);
        } else {
            // New user > create but don't issue token yet
            $defaultName = "New User";
            $defaultPassword = Str::random(8);

            $user = User::create([
                'name' => $defaultName,
                'email' => $request->email,
                'password' => Hash::make($defaultPassword),
            ]);

            // Fire event to simulate verification email
            event(new Registered($user));

            // Log creation for dev
            Log::info("New user created (needs verification): {$user->email} | ID: {$user->id}");

            return response()->json([
                'exists' => false,
                'user' => $user,
                'message' => 'New account created! Please verify your email first.',
            ]);
        }
    }
}