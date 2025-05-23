import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function Create() {
    const { userGroups } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        title: "",
        content: "",
        visibility: 'private',
        group_id: "",
        userGroups: [],
    });
    const noteSubmit = (e) => {
        e.preventDefault();
        console.log(data);
        post(route("notes.store"));
    };
    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center w-full">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        新增筆記
                    </h2>
                    <div className="flex justify-end items-center">
                        <span className="mr-2 font-semibold">權限：</span>
                        <select
                            id="visibility"
                            value={data.visibility}
                            onChange={(e) =>
                                setData("visibility", e.target.value)
                            }
                            className="border-gray-300 border-2 rounded-md shadow-sm focus:outline-none focus:ring-0 focus:border-gray-300 p-2"
                        >
                            <option value="private">私密</option>
                            <option value="group">群組</option>
                            <option value="public">公開</option>
                        </select>
                        {/* 當選擇群組時顯示群組選擇器 */}
                        {data.visibility === 'group' && (
                            <div className="ml-4 flex items-center">
                                <span className="mr-2 font-semibold">選擇群組：</span>
                                <select
                                    id="group_id"
                                    value={data.group_id}
                                    onChange={(e) =>
                                        setData("group_id", e.target.value)
                                    }
                                    className="border-gray-300 border-2 rounded-md shadow-sm focus:outline-none focus:ring-0 focus:border-gray-300 p-2"
                                    required={data.visibility === 'group'}
                                >
                                    <option value="">請選擇群組</option>
                                    {userGroups.map((group) => (
                                        <option key={group.id} value={group.id}>
                                            {group.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                </div>
            }
        >
            <Head title="新增筆記" />
            <div className="">
                <div className="">
                    <div className="overflow-auto bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={noteSubmit}>
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
                                        placeholder="標題"
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
                                    {errors.title && (
                                        <div className="text-red-500 text-sm mt-1">
                                            {errors.title}
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
                                        type="submit"
                                        className="relative top-0 right-0 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                        disabled={processing}
                                    >
                                        建立筆記
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
