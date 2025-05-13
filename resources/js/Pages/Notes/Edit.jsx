import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm, usePage, router } from "@inertiajs/react";
import { useState, useEffect } from "react";

export default function Edit() {
    const [ canEdit, setCanEdit ] = useState(false);
    const { note, auth } = usePage().props;
    const { data, setData, put, processing, errors } = useForm({
        title: note.title,
        content: note.content,
        permissions: note.permissions,
    });

    useEffect(() => {
        // 檢查當前用戶是否有寫入權限
        setCanEdit(hasWritePermission());
    },[]);

    // 檢查當前用戶是否有寫入權限
    const hasWritePermission = () => {
        const permissions = String(note.permissions).padStart(3, 0);
        if(note.owner.id === auth.user.id) {                // 擁有者
            return (parseInt(permissions[0]) & 2) > 0;
        } else if(note.group_id === auth.user.group_id) {   // 同群組
            return (parseInt(permissions[1]) & 2) > 0;
        } else {                                            // 其他人
            return (parseInt(permissions[2]) & 2) > 0;
        }
    }

    // 更新筆記處理
    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("notes.update", note.id), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                alert("筆記已更新！");
            },
            onError: (errors) => {
                console.error(errors);
            },
        });
    };

    // 刪除處理
    const handleDelete = () => {
        if (confirm("確定要刪除這個筆記嗎？")) {
            if(auth.user.id != note.owner.id) {
                alert("你沒有權限刪除這個筆記！");
                return;
            }
            router.delete(route("notes.destroy", note.id), {
                preserveScroll: true,   // 在頁面重新載入會保留滾動位置
                preserveState: true,    // 在頁面重新載入會保留表單的狀態
                onSuccess: () => {
                    alert("筆記已刪除！");
                },
                onError: (errors) => {
                    console.error(errors);
                },
            });
        }
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center w-full">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        編輯筆記
                    </h2>
                    <div className="flex justify-end items-center">
                        <span className="mr-2 font-semibold">權限：</span>
                        <select
                            id="permissions"
                            value={data.permissions}
                            onChange={(e) =>
                                setData("permissions", parseInt(e.target.value))
                            }
                            className="border-gray-300 border-2 rounded-md shadow-sm focus:outline-none focus:ring-0 focus:border-gray-300 p-2"
                        >
                            <option value="600">私密</option>
                            <option value="666">公開(所有人皆可讀寫)</option>
                            <option value="644">標準(同群組、其他人可讀)</option>
                            <option value="444">唯讀</option>
                        </select>
                    </div>
                </div>
            }
        >
            <Head title="編輯筆記" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-4 flex justify-between items-center">
                                <span className="font-semibold">擁有者：{note.owner.name}</span>
                                <span className="font-semibold text-red-600">已封存</span>                         
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-0">
                                    <input
                                        type="text"
                                        id="title"
                                        value={data.title}
                                        onChange={(e) =>
                                            setData("title", e.target.value)
                                        }
                                        className="block w-full rounded-t-md rounded-b-none border-gray-300 border-b-0 border-2 shadow-sm focus:outline-none focus:ring-0 focus:border-gray-300 p-2 text-xl font-bold"
                                        required
                                    />
                                    {errors.title && (
                                        <div className="text-red-500 text-sm mt-1">
                                            {errors.title}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <textarea
                                        id="content"
                                        value={data.content}
                                        onChange={(e) =>
                                            setData("content", e.target.value)
                                        }
                                        rows={10}
                                        className="block w-full rounded-t-none rounded-b-md border-gray-300 border-t-0 border-2 shadow-sm focus:outline-none focus:ring-0 focus:border-gray-300 p-2"
                                        required
                                    />
                                    {errors.content && (
                                        <div className="text-red-500 text-sm mt-1">
                                            {errors.content}
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-end">
                                    <Link
                                        href={route("notes.index")}
                                        className="relative top-0 right-0 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
                                    >
                                        取消
                                    </Link>
                                    <button
                                        type="button"
                                        className="relative top-0 right-0 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                                        onClick={handleDelete}
                                    >
                                        刪除筆記
                                    </button>
                                    <button
                                        type="submit"
                                        className={`relative top-0 right-0 text-white font-bold py-2 px-4 rounded ${
                                            canEdit
                                                ? "bg-blue-500 hover:bg-blue-700"
                                                : "bg-gray-500 hover:bg-gray-700 cursor-not-allowed"
                                        }`}
                                        disabled={!canEdit || processing}
                                        title={!canEdit ? "無編輯權限" : ""}
                                    >
                                        更新筆記
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
