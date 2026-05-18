<?php
namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
  public function index()
  {
    $tasks = Task::all();
    return view('tasks.index', compact('tasks'));
  }

  public function create()
  {
    return view('tasks.create');
  }

public function store(Request $request)
{
    $request->validate([
        'title' => 'required|max:255',
        'description' => 'required',
    ]);

    Task::create([
        'title' => $request->title,
        'description' => $request->description,
        'user_id' => auth()->id(),
    ]);

    return redirect()->route('tasks.index')->with('success', 'タスクが作成されました。');
}

  public function edit(Task $task)
  {
    if (auth()->user()->id !== $task->user_id) {
      return redirect()->route('tasks.index')->with('error', '許可されていない操作です。');
    }

    return view('tasks.edit', compact('task'));
  }

public function update(Request $request, Task $task)
{
    if (auth()->id() !== $task->user_id) {
        return redirect()->route('tasks.index')
            ->with('error', '許可されていない操作です。');
    }

    $request->validate([
        'title' => 'required|max:255',
        'description' => 'required',
    ]);

    $task->update($request->all());

    return redirect()->route('tasks.index')->with('success', 'タスクが更新されました。');
}
public function destroy(Task $task)
{
    if (auth()->id() !== $task->user_id) {
        return redirect()->route('tasks.index')
            ->with('error', '許可されていない操作です。');
    }

    $task->delete();

    return redirect()->route('tasks.index')->with('success', 'タスクが削除されました。');
}
}
