<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes; // 軟刪除

class Note extends Model
{
    use HasFactory, SoftDeletes; // 使用軟刪除
    protected $fillable = ['title', 'content', 'owner_id', 'group_id', 'visibility'];
    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }
    public function group()
    {
        return $this->belongsTo(Group::class, 'group_id');
    }
}
