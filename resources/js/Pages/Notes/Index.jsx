import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage } from "@inertiajs/react";

export default function Index() {
    const { notes } = usePage().props;
    const noteClick = (id) => {
        window.location.href = route("notes.edit", id);
    };
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    我的筆記
                </h2>
            }
        >
            <Head title="首頁" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900" id="notesList">
                            <div className="flex justify-end">
                                <Link
                                    href={route("notes.create")}
                                    className="relative top-0 right-0 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    新增筆記
                                </Link>
                            </div>
                            <div className="mt-4">
                                {notes &&
                                    notes.map((note) => (
                                        <div
                                            key={note.id}
                                            onClick={() =>
                                                noteClick(note.id)
                                            }
                                            className="mb-4 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-150"
                                        >
                                            <h3 className="text-xl font-bold">
                                                {note.title}
                                            </h3>
                                            <p className="mt-2">
                                                {note.content.length > 10
                                                    ? `${note.content.substring(
                                                          0,
                                                          10
                                                      )}...`
                                                    : note.content}
                                            </p>
                                            <div className="flex justify-end mt-2"></div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
