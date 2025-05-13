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
        $notes = Note::with('owner')->get();
        return Inertia::render('Notes/Index', [
            'notes' => $notes
        ]);
    }

    // 2️⃣ 顯示新增筆記表單
    public function create()
    {
        return Inertia::render('Notes/Create');
    }

    // 3️⃣ 儲存新筆記
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'permissions' => 'required|integer',
        ], [
            'title.required' => '標題不能為空！',
            'title.string' => '標題必須是文字。',
            'title.max' => '標題不能超過255個字。',
            'content.required' => '內容不能為空！',
            'content.string' => '內容必須是文字。',
        ]);

        // 添加當前認證用戶的 ID 作為 owner_id
        $validated['owner_id'] = auth()->id();
        $validated['group_id'] = $validated['group_id'] ?? null;

        Note::create($validated);

        return redirect()->route('notes.index')->with('success', '筆記已儲存！');
    }

    // 4️⃣ 顯示單篇筆記
    public function show(Note $note)
    {
        
    }

    // 5️⃣ 顯示編輯筆記表單
    public function edit(Note $note)
    {
        $note->load('owner');
        $note->load('group');
        return Inertia::render('Notes/Edit', [
            'note' => $note
        ]);
    }

    // 6️⃣ 更新筆記
    public function update(Request $request, Note $note)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ], [
            'title.required' => '標題不能為空！',
            'title.string' => '標題必須是文字。',
            'title.max' => '標題不能超過255個字。',
            'content.required' => '內容不能為空！',
            'content.string' => '內容必須是文字。',
        ]);

        $note->update($validated);
        return redirect()->route('notes.edit', $note->id)
                ->with('success', '筆記更新成功！');
    }

    // 7️⃣ 刪除筆記
    public function destroy(Note $note)
    {
        try {
            $note->delete();
            return redirect()->route('notes.index')->with('success', '筆記已刪除！');
        } catch (\Exception $e) {
            return redirect()->route('notes.index')->with('error', '刪除筆記失敗！');
        }
    }
}
