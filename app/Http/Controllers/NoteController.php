<?php

namespace App\Http\Controllers;

use App\Models\Note;
use App\Models\Group;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NoteController extends Controller
{
    // 1️⃣ 列出所有筆記
    public function index()
    {
        $userId = auth()->id();
        $userGroupIds = auth()->user()->groups()->pluck('groups.id')->toArray();

        $notes = Note::with(['owner', 'group'])
            ->where(function ($query) use ($userId, $userGroupIds) {
                $query->where('owner_id', $userId)  // 自己的筆記
                    ->orWhere('visibility', 'public')  // 公開筆記
                    ->orWhere(function ($q) use ($userGroupIds) {
                        $q->where('visibility', 'group')
                            ->whereIn('group_id', $userGroupIds);  // 使用者所屬群組的筆記
                    });
            })
            ->latest()  // 依建立時間排序
            ->get();

        return Inertia::render('Notes/Index', [
            'notes' => $notes
        ]);
    }

    // 2️⃣ 顯示新增筆記表單
    public function create()
    {
        $userGroups = auth()->user()->groups()->get();
        return Inertia::render('Notes/Create', [
            'userGroups' => $userGroups
        ]);
    }

    // 3️⃣ 儲存新筆記
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'visibility' => 'required|string|in:private,group,public',  // 修改這裡
            'group_id' => 'nullable|integer|exists:groups,id',
        ], [
            'title.required' => '標題不能為空！',
            'title.string' => '標題必須是文字。',
            'title.max' => '標題不能超過255個字。',
            'content.required' => '內容不能為空！',
            'content.string' => '內容必須是文字。',
            'visibility.required' => '可見度不能為空！',
            'visibility.in' => '可見度必須是 private、group 或 public',  // 新增這行
            'group_id.exists' => '選擇的群組不存在。'
        ]);

        // 添加當前認證用戶的 ID 作為 owner_id
        $validated['owner_id'] = auth()->id();

        // 如果不是群組，就清空 group_id
        if ($validated['visibility'] !== 'group') {
            $validated['group_id'] = null;
        }

        // 建立筆記前先確認資料
        \Log::info('Creating note with data:', $validated);  // 新增這行來記錄資料

        $note = Note::create($validated);

        return redirect()->route('notes.index')->with('success', '筆記已儲存！');
    }

    // 4️⃣ 顯示單篇筆記
    public function show(Note $note)
    {

    }

    // 5️⃣ 顯示編輯筆記表單
    public function edit(Note $note)
    {
        // 載入關聯資料
        $note->load(['owner', 'group.users']);  // 加入 group.users 來載入群組成員

        // 加入群組成員資料
        if ($note->group) {
            $note->group_members = $note->group->users->pluck('id')->toArray();
        } else {
            $note->group_members = [];
        }

        // 取得使用者的群組
        $userGroups = auth()->user()->groups()->with('users')->get();

        return Inertia::render('Notes/Edit', [
            'note' => $note,
            'userGroups' => $userGroups,
        ]);
    }

    // 6️⃣ 更新筆記
    public function update(Request $request, Note $note)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'visibility' => 'required|string',
            'group_id' => 'nullable|integer|exists:groups,id',
        ], [
            'title.required' => '標題不能為空！',
            'title.string' => '標題必須是文字。',
            'title.max' => '標題不能超過255個字。',
            'content.required' => '內容不能為空！',
            'content.string' => '內容必須是文字。',
            'visibility.required' => '可見度不能為空！',
            'visibility.in' => '可見度必須是 private、group 或 public。',
            'group_id.exists' => '選擇的群組不存在。'
        ]);

        $note->update($validated);
        $note->refresh();
        $note->load(['owner', 'group.users']);  // 加入 group.users 來載入群組成員
        if ($note->group) {
            $note->group_members = $note->group->users->pluck('id')->toArray();
        } else {
            $note->group_members = [];
        }

        // 取得使用者的群組
        $userGroups = auth()->user()->groups()->with('users')->get();

        return Inertia::render('Notes/Edit', [
            'note' => $note,
            'userGroups' => $userGroups,
            'success' => true,
            'message' => '筆記更新成功！'
        ]);
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
