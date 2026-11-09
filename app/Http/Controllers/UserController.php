<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;

class UserController extends Controller
{
    //
    public function index()
    {
        $user = User::all();
        // return$user;
        return Inertia::render('user/index',[
                'user' => $user,
        ]);
    }

    public function create()
    {
        return Inertia::render('user/create');
    }

    public function store()
    {
       $user = User::create([
            'name' => request('name'),
            'email' => request('email'),
            'password' => bcrypt(request('password')),
       ]);

       return "success";
    }

    public function edit($id)
    {
        $user = User::find($id);
        return Inertia::render('user/edit',[
            'user_edit' => $user,
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = User::find($id);
        $user->name = $request->input('name');
        $user->email = $request->input('email');
        if ($request->filled('password')) {
            $user->password = bcrypt($request->input('password'));
        }
        $user->save();

        return "success";
    }

    public function destroy(Request $request)
    {
        $id = $request->input('id');
        $user = User::find($id);
        if ($user) {
            $user->delete();
            return "success";
        } else {
            return "User not found";
        }
    }   
}
