<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        return response()->json(
            User::select(
                'id',
                'name',
                'email',
                'created_at'
            )->get()
        );
    }

    public function store(
        Request $request
    )
    {
        $data =
            $request->validate(

            [
                'name'=>[
                    'required',
                    'max:50'
                ],

                'email'=>[
                    'required',
                    'email',
                    'unique:users'
                ],

                'password'=>[
                    'required',
                    'min:8'
                ]
            ],

            [
                'name.required'=>
                    '名前を入力してください',

                'name.max'=>
                    '名前は50文字以内です',

                'email.required'=>
                    'メールを入力してください',

                'email.email'=>
                    'メール形式が正しくありません',

                'email.unique'=>
                    'このメールは既に登録されています',

                'password.required'=>
                    'パスワードを入力してください',

                'password.min'=>
                    'パスワードは8文字以上です'
            ]
        );

        $user =
            User::create([

            'name'=>
                $data['name'],

            'email'=>
                $data['email'],

            'password'=>
                Hash::make(
                    $data['password']
                )
        ]);

        return response()->json([
            'message'=>
                'User created',

            'user'=>
                $user
        ],201);
    }
}