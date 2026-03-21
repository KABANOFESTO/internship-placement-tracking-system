"use client";

import { useGetUsersByRoleQuery } from "@/lib/redux/slices/AuthSlice";

export default function CoordinatorStudentsPage() {
    const { data: students, isLoading } = useGetUsersByRoleQuery("Student");

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="p-6 lg:p-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Students</h1>
                    <p className="mt-1 text-sm text-gray-500">Manage registered students</p>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm">
                    {isLoading && <p className="text-sm text-gray-500">Loading students...</p>}
                    {!isLoading && (!students || students.length === 0) && (
                        <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">
                            No students found.
                        </div>
                    )}
                    {!isLoading && students && students.length > 0 && (
                        <div className="space-y-3">
                            {students.map((student: any) => (
                                <div key={student.id} className="rounded-xl border border-gray-200 p-4">
                                    <p className="text-sm font-medium text-gray-900">{student.username}</p>
                                    <p className="text-xs text-gray-500">{student.email}</p>
                                    <p className="text-xs text-gray-500">Status: {student.status}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
