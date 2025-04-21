import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: "",
        content: "",
    });
    const noteSubmit = (e) => {
        e.preventDefault();
        console.log(data);
        post(route("notes.store"));
    };
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    新增筆記
                </h2>
            }
        >
            <Head title="新增筆記" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
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
                                <div>
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
