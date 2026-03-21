"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Briefcase, ClipboardCheck, FileText, TrendingUp, CalendarCheck } from "lucide-react";
import { useGetPlacementsQuery } from "@/lib/redux/slices/InternshipsSlice";
import { useGetProgressLogsQuery } from "@/lib/redux/slices/TrackingSlice";
import { useGetEvaluationsQuery } from "@/lib/redux/slices/EvaluationsSlice";
import { useGetReportsQuery } from "@/lib/redux/slices/ReportsSlice";
import { useGetAttendanceStatisticsQuery } from "@/lib/redux/slices/AttendanceSlice";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function SupervisorDashboard() {
    const { data: placements } = useGetPlacementsQuery();
    const { data: progressLogs } = useGetProgressLogsQuery();
    const { data: evaluations } = useGetEvaluationsQuery();
    const { data: reports } = useGetReportsQuery();
    const { data: attendanceStats } = useGetAttendanceStatisticsQuery();

    const totalInterns = placements ? placements.length : 0;
    const totalLogs = progressLogs ? progressLogs.length : 0;
    const totalEvaluations = evaluations ? evaluations.length : 0;
    const totalReports = reports ? reports.length : 0;

    const recentLogs = useMemo(() => {
        if (!progressLogs) return [];
        return progressLogs.slice(0, 5);
    }, [progressLogs]);

    const attendanceChartData = useMemo(() => {
        if (!attendanceStats?.by_status) return [];
        return attendanceStats.by_status.map((item) => ({ name: item.status, value: item.count }));
    }, [attendanceStats]);

    const attendanceColors = ["#22c55e", "#ef4444", "#f59e0b", "#6366f1"];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="p-6 lg:p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Supervisor Dashboard</h1>
                    <p className="mt-1 text-sm text-gray-500">Track intern progress and review submissions</p>
                </div>

                <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
                    {[
                        { label: "Assigned Interns", value: totalInterns, icon: Briefcase, color: "text-blue-600", bg: "bg-blue-50" },
                        { label: "Progress Logs", value: totalLogs, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
                        { label: "Evaluations", value: totalEvaluations, icon: ClipboardCheck, color: "text-yellow-600", bg: "bg-yellow-50" },
                        { label: "Reports", value: totalReports, icon: FileText, color: "text-purple-600", bg: "bg-purple-50" },
                        { label: "Attendance", value: attendanceStats?.total ?? 0, icon: CalendarCheck, color: "text-indigo-600", bg: "bg-indigo-50" },
                    ].map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div key={stat.label} className="rounded-2xl bg-white p-6 shadow-sm">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">{stat.label}</p>
                                        <p className="mt-2 text-2xl font-semibold text-gray-900">{stat.value}</p>
                                    </div>
                                    <div className={`rounded-xl ${stat.bg} p-3`}>
                                        <Icon className={`h-6 w-6 ${stat.color}`} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">Assigned Interns</h2>
                            <Link href="/supervisor/assigned-interns" className="text-sm text-blue-600 hover:text-blue-700">
                                View all
                            </Link>
                        </div>
                        {placements && placements.length > 0 ? (
                            <div className="space-y-3">
                                {placements.slice(0, 5).map((placement) => (
                                    <div key={placement.id} className="rounded-xl border border-gray-200 p-3">
                                        <p className="text-sm font-medium text-gray-900">
                                            {placement.student_details?.user?.username || `Placement #${placement.id}`}
                                        </p>
                                        <p className="text-xs text-gray-500">Program: {placement.student_details?.program || "N/A"}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">
                                No assigned interns yet.
                            </div>
                        )}
                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">Recent Progress Logs</h2>
                            <Link href="/supervisor/progress-monitoring" className="text-sm text-blue-600 hover:text-blue-700">
                                Review logs
                            </Link>
                        </div>
                        {recentLogs.length > 0 ? (
                            <div className="space-y-3">
                                {recentLogs.map((log) => (
                                    <div key={log.id} className="rounded-xl border border-gray-200 p-3">
                                        <p className="text-sm font-medium text-gray-900">{log.summary}</p>
                                        <p className="text-xs text-gray-500">
                                            Student: {log.student_details?.user?.username || `ID ${log.student}`}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">
                                No logs submitted yet.
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">Attendance Overview</h2>
                            <CalendarCheck className="h-5 w-5 text-gray-400" />
                        </div>
                        {attendanceChartData.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">
                                No attendance data yet.
                            </div>
                        ) : (
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={attendanceChartData} dataKey="value" innerRadius={50} outerRadius={80}>
                                            {attendanceChartData.map((entry, index) => (
                                                <Cell key={entry.name} fill={attendanceColors[index % attendanceColors.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                        <div className="mt-4 space-y-1 text-xs text-gray-500">
                            {attendanceChartData.map((item, index) => (
                                <div key={item.name} className="flex items-center justify-between">
                                    <span className="flex items-center gap-2">
                                        <span
                                            className="inline-block h-2 w-2 rounded-full"
                                            style={{ backgroundColor: attendanceColors[index % attendanceColors.length] }}
                                        />
                                        {item.name}
                                    </span>
                                    <span>{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
