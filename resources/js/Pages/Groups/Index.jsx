import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage, router } from "@inertiajs/react";
import { useState } from "react";

export default function Index() {
    const { groups, auth, flash } = usePage().props;
    const [loading, setLoading] = useState({});

    // 處理加入群組
    const handleJoin = (groupId) => {
        if (loading[groupId]) return;

        setLoading((prev) => ({ ...prev, [groupId]: true }));
        console.log(groupId);
        router.post(
            route("groups.join"),
            {
                // 如果是Route::post('groups/{group}/join')可以使用post(route('groups.join', groupId))，但我是定義Route::post('groups/join')
                group_id: groupId,
            },
            {
                onSuccess: () => {
                    setLoading((prev) => ({ ...prev, [groupId]: false }));
                },
                onError: () => {
                    setLoading((prev) => ({ ...prev, [groupId]: false }));
                    alert("加入群組失敗");
                },
            }
        );
    };

    // 處理離開群組
    const handleLeave = (groupId) => {
        if (loading[groupId]) return;

        setLoading((prev) => ({ ...prev, [groupId]: true }));
        console.log(groupId);
        router.post(
            route("groups.leave"),
            {
                group_id: groupId,
            },
            {
                onSuccess: () => {
                    setLoading((prev) => ({ ...prev, [groupId]: false }));
                },
                onError: () => {
                    setLoading((prev) => ({ ...prev, [groupId]: false }));
                    alert("離開群組失敗");
                },
            }
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        群組
                    </h2>
                    <Link
                        href={route("groups.create")}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        建立新群組
                    </Link>
                </div>
            }
        >
            <Head title="群組" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {groups?.map((group) => (
                                <div
                                    key={group.id}
                                    className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                                    onClick={() => {
                                        router.get(route('groups.edit', group.id));
                                    }}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold">
                                                {group.name}
                                            </h3>
                                        </div>
                                        {group.owner_id === auth.user.id ? (
                                            <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                                擁有者
                                            </span>
                                        ) : group.is_member ? (
                                            <div>
                                                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                                    成員
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        handleLeave(group.id)
                                                    }
                                                    disabled={loading[group.id]}
                                                    className={`text-white font-bold py-1 px-3 rounded text-sm
                                                    ${
                                                        loading[group.id]
                                                            ? "ml-4 bg-gray-400 cursor-not-allowed"
                                                            : "ml-4 bg-red-500 hover:bg-red-700"
                                                    }`}
                                                >
                                                    {loading[group.id]
                                                        ? "處理中..."
                                                        : "離開群組"}
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() =>
                                                    handleJoin(group.id)
                                                }
                                                disabled={loading[group.id]}
                                                className={`text-white font-bold py-1 px-3 rounded text-sm
                                                    ${
                                                        loading[group.id]
                                                            ? "bg-gray-400 cursor-not-allowed"
                                                            : "bg-blue-500 hover:bg-blue-700"
                                                    }`}
                                            >
                                                {loading[group.id]
                                                    ? "處理中..."
                                                    : "加入群組"}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {(!groups || groups.length === 0) && (
                            <div className="text-center py-8 text-gray-500">
                                目前沒有可用的群組
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
