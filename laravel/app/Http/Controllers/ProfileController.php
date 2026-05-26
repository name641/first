<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    public function me(
        Request $request
    )
    {
        return response()->json([
            'id'=>
                $request->user()->id,

            'name'=>
                $request->user()->name,

            'email'=>
                $request->user()->email
        ]);
    }

    public function update(
        Request $request
    )
    {
        $user =
            $request->user();

        $data =
            $request->validate([

            'name'=>
                'required|string|max:255',

            'email'=>
                'required|email|unique:users,email,' .
                $user->id,

            'password'=>
                'nullable|min:8'
        ]);

        $updateData=[

            'name'=>
                $data['name'],

            'email'=>
                $data['email']
        ];

        if(
            !empty(
                $data['password']
            )
        ){
            $updateData[
                'password'
            ]=
            Hash::make(
                $data['password']
            );
        }

        $user->update(
            $updateData
        );

        return response()->json([

            'message'=>
                'updated',

            'user'=>$user
        ]);
    }

    public function delete(
        Request $request
    )
    {
        $user=
            $request->user();

        $user
            ->tokens()
            ->delete();

        $user->delete();

        return response()->json([
            'message'=>
                'deleted'
        ]);
    }
}