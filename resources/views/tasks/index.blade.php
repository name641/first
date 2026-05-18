  @extends('layouts.app')

  @section('title', 'タスク一覧')

  @section('content')

  <div class="container">
    <h1>タスク一覧</h1>
    <a href="{{ route('tasks.create') }}" class="btn btn-primary mb-3">新しいタスクを作成</a>

    @if (session('success'))
      <div class="alert alert-success">
        {{ session('success') }}
      </div>
    @endif

    <table class="table">
      <thead>
        <tr>
          <th>タイトル</th>
          <th>説明</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        @foreach ($tasks as $task)
          <tr>
            <td>{{ $task->title }}</td>
            <td>{{ $task->description }}</td>
            <td>
              <a href="{{ route('tasks.edit', $task->id) }}" class="btn btn-secondary btn-sm">編集</a>

<form action="{{ route('tasks.destroy', $task->id) }}" method="POST" class="d-inline">
  @csrf
  @method('DELETE')

  <button type="submit"
      class="btn btn-danger btn-sm"
      onclick="return confirm('削除しますか？')">
      削除
  </button>
</form>
            </td>
          </tr>
        @endforeach
      </tbody>
    </table>
  </div>
  @endsection