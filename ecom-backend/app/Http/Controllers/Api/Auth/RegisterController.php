<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Testing\Fluent\Concerns\Has;
use Symfony\Contracts\Service\Attribute\Required;
use Illuminate\Support\Str;

class RegisterController extends Controller
{
    //
    public function register(Request $request){
        //Valid Input
        $request->validate(
            [
                "name"=>"required|string|max:120",
                "email"=>"required|string|email|max:120|unique:users",
                "password"=>"required|string|min:8|confirmed",
            ]
        );

        
        $user=User::create(
            [
                "name"=>$request->name,
               
                "email"=>$request->email,
                "password"=>Hash::make($request->password),
                

            ]
        );
        //sending email verification
        event(new Registered($user));

        //respond on page
        return response()->json(
            ['message' => 'User registered! Check your email to verify your account.'], 201);
            
        
    }
}
