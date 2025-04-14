<?php

namespace App\Http\Controllers;

use App\Models\Note;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NoteController extends Controller
{
    // 1️⃣ 列出所有筆記
    public function index()
    {
        $notes = Note::latest()->get();
        return Inertia::render('Notes/Index', [
            'notes' => $notes
        ]);
    }

    // 2️⃣ 顯示新增筆記表單
    public function create()
    {
        //
    }

    // 3️⃣ 儲存新筆記
    public function store(Request $request)
    {
        //
    }

     // 4️⃣ 顯示單篇筆記
    public function show(Note $note)
    {
        //
    }

    // 5️⃣ 顯示編輯筆記表單
    public function edit(Note $note)
    {
        //
    }

    // 6️⃣ 更新筆記
    public function update(Request $request, Note $note)
    {
        //
    }

    // 7️⃣ 刪除筆記
    public function destroy(Note $note)
    {
        //
    }
}
