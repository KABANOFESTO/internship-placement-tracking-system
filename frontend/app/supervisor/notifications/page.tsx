"use client";

import { useState, useMemo } from "react";

// ─── Types ─────────────────────────────────────────────────────────────────────
type NotifCategory =
    | "report"
    | "evaluation"
    | "attendance"
    | "timesheet"
    | "message"
    | "system"
    | "deadline"
    | "progress";

type NotifPriority = "urgent" | "high" | "normal" | "low";

interface Notification {
    id: number;
    category: NotifCategory;
    priority: NotifPriority;
    title: string;
    body: string;
    time: string;
    timeRaw: number; // minutes ago for sorting
    read: boolean;
    internName?: string;
    internInitials?: string;
    internGradientFrom?: string;
    internGradientTo?: string;
    actionLabel?: string;
    actionRoute?: string;
    pinned?: boolean;
}

// ─── Mock Notifications ────────────────────────────────────────────────────────
const INITIAL_NOTIFICATIONS: Notification[] = [
    {
        id: 1,
        category: "report",
        priority: "high",
        title: "New Report Submitted",
        body: "Amara Nkosi submitted her Week 10 Progress Report and it is pending your review.",
        time: "5 min ago",
        timeRaw: 5,
        read: false,
        internName: "Amara Nkosi",
        internInitials: "AN",
        internGradientFrom: "#6366f1",
        internGradientTo: "#8b5cf6",
        actionLabel: "Review Report",
        actionRoute: "/supervisor/reports-review",
        pinned: true,
    },
    {
        id: 2,
        category: "deadline",
        priority: "urgent",
        title: "Evaluation Deadline Tomorrow",
        body: "Diego Morales' Final Evaluation is due tomorrow (Mar 28). Submit before the deadline to avoid a late submission.",
        time: "18 min ago",
        timeRaw: 18,
        read: false,
        internName: "Diego Morales",
        internInitials: "DM",
        internGradientFrom: "#10b981",
        internGradientTo: "#059669",
        actionLabel: "Start Evaluation",
        actionRoute: "/supervisor/evaluations",
        pinned: true,
    },
    {
        id: 3,
        category: "attendance",
        priority: "urgent",
        title: "Attendance Alert — 3rd Absence",
        body: "Kwame Asante has been marked absent for 3 consecutive days. Immediate follow-up is recommended.",
        time: "42 min ago",
        timeRaw: 42,
        read: false,
        internName: "Kwame Asante",
        internInitials: "KA",
        internGradientFrom: "#f43f5e",
        internGradientTo: "#fb923c",
        actionLabel: "View Attendance",
        actionRoute: "/supervisor/attendance",
    },
    {
        id: 4,
        category: "timesheet",
        priority: "high",
        title: "Timesheet Awaiting Approval",
        body: "Fatima Al-Rashid submitted her Week 10 timesheet (38 hours). Please review and approve or flag discrepancies.",
        time: "1 hr ago",
        timeRaw: 60,
        read: false,
        internName: "Fatima Al-Rashid",
        internInitials: "FA",
        internGradientFrom: "#0ea5e9",
        internGradientTo: "#06b6d4",
        actionLabel: "Review Timesheet",
        actionRoute: "/supervisor/progress-monitoring",
    },
    {
        id: 5,
        category: "evaluation",
        priority: "high",
        title: "Mid-Term Evaluation Overdue",
        body: "The Mid-Term Evaluation for Kwame Asante was due on Feb 28. This is now 21 days overdue. Please complete it immediately.",
        time: "2 hrs ago",
        timeRaw: 120,
        read: false,
        internName: "Kwame Asante",
        internInitials: "KA",
        internGradientFrom: "#f43f5e",
        internGradientTo: "#fb923c",
        actionLabel: "Complete Now",
        actionRoute: "/supervisor/evaluations",
    },
    {
        id: 6,
        category: "report",
        priority: "high",
        title: "Report Resubmitted",
        body: "Diego Morales resubmitted his Final Internship Report (Draft) — Version 2. Changes have been made based on your previous feedback.",
        time: "3 hrs ago",
        timeRaw: 180,
        read: false,
        internName: "Diego Morales",
        internInitials: "DM",
        internGradientFrom: "#10b981",
        internGradientTo: "#059669",
        actionLabel: "Review Changes",
        actionRoute: "/supervisor/reports-review",
    },
    {
        id: 7,
        category: "message",
        priority: "normal",
        title: "New Message from Intern",
        body: "Nadine Uwase sent you a message: 'Dr. Uwimana, I have a question about the FHIR integration task deadline.'",
        time: "4 hrs ago",
        timeRaw: 240,
        read: true,
        internName: "Nadine Uwase",
        internInitials: "NU",
        internGradientFrom: "#f59e0b",
        internGradientTo: "#d97706",
        actionLabel: "Reply",
        actionRoute: "/supervisor/messages",
    },
    {
        id: 8,
        category: "timesheet",
        priority: "normal",
        title: "Timesheet Awaiting Approval",
        body: "Nadine Uwase submitted her Week 10 timesheet (34 hours). It is currently under review.",
        time: "5 hrs ago",
        timeRaw: 300,
        read: true,
        internName: "Nadine Uwase",
        internInitials: "NU",
        internGradientFrom: "#f59e0b",
        internGradientTo: "#d97706",
        actionLabel: "Review Timesheet",
        actionRoute: "/supervisor/progress-monitoring",
    },
    {
        id: 9,
        category: "progress",
        priority: "normal",
        title: "Intern Progress Update",
        body: "Amara Nkosi has reached 82% of her internship hours target (246/300 hours). Excellent progress this month.",
        time: "Yesterday",
        timeRaw: 1440,
        read: true,
        internName: "Amara Nkosi",
        internInitials: "AN",
        internGradientFrom: "#6366f1",
        internGradientTo: "#8b5cf6",
        actionLabel: "View Progress",
        actionRoute: "/supervisor/assigned-interns",
    },
    {
        id: 10,
        category: "system",
        priority: "normal",
        title: "System Reminder — Reports Due",
        body: "3 weekly reports are due this Friday (Mar 21). Ensure your interns submit their reports on time.",
        time: "Yesterday",
        timeRaw: 1500,
        read: true,
        actionLabel: "View Reports",
        actionRoute: "/supervisor/reports-review",
    },
    {
        id: 11,
        category: "evaluation",
        priority: "normal",
        title: "Evaluation Submitted Successfully",
        body: "Your Mid-Term Evaluation for Amara Nkosi (Score: 88/100) was successfully submitted on Mar 16. The intern has been notified.",
        time: "5 days ago",
        timeRaw: 7200,
        read: true,
        internName: "Amara Nkosi",
        internInitials: "AN",
        internGradientFrom: "#6366f1",
        internGradientTo: "#8b5cf6",
    },
    {
        id: 12,
        category: "report",
        priority: "low",
        title: "Feedback Acknowledged",
        body: "Fatima Al-Rashid has acknowledged your feedback on the February Monthly Report and committed to improvements.",
        time: "5 days ago",
        timeRaw: 7300,
        read: true,
        internName: "Fatima Al-Rashid",
        internInitials: "FA",
        internGradientFrom: "#0ea5e9",
        internGradientTo: "#06b6d4",
    },
    {
        id: 13,
        category: "system",
        priority: "low",
        title: "Profile Updated",
        body: "Your supervisor profile was successfully updated. Your department information and office hours are now visible to your assigned interns.",
        time: "1 week ago",
        timeRaw: 10080,
        read: true,
    },
    {
        id: 14,
        category: "progress",
        priority: "low",
        title: "Internship Milestone Reached",
        body: "Diego Morales has completed 91% of required internship hours (273/300). He is on track for an early completion.",
        time: "1 week ago",
        timeRaw: 10200,
        read: true,
        internName: "Diego Morales",
        internInitials: "DM",
        internGradientFrom: "#10b981",
        internGradientTo: "#059669",
        actionLabel: "View Details",
        actionRoute: "/supervisor/assigned-interns",
    },
];

// ─── Config ────────────────────────────────────────────────────────────────────
const CATEGORY_CFG: Record<NotifCategory, { label: string; icon: string; bg: string; text: string; border: string; accentBg: string }> = {
    report: { label: "Reports", icon: "📄", bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-200", accentBg: "bg-indigo-500" },
    evaluation: { label: "Evaluations", icon: "📋", bg: "bg-violet-50", text: "text-violet-600", border: "border-violet-200", accentBg: "bg-violet-500" },
    attendance: { label: "Attendance", icon: "📅", bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-200", accentBg: "bg-rose-500" },
    timesheet: { label: "Timesheets", icon: "🗓️", bg: "bg-sky-50", text: "text-sky-600", border: "border-sky-200", accentBg: "bg-sky-500" },
    message: { label: "Messages", icon: "💬", bg: "bg-teal-50", text: "text-teal-600", border: "border-teal-200", accentBg: "bg-teal-500" },
    system: { label: "System", icon: "⚙️", bg: "bg-slate-100", text: "text-slate-500", border: "border-slate-200", accentBg: "bg-slate-400" },
    deadline: { label: "Deadlines", icon: "⏰", bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-200", accentBg: "bg-orange-500" },
    progress: { label: "Progress", icon: "📈", bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200", accentBg: "bg-emerald-500" },
};

const PRIORITY_CFG: Record<NotifPriority, { label: string; dot: string; bar: string; ring: string }> = {
    urgent: { label: "Urgent", dot: "bg-rose-500", bar: "bg-rose-500", ring: "ring-rose-200" },
    high: { label: "High", dot: "bg-orange-400", bar: "bg-orange-400", ring: "ring-orange-200" },
    normal: { label: "Normal", dot: "bg-sky-400", bar: "bg-sky-400", ring: "ring-sky-200" },
    low: { label: "Low", dot: "bg-slate-300", bar: "bg-slate-300", ring: "ring-slate-100" },
};

type FilterType = "all" | "unread" | NotifCategory;

// ─── Notification Item ─────────────────────────────────────────────────────────
function NotifItem({
    notif,
    onRead,
    onDelete,
    onPin,
}: {
    notif: Notification;
    onRead: (id: number) => void;
    onDelete: (id: number) => void;
    onPin: (id: number) => void;
}) {
    const [hovering, setHovering] = useState(false);
    const catCfg = CATEGORY_CFG[notif.category];
    const priCfg = PRIORITY_CFG[notif.priority];
    const isUrgent = notif.priority === "urgent";
    const isHigh = notif.priority === "high";

    return (
        <div
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            className={`relative group rounded-2xl border-2 transition-all duration-200 overflow-hidden
        ${!notif.read ? "bg-white shadow-sm" : "bg-white/60"}
        ${notif.pinned ? "border-orange-300 shadow-md shadow-orange-100" :
                    isUrgent ? "border-rose-200 shadow-sm shadow-rose-100" :
                        isHigh && !notif.read ? "border-orange-100" :
                            !notif.read ? "border-indigo-100" : "border-slate-100"}
        hover:shadow-md hover:border-slate-200
      `}
        >
            {/* Unread left bar */}
            {!notif.read && (
                <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${priCfg.bar}`} />
            )}

            {/* Pin ribbon */}
            {notif.pinned && (
                <div className="absolute top-0 right-0 w-0 h-0 border-l-[28px] border-b-[28px] border-l-transparent border-b-orange-400 rounded-tr-2xl">
                    <span className="absolute -top-0.5 right-0.5 text-white text-[8px] font-black rotate-45">📌</span>
                </div>
            )}

            <div className="flex gap-3.5 p-4 pl-5">
                {/* Icon / Avatar */}
                <div className="shrink-0 mt-0.5">
                    {notif.internInitials ? (
                        <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-black shadow-sm ${!notif.read ? `ring-2 ${priCfg.ring}` : ""}`}
                            style={{ background: `linear-gradient(135deg, ${notif.internGradientFrom}, ${notif.internGradientTo})` }}
                        >
                            {notif.internInitials}
                        </div>
                    ) : (
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${catCfg.bg} ${!notif.read ? `ring-2 ${priCfg.ring}` : ""}`}>
                            {catCfg.icon}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
                            <p className={`text-sm leading-snug ${!notif.read ? "font-black text-slate-900" : "font-semibold text-slate-600"}`}>
                                {notif.title}
                            </p>
                            {!notif.read && (
                                <span className={`w-2 h-2 rounded-full shrink-0 ${priCfg.dot} ${isUrgent ? "animate-pulse" : ""}`} />
                            )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            {/* Priority badge — only urgent/high */}
                            {(isUrgent || isHigh) && !notif.read && (
                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${isUrgent ? "bg-rose-100 text-rose-600" : "bg-orange-100 text-orange-600"}`}>
                                    {priCfg.label}
                                </span>
                            )}
                            <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">{notif.time}</span>
                        </div>
                    </div>

                    {/* Category + intern */}
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${catCfg.bg} ${catCfg.text} ${catCfg.border}`}>
                            {catCfg.icon} {catCfg.label}
                        </span>
                        {notif.internName && (
                            <span className="text-[10px] text-slate-400 font-medium">· {notif.internName}</span>
                        )}
                    </div>

                    <p className={`text-xs mt-1.5 leading-relaxed ${!notif.read ? "text-slate-600" : "text-slate-400"}`}>
                        {notif.body}
                    </p>

                    {/* Actions row */}
                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                        {notif.actionLabel && (
                            <button className={`px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all duration-150 active:scale-95 shadow-sm hover:opacity-90`}
                                style={{ background: notif.internGradientFrom ? `linear-gradient(135deg, ${notif.internGradientFrom}, ${notif.internGradientTo})` : `linear-gradient(135deg, #6366f1, #8b5cf6)` }}>
                                {notif.actionLabel} →
                            </button>
                        )}
                        {!notif.read && (
                            <button onClick={() => onRead(notif.id)}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">
                                Mark read
                            </button>
                        )}
                    </div>
                </div>

                {/* Hover controls */}
                <div className={`shrink-0 flex flex-col gap-1.5 transition-opacity duration-200 ${hovering ? "opacity-100" : "opacity-0"}`}>
                    <button onClick={() => onPin(notif.id)} title={notif.pinned ? "Unpin" : "Pin"}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-colors ${notif.pinned ? "bg-orange-100 text-orange-500" : "bg-slate-100 text-slate-400 hover:bg-orange-50 hover:text-orange-500"}`}>
                        📌
                    </button>
                    <button onClick={() => onDelete(notif.id)} title="Dismiss"
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 bg-slate-100 transition-colors text-xs font-black">
                        ✕
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Empty State ───────────────────────────────────────────────────────────────
function EmptyState({ filter }: { filter: FilterType }) {
    const messages: Record<string, { icon: string; title: string; sub: string }> = {
        unread: { icon: "🎉", title: "All caught up!", sub: "You have no unread notifications." },
        default: { icon: "🔔", title: "No notifications", sub: "Nothing here matching your current filter." },
    };
    const msg = messages[filter === "unread" ? "unread" : "default"];
    return (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <span className="text-5xl mb-4">{msg.icon}</span>
            <p className="text-base font-black text-slate-600">{msg.title}</p>
            <p className="text-sm mt-1">{msg.sub}</p>
        </div>
    );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
    const [activeFilter, setActiveFilter] = useState<FilterType>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [showSettings, setShowSettings] = useState(false);
    const [settings, setSettings] = useState({
        emailNotifs: true,
        smsNotifs: false,
        deadlineReminders: true,
        reportAlerts: true,
        attendanceAlerts: true,
        evaluationReminders: true,
        progressUpdates: false,
        systemMessages: true,
    });

    // Derived
    const unreadCount = notifications.filter(n => !n.read).length;
    const urgentCount = notifications.filter(n => n.priority === "urgent" && !n.read).length;

    const filtered = useMemo(() => {
        let list = [...notifications].sort((a, b) => {
            if (a.pinned && !b.pinned) return -1;
            if (!a.pinned && b.pinned) return 1;
            if (!a.read && b.read) return -1;
            if (a.read && !b.read) return 1;
            return a.timeRaw - b.timeRaw;
        });
        if (activeFilter === "unread") list = list.filter(n => !n.read);
        else if (activeFilter !== "all") list = list.filter(n => n.category === activeFilter);
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter(n => n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q) || n.internName?.toLowerCase().includes(q));
        }
        return list;
    }, [notifications, activeFilter, searchQuery]);

    // Counts per category
    const catCounts = useMemo(() => {
        const counts: Partial<Record<NotifCategory, number>> = {};
        notifications.filter(n => !n.read).forEach(n => {
            counts[n.category] = (counts[n.category] || 0) + 1;
        });
        return counts;
    }, [notifications]);

    // Actions
    const markRead = (id: number) => setNotifications(p => p.map(n => n.id === id ? { ...n, read: true } : n));
    const markAllRead = () => setNotifications(p => p.map(n => ({ ...n, read: true })));
    const deleteNotif = (id: number) => setNotifications(p => p.filter(n => n.id !== id));
    const clearAll = () => setNotifications(p => p.filter(n => n.pinned));
    const togglePin = (id: number) => setNotifications(p => p.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n));

    const filterOptions: { key: FilterType; label: string; icon: string }[] = [
        { key: "all", label: "All", icon: "🔔" },
        { key: "unread", label: "Unread", icon: "✉️" },
        { key: "report", label: "Reports", icon: "📄" },
        { key: "evaluation", label: "Evaluations", icon: "📋" },
        { key: "deadline", label: "Deadlines", icon: "⏰" },
        { key: "attendance", label: "Attendance", icon: "📅" },
        { key: "timesheet", label: "Timesheets", icon: "🗓️" },
        { key: "message", label: "Messages", icon: "💬" },
        { key: "progress", label: "Progress", icon: "📈" },
        { key: "system", label: "System", icon: "⚙️" },
    ];

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap');
        * { font-family: 'Sora', sans-serif; }
        .page-enter { animation: pageEnter 0.4s ease forwards; }
        @keyframes pageEnter { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .notif-slide { animation: notifSlide 0.3s ease forwards; }
        @keyframes notifSlide { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
        .fade-in { animation: fadeIn 0.25s ease forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

            <div className="min-h-screen bg-[#f7f8fc] p-4 sm:p-6 page-enter">

                {/* ── Header ── */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-1">Supervisor · Notification Center</p>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-black text-slate-900">Notifications</h1>
                            {unreadCount > 0 && (
                                <span className="flex items-center gap-1.5 bg-indigo-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-md shadow-indigo-200">
                                    {urgentCount > 0 && <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />}
                                    {unreadCount} new
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-slate-400 mt-1">{notifications.length} total · {unreadCount} unread</p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {unreadCount > 0 && (
                            <button onClick={markAllRead}
                                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors">
                                ✓ Mark all read
                            </button>
                        )}
                        <button onClick={clearAll}
                            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">
                            🗑 Clear read
                        </button>
                        <button onClick={() => setShowSettings(!showSettings)}
                            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold border transition-colors ${showSettings ? "bg-indigo-600 text-white border-transparent" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"}`}>
                            ⚙️ Settings
                        </button>
                    </div>
                </div>

                {/* ── Settings Panel ── */}
                {showSettings && (
                    <div className="bg-white rounded-2xl border-2 border-indigo-100 p-5 mb-6 shadow-md shadow-indigo-50 fade-in">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm font-black text-slate-800">Notification Preferences</p>
                            <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors">×</button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {([
                                { key: "emailNotifs", label: "Email Notifications", icon: "✉️" },
                                { key: "smsNotifs", label: "SMS Alerts", icon: "📱" },
                                { key: "deadlineReminders", label: "Deadline Reminders", icon: "⏰" },
                                { key: "reportAlerts", label: "Report Submission Alerts", icon: "📄" },
                                { key: "attendanceAlerts", label: "Attendance Alerts", icon: "📅" },
                                { key: "evaluationReminders", label: "Evaluation Reminders", icon: "📋" },
                                { key: "progressUpdates", label: "Progress Milestones", icon: "📈" },
                                { key: "systemMessages", label: "System Messages", icon: "⚙️" },
                            ] as { key: keyof typeof settings; label: string; icon: string }[]).map(item => (
                                <div key={item.key}
                                    onClick={() => setSettings(p => ({ ...p, [item.key]: !p[item.key] }))}
                                    className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${settings[item.key] ? "border-indigo-200 bg-indigo-50" : "border-slate-100 bg-slate-50 opacity-60"}`}>
                                    <div className="flex items-center gap-2.5">
                                        <span className="text-base">{item.icon}</span>
                                        <span className={`text-xs font-bold ${settings[item.key] ? "text-indigo-700" : "text-slate-500"}`}>{item.label}</span>
                                    </div>
                                    <div className={`w-10 h-5 rounded-full transition-colors duration-200 relative ${settings[item.key] ? "bg-indigo-500" : "bg-slate-300"}`}>
                                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${settings[item.key] ? "translate-x-5" : "translate-x-0.5"}`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Stats Row ── */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    {[
                        { label: "Unread", value: unreadCount, icon: "✉️", bg: "bg-indigo-50 border-indigo-100", text: "text-indigo-700" },
                        { label: "Urgent", value: urgentCount, icon: "🚨", bg: "bg-rose-50 border-rose-100", text: "text-rose-600" },
                        { label: "Pinned", value: notifications.filter(n => n.pinned).length, icon: "📌", bg: "bg-orange-50 border-orange-100", text: "text-orange-600" },
                        { label: "Total", value: notifications.length, icon: "🔔", bg: "bg-slate-100 border-slate-200", text: "text-slate-700" },
                    ].map(s => (
                        <div key={s.label} className={`rounded-2xl border-2 p-4 ${s.bg}`}>
                            <span className="text-xl block mb-1">{s.icon}</span>
                            <p className={`text-2xl font-black ${s.text}`}>{s.value}</p>
                            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mt-0.5">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* ── Main layout ── */}
                <div className="flex gap-6">

                    {/* LEFT — Filter sidebar */}
                    <div className="hidden lg:flex flex-col w-52 shrink-0 gap-1.5">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-3 pb-1">Filter by type</p>
                        {filterOptions.map(opt => {
                            const count = opt.key === "all"
                                ? unreadCount
                                : opt.key === "unread"
                                    ? unreadCount
                                    : catCounts[opt.key as NotifCategory] || 0;
                            return (
                                <button key={opt.key} onClick={() => setActiveFilter(opt.key)}
                                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-150 ${activeFilter === opt.key
                                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                                            : "text-slate-600 hover:bg-white hover:shadow-sm"
                                        }`}>
                                    <span className="flex items-center gap-2.5">
                                        <span className="text-base">{opt.icon}</span>
                                        {opt.label}
                                    </span>
                                    {count > 0 && (
                                        <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[20px] text-center ${activeFilter === opt.key ? "bg-white/20 text-white" : "bg-rose-100 text-rose-600"}`}>
                                            {count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* RIGHT — Notifications list */}
                    <div className="flex-1 min-w-0">
                        {/* Search + mobile filter */}
                        <div className="flex gap-2 mb-4">
                            <div className="relative flex-1">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
                                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                                    placeholder="Search notifications..."
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
                                />
                            </div>
                            {/* Mobile filter dropdown */}
                            <select value={activeFilter} onChange={e => setActiveFilter(e.target.value as FilterType)}
                                className="lg:hidden text-xs font-bold px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer">
                                {filterOptions.map(o => <option key={o.key} value={o.key}>{o.icon} {o.label}</option>)}
                            </select>
                        </div>

                        {/* Result count */}
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xs font-bold text-slate-400">
                                {filtered.length} notification{filtered.length !== 1 ? "s" : ""}
                                {activeFilter !== "all" && ` · ${filterOptions.find(f => f.key === activeFilter)?.label}`}
                                {searchQuery && ` · "${searchQuery}"`}
                            </p>
                            {filtered.some(n => !n.read) && (
                                <button onClick={markAllRead} className="text-xs font-bold text-indigo-500 hover:text-indigo-700 transition-colors">
                                    Mark visible as read
                                </button>
                            )}
                        </div>

                        {/* Pinned section */}
                        {activeFilter === "all" && filtered.some(n => n.pinned) && (
                            <div className="mb-4">
                                <div className="flex items-center gap-2 mb-2.5">
                                    <span className="text-sm">📌</span>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-orange-500">Pinned</p>
                                </div>
                                <div className="space-y-2.5">
                                    {filtered.filter(n => n.pinned).map(n => (
                                        <div key={n.id} className="notif-slide">
                                            <NotifItem notif={n} onRead={markRead} onDelete={deleteNotif} onPin={togglePin} />
                                        </div>
                                    ))}
                                </div>
                                <div className="flex items-center gap-3 my-4">
                                    <div className="h-px flex-1 bg-slate-200" />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Other</p>
                                    <div className="h-px flex-1 bg-slate-200" />
                                </div>
                            </div>
                        )}

                        {/* Main list */}
                        {filtered.length === 0 ? (
                            <EmptyState filter={activeFilter} />
                        ) : (
                            <div className="space-y-2.5">
                                {filtered.filter(n => activeFilter !== "all" || !n.pinned).map(n => (
                                    <div key={n.id} className="notif-slide">
                                        <NotifItem notif={n} onRead={markRead} onDelete={deleteNotif} onPin={togglePin} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <p className="text-center text-[11px] text-slate-300 py-6 font-mono">
                    Internship Supervision System · Academic Year 2025–2026
                </p>
            </div>
        </>
    );
}