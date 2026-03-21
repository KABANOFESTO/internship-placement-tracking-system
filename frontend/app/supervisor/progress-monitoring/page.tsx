"use client";

import { useGetProgressLogsQuery } from "@/lib/redux/slices/TrackingSlice";
import { format } from "date-fns";

export default function SupervisorProgressMonitoringPage() {
    const { data: logs, isLoading } = useGetProgressLogsQuery();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="p-6 lg:p-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Progress Monitoring</h1>
                    <p className="mt-1 text-sm text-gray-500">Review intern activity logs</p>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm">
                    {isLoading && <p className="text-sm text-gray-500">Loading logs...</p>}
                    {!isLoading && (!logs || logs.length === 0) && (
                        <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">
                            No progress logs submitted yet.
                        </div>
                    )}
                    {!isLoading && logs && logs.length > 0 && (
                        <div className="space-y-3">
                            {logs.map((log) => (
                                <div key={log.id} className="rounded-xl border border-gray-200 p-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{log.summary}</p>
                                            <p className="text-xs text-gray-500">Student ID: {log.student}</p>
                                            <p className="text-xs text-gray-500">Date: {format(new Date(log.date), "MMM dd, yyyy")}</p>
                                        </div>
                                        <span className={`rounded-full px-3 py-1 text-xs ${log.approved ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}>
                                            {log.approved ? "Approved" : "Pending"}
                                        </span>
                                    </div>
                                    <div className="mt-2 text-xs text-gray-500">Hours: {log.hours_completed}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
