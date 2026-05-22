<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    // ======================
    // 一覧取得
    // ======================
    public function index()
    {
        return Task::where('user_id', auth()->id())->get();
    }

    // ======================
    // create view
    // （APIだけなら不要）
    // ======================
    public function create()
    {
        return view('tasks.create');
    }

    // ======================
    // 新規作成
    // ======================
public function store(Request $request)
{
    // dd($request->all());
    $request->validate([
        'title' => 'required|max:255',
        'description' => 'required',
        'deadline' => 'nullable|date',
    ]);

    $task = Task::create([
        'title' => $request->title,
        'description' => $request->description,
        'deadline' => $request->deadline,
        'user_id' => auth()->id(),
    ]);

    return response()->json($task, 201);
}

    // ======================
    // 編集画面
    // （APIだけなら不要）
    // ======================
    public function edit(Task $task)
    {
        if (auth()->user()->id !== $task->user_id) {
            return redirect()
                ->route('tasks.index')
                ->with('error', '許可されていない操作です。');
        }

        return view('tasks.edit', compact('task'));
    }

    // ======================
    // 更新
    // ======================
    public function update(Request $request, Task $task)
    {
        if (auth()->id() !== $task->user_id) {
            return response()->json([
                'error' => 'Forbidden'
            ], 403);
        }

        $request->validate([
            'title' => 'required|max:255',
            'description' => 'required',
            'deadline' => 'nullable|date',
        ]);

        $task->update([
            'title' => $request->title,
            'description' => $request->description,
            'deadline' => $request->deadline,
        ]);

        return response()->json($task);
    }

    // ======================
    // 削除
    // ======================
    public function destroy(Task $task)
    {
        if (auth()->id() !== $task->user_id) {
            return response()->json([
                'error' => 'Forbidden'
            ], 403);
        }

        $task->delete();

        return response()->json([
            'message' => 'deleted'
        ]);
    }
}