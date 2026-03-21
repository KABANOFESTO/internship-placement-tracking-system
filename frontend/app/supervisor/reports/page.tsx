"use client";

import { useMemo } from "react";
import { FileText, Download } from "lucide-react";
import { useGetReportsQuery } from "@/lib/redux/slices/ReportsSlice";
import { formatDistanceToNow } from "date-fns";

export default function SupervisorReportsPage() {
    const { data: reports, isLoading } = useGetReportsQuery();
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
                        <div className="space-y-3">
                            {normalizedReports.map((report) => (
                                <div key={report.id} className="rounded-xl border border-gray-200 p-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{report.type} report</p>
                                            <p className="text-xs text-gray-500">Student ID: {report.student}</p>
                                            <p className="text-xs text-gray-500">
                                                Submitted {formatDistanceToNow(new Date(report.submitted_at), { addSuffix: true })}
                                            </p>
                                            {report.feedback && <p className="mt-2 text-xs text-gray-600">{report.feedback}</p>}
                                        </div>
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
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
