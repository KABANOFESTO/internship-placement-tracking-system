"use client";

import { useState } from "react";
import { FileText, Upload } from "lucide-react";
import { useGetReportsQuery, useCreateReportMutation } from "@/lib/redux/slices/ReportsSlice";
import { formatDistanceToNow } from "date-fns";

export default function StudentReportsPage() {
    const { data: reports, isLoading } = useGetReportsQuery();
    const [createReport, { isLoading: isSubmitting }] = useCreateReportMutation();

    const [type, setType] = useState<"WEEKLY" | "FINAL">("WEEKLY");
    const [file, setFile] = useState<File | null>(null);

    const handleSubmit = async () => {
        if (!file) return;
        const formData = new FormData();
        formData.append("type", type);
        formData.append("file", file);
        await createReport(formData).unwrap();
        setFile(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="p-6 lg:p-8">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
                        <p className="mt-1 text-sm text-gray-500">Submit and track internship reports</p>
                    </div>
                    <FileText className="h-6 w-6 text-gray-400" />
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-1 rounded-2xl bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-900">Submit Report</h2>
                        <div className="mt-4 space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">Report Type</label>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value as "WEEKLY" | "FINAL")}
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                                >
                                    <option value="WEEKLY">Weekly</option>
                                    <option value="FINAL">Final</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Upload File</label>
                                <input
                                    type="file"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                                />
                            </div>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
                            >
                                <Upload className="mr-2 h-4 w-4" />
                                {isSubmitting ? "Submitting..." : "Submit Report"}
                            </button>
                        </div>
                    </div>

                    <div className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-900">Submitted Reports</h2>
                        {isLoading && <p className="mt-4 text-sm text-gray-500">Loading reports...</p>}
                        {!isLoading && (!reports || reports.length === 0) && (
                            <div className="mt-4 rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">
                                No reports submitted yet.
                            </div>
                        )}
                        {!isLoading && reports && reports.length > 0 && (
                            <div className="mt-4 space-y-3">
                                {reports.map((report) => (
                                    <div key={report.id} className="flex items-start justify-between rounded-xl border border-gray-200 p-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{report.type} report</p>
                                            <p className="mt-1 text-xs text-gray-500">
                                                Submitted {formatDistanceToNow(new Date(report.submitted_at), { addSuffix: true })}
                                            </p>
                                            {report.feedback && (
                                                <p className="mt-2 text-xs text-gray-600">Feedback: {report.feedback}</p>
                                            )}
                                        </div>
                                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700">{report.type}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
