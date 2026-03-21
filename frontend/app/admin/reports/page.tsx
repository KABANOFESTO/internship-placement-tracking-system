"use client";

import { useMemo, useState } from "react";
import { Download, FileText, Star } from "lucide-react";
import { useGetReportsQuery, useSetReportFeedbackMutation } from "@/lib/redux/slices/ReportsSlice";
import { useGetEvaluationsQuery } from "@/lib/redux/slices/EvaluationsSlice";
import { toast } from "sonner";

export default function AdminReportsPage() {
    const { data: reports, isLoading: isReportsLoading } = useGetReportsQuery();
    const { data: evaluations, isLoading: isEvaluationsLoading } = useGetEvaluationsQuery();
    const [setReportFeedback] = useSetReportFeedbackMutation();

    const [feedbackMap, setFeedbackMap] = useState<Record<number, string>>({});

    const apiBase = process.env.NEXT_PUBLIC_API_URL || "";

    const normalizedReports = useMemo(() => {
        if (!reports) return [];
        return reports.map((report) => ({
            ...report,
            fileUrl: report.file.startsWith("http")
                ? report.file
                : `${apiBase}${report.file.startsWith("/") ? "" : "/"}${report.file}`,
        }));
    }, [reports, apiBase]);

    const handleFeedback = async (id: number) => {
        const feedback = feedbackMap[id];
        if (!feedback?.trim()) {
            toast.error("Feedback is required.");
            return;
        }
        try {
            await setReportFeedback({ id, feedback }).unwrap();
            toast.success("Feedback saved.");
            setFeedbackMap((prev) => ({ ...prev, [id]: "" }));
        } catch {
            toast.error("Failed to save feedback.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="p-6 lg:p-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Reports & Evaluations</h1>
                    <p className="mt-1 text-sm text-gray-500">Monitor student reports and supervisor evaluations</p>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-900">Reports</h2>
                        {isReportsLoading && <p className="mt-4 text-sm text-gray-500">Loading reports...</p>}
                        {!isReportsLoading && normalizedReports.length === 0 && (
                            <div className="mt-4 rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">
                                No reports yet.
                            </div>
                        )}
                        {!isReportsLoading && normalizedReports.length > 0 && (
                            <div className="mt-4 space-y-3">
                                {normalizedReports.map((report) => (
                                    <div key={report.id} className="rounded-xl border border-gray-200 p-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {report.student_details?.user?.username || `Student ${report.student}`}
                                                </p>
                                                <p className="text-xs text-gray-500">Type: {report.type}</p>
                                                <p className="text-xs text-gray-500">Submitted: {new Date(report.submitted_at).toLocaleDateString()}</p>
                                            </div>
                                            <a
                                                href={report.fileUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
                                            >
                                                <Download className="mr-1 h-3 w-3" />
                                                Download
                                            </a>
                                        </div>
                                        <div className="mt-3">
                                            <label className="text-xs text-gray-500">Feedback</label>
                                            <textarea
                                                value={feedbackMap[report.id] ?? report.feedback ?? ""}
                                                onChange={(e) => setFeedbackMap((prev) => ({ ...prev, [report.id]: e.target.value }))}
                                                rows={2}
                                                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-xs"
                                            />
                                            <button
                                                onClick={() => handleFeedback(report.id)}
                                                className="mt-2 inline-flex items-center rounded-md bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700"
                                            >
                                                Save Feedback
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-900">Evaluations</h2>
                        {isEvaluationsLoading && <p className="mt-4 text-sm text-gray-500">Loading evaluations...</p>}
                        {!isEvaluationsLoading && (!evaluations || evaluations.length === 0) && (
                            <div className="mt-4 rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">
                                No evaluations yet.
                            </div>
                        )}
                        {!isEvaluationsLoading && evaluations && evaluations.length > 0 && (
                            <div className="mt-4 space-y-3">
                                {evaluations.map((evaluation) => (
                                    <div key={evaluation.id} className="rounded-xl border border-gray-200 p-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {evaluation.student_details?.user?.username || `Student ${evaluation.student}`}
                                                </p>
                                                <p className="text-xs text-gray-500">Type: {evaluation.evaluation_type}</p>
                                                <p className="text-xs text-gray-500">Score: {evaluation.score}</p>
                                            </div>
                                            <div className="inline-flex items-center text-xs text-amber-600">
                                                <Star className="mr-1 h-3 w-3" />
                                                {evaluation.score}
                                            </div>
                                        </div>
                                        {evaluation.feedback && (
                                            <p className="mt-2 text-xs text-gray-500">{evaluation.feedback}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FileText className="h-4 w-4" />
                        Keep feedback concise and actionable for students and supervisors.
                    </div>
                </div>
            </div>
        </div>
    );
}
