<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ShippingAddress;

class ShippingAddressController extends Controller
{
    //
    public function index(Request $request)
    {
        return ShippingAddress::where('user_id', $request->user()->id)
            ->orderBy('is_default', 'desc')
            ->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'full_name' => 'required|string',
            'phone' => 'nullable|string',
            'address_line_1' => 'required|string',
            'address_line_2' => 'nullable|string',
            'city' => 'required|string',
            'state' => 'required|string',
            'pincode' => 'required|string',
            'country' => 'nullable|string',
        ]);

        $data['user_id'] = $request->user()->id;
        $hasAddress = ShippingAddress::where('user_id', $request->user()->id)->exists();

        if (!$hasAddress) {
            $data['is_default'] = true;
        }

        $address = ShippingAddress::create($data);

        return response()->json([
            'message' => 'Address created successfully',
            'address' => $address
        ]);
    }

    public function show(Request $request, $id)
    {
        $address = ShippingAddress::where('user_id', $request->user()->id)
            ->where('id', $id)
            ->first();

        if (!$address) {
            return response()->json(['message' => 'Address not found'], 404);
        }

        return $address;
    }

    public function update(Request $request, $id)
    {
        $address = ShippingAddress::where('user_id', $request->user()->id)
            ->where('id', $id)
            ->first();

        if (!$address) {
            return response()->json(['message' => 'Address not found'], 404);
        }

        $data = $request->validate([
            'full_name' => 'sometimes|string',
            'phone' => 'sometimes|string',
            'address_line_1' => 'sometimes|string',
            'address_line_2' => 'sometimes|string',
            'city' => 'sometimes|string',
            'state' => 'sometimes|string',
            'pincode' => 'sometimes|string',
            'country' => 'sometimes|string',
        ]);

        $address->update($data);

        return response()->json([
            'message' => 'Address updated successfully',
            'address' => $address
        ]);
    }

   
    public function destroy(Request $request, $id)
    {
        $address = ShippingAddress::where('user_id', $request->user()->id)
            ->where('id', $id)
            ->first();

        if (!$address) {
            return response()->json(['message' => 'Address not found'], 404);
        }

        $address->delete();

        return response()->json([
            'message' => 'Address deleted successfully'
        ]);
    }

    public function setDefault(Request $request, $id)
    {
        $userId = $request->user()->id;

        $address = ShippingAddress::where('user_id', $userId)
            ->where('id', $id)
            ->first();

        if (!$address) {
            return response()->json(['message' => 'Address not found'], 404);
        }

        
        ShippingAddress::where('user_id', $userId)
            ->update(['is_default' => false]);

        
        $address->update(['is_default' => true]);

        return response()->json([
            'message' => 'Default address updated',
            'address' => $address
        ]);
    }
}
