"use client";

import { useState } from "react";

// --- Types ---
type Intern = {
    id: number;
    name: string;
    avatar: string;
    department: string;
    progress: number;
    status: "On Track" | "At Risk" | "Excellent";
    lastActive: string;
};

type Activity = {
    id: number;
    intern: string;
    action: string;
    time: string;
    type: "log" | "report" | "evaluation" | "attendance";
};

// --- Mock Data ---
const interns: Intern[] = [
    { id: 1, name: "Amara Nkosi", avatar: "AN", department: "Software Eng.", progress: 82, status: "Excellent", lastActive: "2h ago" },
    { id: 2, name: "Kwame Asante", avatar: "KA", department: "Data Science", progress: 58, status: "At Risk", lastActive: "1d ago" },
    { id: 3, name: "Fatima Al-Rashid", avatar: "FA", department: "UI/UX Design", progress: 74, status: "On Track", lastActive: "4h ago" },
    { id: 4, name: "Diego Morales", avatar: "DM", department: "Backend Dev.", progress: 91, status: "Excellent", lastActive: "30m ago" },
];

const activities: Activity[] = [
    { id: 1, intern: "Diego Morales", action: "Submitted weekly report", time: "30 min ago", type: "report" },
    { id: 2, intern: "Amara Nkosi", action: "Logged 8 hours of work", time: "2 hrs ago", type: "log" },
    { id: 3, intern: "Fatima Al-Rashid", action: "Completed mid-term evaluation", time: "Yesterday", type: "evaluation" },
    { id: 4, intern: "Kwame Asante", action: "Marked absent – Day 3", time: "Yesterday", type: "attendance" },
    { id: 5, intern: "Amara Nkosi", action: "Submitted final report draft", time: "2 days ago", type: "report" },
];

const statusConfig = {
    Excellent: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", bar: "bg-emerald-500" },
    "On Track": { bg: "bg-sky-50", text: "text-sky-700", dot: "bg-sky-500", bar: "bg-sky-500" },
    "At Risk": { bg: "bg-rose-50", text: "text-rose-600", dot: "bg-rose-400", bar: "bg-rose-400" },
};

const activityIcons: Record<Activity["type"], { icon: string; color: string; bg: string }> = {
    report: { icon: "📄", color: "text-violet-600", bg: "bg-violet-50" },
    log: { icon: "🕐", color: "text-sky-600", bg: "bg-sky-50" },
    evaluation: { icon: "✅", color: "text-emerald-600", bg: "bg-emerald-50" },
    attendance: { icon: "⚠️", color: "text-rose-600", bg: "bg-rose-50" },
};

// --- Stat Card ---
function StatCard({
    label,
    value,
    sub,
    icon,
    accent,
    trend,
}: {
    label: string;
    value: string | number;
    sub: string;
    icon: string;
    accent: string;
    trend?: { dir: "up" | "down"; val: string };
}) {
    return (
        <div className="relative bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group">
            {/* Decorative blob */}
            <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10 ${accent} group-hover:opacity-20 transition-opacity duration-300`} />
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">{label}</p>
                    <p className="text-3xl font-black text-slate-800 leading-none">{value}</p>
                    <p className="text-xs text-slate-400 mt-1">{sub}</p>
                </div>
                <span className={`text-2xl p-2.5 rounded-xl ${accent} bg-opacity-10`}>{icon}</span>
            </div>
            {trend && (
                <div className="mt-3 flex items-center gap-1">
                    <span className={trend.dir === "up" ? "text-emerald-500" : "text-rose-400"}>
                        {trend.dir === "up" ? "▲" : "▼"}
                    </span>
                    <span className="text-xs text-slate-500">{trend.val} this week</span>
                </div>
            )}
        </div>
    );
}

// --- Intern Row ---
function InternRow({ intern }: { intern: Intern }) {
    const cfg = statusConfig[intern.status];
    return (
        <div className="flex items-center gap-4 py-3 group hover:bg-slate-50 px-3 -mx-3 rounded-xl transition-colors duration-200 cursor-pointer">
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {intern.avatar}
            </div>
            {/* Info */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">{intern.name}</p>
                <p className="text-xs text-slate-400">{intern.department}</p>
            </div>
            {/* Progress bar */}
            <div className="hidden sm:flex flex-col items-end gap-1 w-28">
                <span className="text-xs text-slate-500 font-medium">{intern.progress}%</span>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full ${cfg.bar} transition-all duration-700`}
                        style={{ width: `${intern.progress}%` }}
                    />
                </div>
            </div>
            {/* Status */}
            <span className={`hidden md:inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                {intern.status}
            </span>
            {/* Last active */}
            <span className="text-xs text-slate-300 shrink-0">{intern.lastActive}</span>
        </div>
    );
}

// --- Main Dashboard ---
export default function SupervisorDashboard() {
    const [activeTab, setActiveTab] = useState<"all" | "at-risk">("all");

    const pending = { reports: 3, timesheets: 5, evaluations: 1 };
    const totalInterns = interns.length;
    const atRisk = interns.filter((i) => i.status === "At Risk").length;
    const avgProgress = Math.round(interns.reduce((a, b) => a + b.progress, 0) / totalInterns);

    const displayedInterns = activeTab === "at-risk" ? interns.filter((i) => i.status === "At Risk") : interns;

    return (
        <div className="min-h-screen bg-[#f7f8fc] font-[system-ui]">
            {/* Import Google Font via style tag */}
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;900&family=DM+Mono:wght@400;500&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        .mono { font-family: 'DM Mono', monospace; }
        .stat-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          animation: shimmer 2.5s infinite;
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .fade-in {
          animation: fadeIn 0.5s ease forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 fade-in">

                {/* ── Header ── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-1">Supervisor Portal</p>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                            Good morning, Dr. Uwimana 👋
                        </h1>
                        <p className="text-sm text-slate-400 mt-1">
                            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                        </p>
                    </div>
                    {/* Quick action */}
                    <button className="self-start sm:self-auto inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-indigo-200 transition-all duration-200">
                        <span>＋</span> Add Intern
                    </button>
                </div>

                {/* ── Pending Actions Banner ── */}
                <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-5 text-white shadow-lg shadow-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <p className="text-indigo-200 text-xs font-semibold uppercase tracking-wider mb-1">Action Required</p>
                        <p className="font-bold text-lg leading-tight">You have pending items to review</p>
                    </div>
                    <div className="flex gap-3 flex-wrap">
                        {[
                            { label: "Reports", count: pending.reports, emoji: "📄" },
                            { label: "Timesheets", count: pending.timesheets, emoji: "🗓️" },
                            { label: "Evaluations", count: pending.evaluations, emoji: "📋" },
                        ].map((item) => (
                            <button
                                key={item.label}
                                className="flex items-center gap-2 bg-white/15 hover:bg-white/25 active:scale-95 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                            >
                                <span>{item.emoji}</span>
                                <span className="bg-white text-indigo-700 text-xs font-black px-1.5 py-0.5 rounded-md mono">
                                    {item.count}
                                </span>
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Stats Grid ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        label="Total Interns"
                        value={totalInterns}
                        sub="Active this cycle"
                        icon="🎓"
                        accent="bg-indigo-500"
                        trend={{ dir: "up", val: "+1" }}
                    />
                    <StatCard
                        label="Avg. Progress"
                        value={`${avgProgress}%`}
                        sub="Across all interns"
                        icon="📈"
                        accent="bg-emerald-500"
                        trend={{ dir: "up", val: "+4%" }}
                    />
                    <StatCard
                        label="At Risk"
                        value={atRisk}
                        sub="Need attention"
                        icon="⚠️"
                        accent="bg-rose-500"
                    />
                    <StatCard
                        label="Reports Due"
                        value={pending.reports}
                        sub="Awaiting your review"
                        icon="📝"
                        accent="bg-amber-500"
                    />
                </div>

                {/* ── Main Two-Column ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Intern List */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="font-bold text-slate-800 text-base">Assigned Interns</h2>
                            <div className="flex gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
                                {(["all", "at-risk"] as const).map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-3 py-1.5 rounded-md transition-all duration-200 capitalize ${activeTab === tab
                                                ? "bg-white text-indigo-600 shadow-sm"
                                                : "text-slate-400 hover:text-slate-600"
                                            }`}
                                    >
                                        {tab === "at-risk" ? "⚠️ At Risk" : "All"}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {displayedInterns.map((intern) => (
                                <InternRow key={intern.id} intern={intern} />
                            ))}
                        </div>
                        <button className="mt-4 w-full text-center text-xs font-semibold text-indigo-500 hover:text-indigo-700 transition-colors py-2 border border-dashed border-slate-200 rounded-xl hover:border-indigo-300">
                            View All Interns →
                        </button>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                        <h2 className="font-bold text-slate-800 text-base mb-5">Recent Activity</h2>
                        <div className="space-y-3">
                            {activities.map((act) => {
                                const cfg = activityIcons[act.type];
                                return (
                                    <div key={act.id} className="flex gap-3 group cursor-pointer">
                                        <div className={`w-8 h-8 rounded-xl ${cfg.bg} flex items-center justify-center text-sm shrink-0 mt-0.5`}>
                                            {cfg.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-semibold text-slate-700 leading-snug">
                                                <span className="text-indigo-600">{act.intern}</span>
                                            </p>
                                            <p className="text-xs text-slate-400 truncate">{act.action}</p>
                                            <p className="text-[10px] text-slate-300 mt-0.5 mono">{act.time}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <button className="mt-4 w-full text-center text-xs font-semibold text-indigo-500 hover:text-indigo-700 transition-colors py-2 border border-dashed border-slate-200 rounded-xl hover:border-indigo-300">
                            See all activity →
                        </button>
                    </div>
                </div>

                {/* ── Quick Access Cards ── */}
                <div>
                    <h2 className="font-bold text-slate-700 text-sm uppercase tracking-wider mb-4">Quick Access</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                        {[
                            { label: "Mid-Term Eval", icon: "📋", color: "hover:border-violet-300 hover:bg-violet-50 group-hover:text-violet-600" },
                            { label: "Final Eval", icon: "🏁", color: "hover:border-emerald-300 hover:bg-emerald-50 group-hover:text-emerald-600" },
                            { label: "Student Logs", icon: "📓", color: "hover:border-sky-300 hover:bg-sky-50 group-hover:text-sky-600" },
                            { label: "Timesheets", icon: "🗓️", color: "hover:border-amber-300 hover:bg-amber-50 group-hover:text-amber-600" },
                            { label: "Attendance", icon: "✅", color: "hover:border-rose-300 hover:bg-rose-50 group-hover:text-rose-600" },
                        ].map((item) => (
                            <button
                                key={item.label}
                                className={`group flex flex-col items-center gap-2 p-4 bg-white border border-slate-100 rounded-2xl text-center transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md ${item.color}`}
                            >
                                <span className="text-2xl">{item.icon}</span>
                                <span className="text-xs font-semibold text-slate-500 group-hover:text-slate-700 transition-colors leading-tight">
                                    {item.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Footer note ── */}
                <p className="text-center text-[11px] text-slate-300 pb-2 mono">
                    Internship Supervision System · Academic Year 2025–2026
                </p>
            </div>
        </div>
    );
}