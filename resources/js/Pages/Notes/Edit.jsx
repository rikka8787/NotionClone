import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm, usePage, router } from "@inertiajs/react";

export default function Edit() {
    const { note } = usePage().props;
    const { data, setData, put, processing, errors } = useForm({
        title: note.title,
        content: note.content,
    });

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

    const handleDelete = () => {
        if (confirm("確定要刪除這個筆記嗎？")) {
            router.delete(route("notes.destroy", note.id), {
                preserveScroll: true,
                preserveState: true,
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
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    編輯筆記
                </h2>
            }
        >
            <Head title="編輯筆記" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
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
                                        className="relative top-0 right-0 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                        disabled={processing}
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
