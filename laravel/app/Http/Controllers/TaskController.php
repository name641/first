<?php
namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
  public function index()
  {
    return Task::where('user_id', auth()->id())->get();
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

    $task = Task::create([
      'title' => $request->title,
      'description' => $request->description,
      'user_id' => auth()->id(),
    ]);

    return response()->json($task, 201);
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
      return response()->json(['error' => 'Forbidden'], 403);
    }

    $task->update([
      'title' => $request->title,
      'description' => $request->description,
    ]);

    return response()->json($task);
  }


  public function destroy(Task $task)
  {
    if (auth()->id() !== $task->user_id) {
      return response()->json(['error' => 'Forbidden'], 403);
    }

    $task->delete();

    return response()->json(['message' => 'deleted']);
  }
}
