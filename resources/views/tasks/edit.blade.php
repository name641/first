@extends('layouts.app')

@section('title', 'タスク編集')

@section('content')

<div class="container">
    <h1>タスク編集</h1>

    <form action="{{ route('tasks.update', $task->id) }}" method="POST">
        @csrf
        @method('PUT')

        <div class="form-group">
            <label for="title">タイトル</label>
            <input
                type="text"
                class="form-control"
                id="title"
                name="title"
                value="{{ $task->title }}"
                required
            >
        </div>

        <div class="form-group">
            <label for="description">説明</label>
            <textarea
                class="form-control"
                id="description"
                name="description"
                rows="3"
                required
            >{{ $task->description }}</textarea>
        </div>

        <button type="submit" class="btn btn-primary">更新</button>
    </form>
</div>

@endsection