import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage, router, useForm } from "@inertiajs/react";
import { useState } from "react";

export default function Create() {
    const { groups, auth, users } = usePage().props;
    const [loading, setLoading] = useState({});
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        users: [],
    });
    const groupSubmit = (e) => {
        e.preventDefault();
        console.log(data);
        post(route("groups.store"));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        建立新群組
                    </h2>
                </div>
            }
        >
            <Head title="建立新群組" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <form onSubmit={groupSubmit}>
                            <div className="mb-4">
                                <label htmlFor="name">群組名稱</label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    required
                                />
                                {errors.name && (
                                    <div className="text-red-500 text-sm mt-1">
                                        {errors.name}
                                    </div>
                                )}
                            </div>
                            <div className="mb-0">
                                <label>選擇使用者</label>
                                <select
                                    name="users[]"
                                    multiple
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                                    value={data.users}
                                    onChange={(e) => {
                                        const selectedUsers = Array.from(
                                            e.target.selectedOptions,
                                            (option) => option.value
                                        );
                                        setData("users", selectedUsers);
                                    }}
                                >
                                    {users.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.name}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-sm text-gray-500 mt-1">
                                    按住 Ctrl 鍵可選擇或取消選擇多個使用者
                                </p>
                            </div>

                            <div className="mb-4"></div>
                            <div className="flex justify-end">
                                <Link
                                    href={route("groups.index")}
                                    className="relative top-0 right-0 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
                                >
                                    取消
                                </Link>
                                <button
                                    type="submit"
                                    className="relative top-0 right-0 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    disabled={processing}
                                >
                                    建立群組
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
