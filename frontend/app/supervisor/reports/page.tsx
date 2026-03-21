"use client";

import { useMemo, useState } from "react";
import { FileText, Download, MessageSquare } from "lucide-react";
import { useGetReportsQuery, useSetReportFeedbackMutation } from "@/lib/redux/slices/ReportsSlice";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

export default function SupervisorReportsPage() {
    const { data: reports, isLoading } = useGetReportsQuery();
    const [setFeedback, { isLoading: isSaving }] = useSetReportFeedbackMutation();
    const [feedbackMap, setFeedbackMap] = useState<Record<number, string>>({});
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "";

    const normalizedReports = useMemo(() => {
        if (!reports) return [];
        return reports.map((report) => ({
            ...report,
            fileUrl: report.file
                ? report.file.startsWith("http")
                    ? report.file
                    : `${apiBase}${report.file.startsWith("/") ? "" : "/"}${report.file}`
                : null,
        }));
    }, [reports, apiBase]);

    const handleSaveFeedback = async (id: number) => {
        const feedback = feedbackMap[id] || "";
        if (!feedback.trim()) {
            toast.error("Feedback cannot be empty.");
            return;
        }
        try {
            await setFeedback({ id, feedback }).unwrap();
            toast.success("Feedback saved.");
        } catch {
            toast.error("Failed to save feedback.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="p-6 lg:p-8">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
                        <p className="mt-1 text-sm text-gray-500">Review reports submitted by interns</p>
                    </div>
                    <FileText className="h-6 w-6 text-gray-400" />
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm">
                    {isLoading && <p className="text-sm text-gray-500">Loading reports...</p>}
                    {!isLoading && normalizedReports.length === 0 && (
                        <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">
                            No reports submitted yet.
                        </div>
                    )}
                    {!isLoading && normalizedReports.length > 0 && (
                        <div className="space-y-4">
                            {normalizedReports.map((report) => (
                                <div key={report.id} className="rounded-xl border border-gray-200 p-4">
                                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{report.type} report</p>
                                            <p className="text-xs text-gray-500">
                                                Student: {report.student_details?.user?.username || `ID ${report.student}`}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Submitted {formatDistanceToNow(new Date(report.submitted_at), { addSuffix: true })}
                                            </p>
                                            {report.feedback && <p className="mt-2 text-xs text-gray-600">Current feedback: {report.feedback}</p>}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {report.fileUrl && (
                                                <a
                                                    href={report.fileUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center rounded-md border border-gray-200 px-3 py-1 text-xs text-gray-700 hover:bg-gray-50"
                                                >
                                                    <Download className="mr-1 h-3 w-3" />
                                                    Download
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-4 rounded-lg bg-gray-50 p-3">
                                        <label className="mb-1 flex items-center gap-2 text-xs font-medium text-gray-600">
                                            <MessageSquare className="h-3 w-3" />
                                            Supervisor Feedback
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={feedbackMap[report.id] ?? report.feedback ?? ""}
                                            onChange={(e) => setFeedbackMap((prev) => ({ ...prev, [report.id]: e.target.value }))}
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                            placeholder="Add feedback for the intern"
                                        />
                                        <div className="mt-2 flex justify-end">
                                            <button
                                                onClick={() => handleSaveFeedback(report.id)}
                                                disabled={isSaving}
                                                className="rounded-md bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700 disabled:opacity-60"
                                            >
                                                Save Feedback
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
