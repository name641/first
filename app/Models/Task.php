<?php

  namespace App\Models;

  use Illuminate\Database\Eloquent\Factories\HasFactory;
  use Illuminate\Database\Eloquent\Model;

  class Task extends Model
  {
    use HasFactory;

    // 編集可能な属性を指定
protected $fillable = [
    'title',
    'description',
    'user_id',
];}