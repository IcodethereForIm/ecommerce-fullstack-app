<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Request;
use PhpParser\Node\Stmt\TryCatch;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
Use Illuminate\Support\Str;


class LoginController extends Controller
{
    //
    public function login(LoginRequest $request){

    try{
            //Validate&Authinticate

        $request->authenticate();
        $user=$request->user();

        //Checking user email verified or not

        if(!$user->hasVerifiedEmail()){
            return response()->json(['message' => 'Please verify your email first.'], 403);
        }

        //Create Token

        $token=$user->createToken("auth_token")->plainTextToken;
        


        return response()->json([
        'message' => 'Login successful',
        'user' => $user,
        'token' => $token,
    ]);
    }
    catch(ValidationException $e){
        return response()->json(['message' => 'Email or password is incorrect'], 401);
    }

        
    }


}
