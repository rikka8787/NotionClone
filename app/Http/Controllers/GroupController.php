<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GroupController extends Controller
{
    public function index()
    {
        $groups = Group::with('users')->get()->map(function ($group) {
            $group->is_member = $group->users->contains(auth()->id());
            return $group;
        });
        return Inertia::render('Groups/Index', [
            'groups' => $groups
        ]);
    }

    public function create()
    {
        $users = User::where('id', '!=', auth()->id())->get();
        return Inertia::render('Groups/Create', [
            'users' => $users
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'users' => 'array',
            'users.*' => 'exists:users,id',
        ], [
            'name.required' => '名稱不能為空！',
            'name.string' => '名稱必須是文字。',
            'users.array' => '用戶必須是陣列格式。',
            'users.*.exists' => '所選用戶不存在。',
        ]);

        // 建立群組並設定擁有者
        $group = Group::create([
            'name' => $validated['name'],
            'owner_id' => auth()->id(),
        ]);

        // 將選擇的用戶加入群組
        $group->users()->attach([
            auth()->id(),  // 添加擁有者為成員
            ...$validated['users']  // 展開其他選擇的成員
        ]);

        return redirect()->route('groups.index')->with('success', '群組已儲存！');
    }

    public function join(Request $request)
    {
        $validated = $request->validate([
            'group_id' => 'required|exists:groups,id',
        ], [
            'group_id.required' => '群組 ID 不能為空！',
            'group_id.exists' => '所選群組不存在。',
        ]);
        $group = Group::find($validated['group_id']);
        // 檢查使用者是否已經是群組成員
        if ($group->users->contains(auth()->id())) {
            return back()->with('error', '你已經是該群組的成員');
        }
        $group->users()->attach(auth()->id());
        return redirect()->route('groups.index')->with('success', '已加入群組！');
    }

    public function leave(Request $request)
    {
        $validated = $request->validate([
            'group_id' => 'required|exists:groups,id',
        ], [
            'group_id.required' => '群組 ID 不能為空！',
            'group_id.exists' => '所選群組不存在。',
        ]);

        $group = Group::find($validated['group_id']);

        // 檢查使用者是否為群組成員
        if (!$group->users->contains(auth()->id())) {
            return back()->with('error', '你不是該群組的成員');
        }

        // 移除使用者從群組
        $group->users()->detach(auth()->id());

        return redirect()->route('groups.index')->with('success', '已離開群組！');
    }

    public function show(Group $group)
    {
        
    }


    public function edit(Group $group)
    {
        $users = User::where('id', '!=', auth()->id())->get();
        $group->load('users');
        return Inertia::render('Groups/Edit', [
            'group' => $group,
            'users' => $users
        ]);
    }

    public function update(Request $request, Group $group)
    {

    }

    public function destroy(Group $group)
    {

    }
}
