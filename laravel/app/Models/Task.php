<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'deadline',
        'status',
        'order',
        'user_id',
    ];

    protected $casts = [
        'deadline' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

// namespace App\Models;

// use Illuminate\Database\Eloquent\Model;

// class Task extends Model
// {
// protected $fillable = [
//    'title',
//    'description',
//    'deadline',
//    'status',
//    'order',
//    'user_id'
// ];
// }

// namespace App\Models;

// use Illuminate\Database\Eloquent\Model;

// class Task extends Model
// {
//     protected $fillable = [

//         'title',
//         'description',
//         'deadline',
//         'status',
//         'order',
//         'user_id'
//     ];

//     protected $casts = [

//         'deadline'=>'date'
//     ];

//     public function user()
//     {
//         return $this->belongsTo(
//             User::class
//         );
//     }
// }