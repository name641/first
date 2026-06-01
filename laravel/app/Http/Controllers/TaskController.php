<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    // 一覧取得
    public function index(Request $request)
    {
        $query = Task::where(
            'user_id',
            auth()->id()
        );

        // 検索
        if ($request->filled('search')) {

            $query->where(function ($q) use ($request) {

                $q->where(
                    'title',
                    'like',
                    '%' . $request->search . '%'
                )
                ->orWhere(
                    'description',
                    'like',
                    '%' . $request->search . '%'
                );
            });
        }

        // statusフィルタ
        if (
            $request->has('status')
            && $request->status !== 'all'
        ) {
            $query->where(
                'status',
                $request->status
            );
        }

        // deadlineフィルタ
        if ($request->filled('deadline')) {

            if ($request->deadline === 'overdue') {

                $query->whereDate(
                    'deadline',
                    '<',
                    today()
                );

            } elseif ($request->deadline === 'today') {

                $query->whereDate(
                    'deadline',
                    today()
                );

            } elseif ($request->deadline === 'future') {

                $query->whereDate(
                    'deadline',
                    '>',
                    today()
                );
            }
        }

        return $query
            ->orderBy('status')
            ->orderBy('order')
            ->get();
    }

    // create view
    public function create()
    {
        return view('tasks.create');
    }

    // 新規作成
    public function store(Request $request)
    {
        // dd($request->all());
        $request->validate([    
            'title' => 'required|max:255',
            'description' => 'required',
            'deadline' => 'nullable|date',
            'status' => 'nullable|in:todo,doing,done',
        ]);

        $task = Task::create([
            'title' => $request->title,
            'description' => $request->description,
            'deadline' => $request->deadline,
            'status' => $request->status ?? 'todo',
            'user_id' => auth()->id(),
        ]);

        return response()->json($task, 201);
    }

    // 編集画面
    public function edit(Task $task)
    {
        if (auth()->user()->id !== $task->user_id) {
            return redirect()
                ->route('tasks.index')
                ->with('error', '許可されていない操作です。');
        }

        return view('tasks.edit', compact('task'));
    }


    // 更新
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
            'status' => 'sometimes|in:todo,doing,done',
        ]);

        $task->update([
            'title' => $request->title,
            'description' => $request->description,
            'deadline' => $request->deadline,
            'status' => $request->status ?? $task->status,
        ]);

        return response()->json($task);
    }

    // 削除
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
        public function show(Task $task)
    {
        if (auth()->id() !== $task->user_id) {
            return response()->json(['error' => 'Forbidden'], 403);
        }

        return response()->json($task);
    }
    public function reorder(Request $request)
    {
        foreach ($request->all() as $taskData) {

            Task::where(
                'id',
                $taskData['id']
            )
            ->where(
                'user_id',
                auth()->id()
            )
            ->update([
                'status' => $taskData['status'],
                'order' => $taskData['order']
            ]);
        }

        return response()->json([
            'success' => true
        ]);
    }

    
}
