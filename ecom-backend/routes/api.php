<?php

use App\Http\Controllers\Api\Auth\LoginController;
use App\Http\Controllers\Api\Auth\LogoutController;
use App\Http\Controllers\Api\Auth\RegisterController;
use App\Http\Controllers\Api\Auth\UserInfoController;
use App\Http\Controllers\Api\SiteAssetController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\MagicLoginController;
use App\Http\Controllers\Api\ImageController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CollectionController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\Api\ShippingAddressController;
use App\Http\Controllers\Api\WishlistController;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\OrderController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use Illuminate\Support\Facades\Log;




Route::get('/health', function () {
    return response()->json(['status' => 'ok you are good to goo']);
});

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::post("/register",[RegisterController::class,"register"]);
Route::get('/email/verify/{id}/{hash}', function ($id, $hash) {
    $user = User::findOrFail($id);

    if (! hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
        return response()->json(['mess' => 'Invalid verification link'], 403);
    }

    $user->markEmailAsVerified();

    
    Log::info("Email verified: {$user->email} | ID: {$user->id}");
    $token = $user->createToken("auth_token")->plainTextToken;

    return response()->json(['mess' => 'Email verified successfully','verified_at' => $user->fresh()->email_verified_at, 'token' => $token]);
})->name("verification.verify");



Route::post("/login",[LoginController::class,"login"]);



Route::middleware('auth:sanctum')->group(function() {
    Route::get("/info",[UserInfoController::class,"profile"]);
    Route::post("/logout",[LogoutController::class,"logout"]);
});



Route::get('/site-assets/sections/{key}', [SiteAssetController::class, 'getSectionsBySlug']);
Route::get('/site-assets/{section}/{key}/{asset_key}', [SiteAssetController::class, 'show']);
Route::get('/site-assets/{section}/{key}', [SiteAssetController::class, 'index']);


Route::get("/products",[ProductController::class,"index"]);

Route::get("/products/latest",[ProductController::class,"latest"]);
//Route::get('/products/filter', [ProductController::class, 'filter']);
//Route::get("/products/collections/{gender}/{subcategory?}", [ProductController::class,"getProductsByCategory"]);

Route::get("/products/{id}",[ProductController::class,"show"]);
//Route::get("/products/category/{slug}",[ProductController::class,"categoryProductFlexible"]);




Route::middleware('auth:sanctum')->group(function() {
    Route::get("/cart",[CartController::class,"index"]);
    Route::post("/cart/add",[CartController::class,"add"]);
    Route::put("/cart/update/{product_id}/{size}",[CartController::class,"update"]);
    Route::delete("/cart/remove/{product_id}/{size}",[CartController::class,"remove"]);
    Route::post("/cart/merge",[CartController::class,"merge"]);
});

Route::middleware("auth:sanctum")->post("/create-order",[OrderController::class,"createOrder"]);
Route::middleware("auth:sanctum")->post("/verify-payment",[OrderController::class,"verifyPayment"]);
Route::middleware("auth:sanctum")->get("/orders/{id}",[OrderController::class,"getOrder"]);
Route::middleware("auth:sanctum")->get("/user-orders-fku",[OrderController::class,"getUserOrders"]);


Route::post("/magic-login",[MagicLoginController::class,"handle"]);


Route::get('/images', [ImageController::class, 'index']);



Route::get('/categories', [CategoryController::class, 'index']);     // list categories
   
Route::get('/categories/{id}', [CategoryController::class, 'show']); // show single category

Route::get('/collections/{slug}', [CollectionController::class, 'show']);


Route::get('/search', [SearchController::class, 'index']);
Route::post('/images', [ImageController::class, 'store']);

Route::prefix('admin')->middleware(['auth:sanctum', 'admin'])->group(function () {

    Route::post('/site-assets', [SiteAssetController::class, 'store']);
    Route::delete('/site-assets/{id}', [SiteAssetController::class, 'destroy']);

    Route::post("/product",[ProductController::class,"store"]);
    Route::post('/products/add-sizes', [ProductController::class, 'addSizes']);
    Route::patch('/products/{id}', [ProductController::class, 'updatePartial']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy'])->where('id', '[0-9]+');

    //Route::post('/images', [ImageController::class, 'store']);
    Route::delete('/images/{id}', [ImageController::class, 'destroy']);

    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{id}', [CategoryController::class, 'update']); // update category
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']); // delete category

    Route::post('/collections/save', [CollectionController::class, 'createOrUpdateCollection']);


});



Route::middleware('auth:sanctum')->group(function () {

    Route::get('/shipping-addresses', [ShippingAddressController::class, 'index']);
    Route::post('/shipping-addresses', [ShippingAddressController::class, 'store']);
    Route::get('/shipping-addresses/{id}', [ShippingAddressController::class, 'show']);
    Route::put('/shipping-addresses/{id}', [ShippingAddressController::class, 'update']);
    Route::delete('/shipping-addresses/{id}', [ShippingAddressController::class, 'destroy']);
    Route::post('/shipping-addresses/{id}/default', [ShippingAddressController::class, 'setDefault']);
});

Route::middleware('auth:sanctum')->group(function () {
    
    
    Route::post('/wishlist/{productId}', [WishlistController::class, 'toggle']);

    
    Route::get('/wishlist', [WishlistController::class, 'index']);

    
    Route::delete('/wishlist/{productId}', [WishlistController::class, 'remove']);
});