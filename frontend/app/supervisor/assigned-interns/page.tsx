"use client";

import { useState } from "react";

type Status = "Excellent" | "On Track" | "At Risk" | "Completed";
type EvalStatus = "Pending" | "Submitted" | "Due Soon";

interface Log {
    date: string;
    hours: number;
    activity: string;
};

interface Evaluation {
    type: "Mid-Term" | "Final";
    status: EvalStatus;
    score?: number;
    dueDate: string;
};

interface Intern {
    id: number;
    name: string;
    initials: string;
    studentId: string;
    program: string;
    department: string;
    institution: string;
    email: string;
    phone: string;
    status: Status;
    progress: number;
    hoursCompleted: number;
    hoursRequired: number;
    startDate: string;
    endDate: string;
    skills: string[];
    evaluations: Evaluation[];
    recentLogs: Log[];
    reportsSubmitted: number;
    reportsTotal: number;
    attendanceRate: number;
    gradientFrom: string;
    gradientTo: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const INTERNS: Intern[] = [
    {
        id: 1,
        name: "Amara Nkosi",
        initials: "AN",
        studentId: "STU-2024-001",
        program: "BSc. Software Engineering",
        department: "Software Development Unit",
        institution: "University of Rwanda",
        email: "amara.nkosi@ur.ac.rw",
        phone: "+250 788 123 456",
        status: "Excellent",
        progress: 82,
        hoursCompleted: 246,
        hoursRequired: 300,
        startDate: "Jan 15, 2025",
        endDate: "Apr 15, 2025",
        skills: ["React", "TypeScript", "Node.js", "PostgreSQL"],
        evaluations: [
            { type: "Mid-Term", status: "Submitted", score: 88, dueDate: "Feb 28, 2025" },
            { type: "Final", status: "Pending", dueDate: "Apr 10, 2025" },
        ],
        recentLogs: [
            { date: "Mar 19", hours: 8, activity: "Implemented API authentication module" },
            { date: "Mar 18", hours: 7.5, activity: "Code review & unit testing" },
            { date: "Mar 17", hours: 8, activity: "Database schema optimization" },
        ],
        reportsSubmitted: 10,
        reportsTotal: 12,
        attendanceRate: 97,
        gradientFrom: "#6366f1",
        gradientTo: "#8b5cf6",
    },
    {
        id: 2,
        name: "Kwame Asante",
        initials: "KA",
        studentId: "STU-2024-002",
        program: "BSc. Data Science",
        department: "Analytics & Research",
        institution: "Kigali Independent University",
        email: "kwame.asante@kiu.rw",
        phone: "+250 722 234 567",
        status: "At Risk",
        progress: 41,
        hoursCompleted: 124,
        hoursRequired: 300,
        startDate: "Jan 15, 2025",
        endDate: "Apr 15, 2025",
        skills: ["Python", "Data Analysis", "SQL", "Tableau"],
        evaluations: [
            { type: "Mid-Term", status: "Due Soon", dueDate: "Mar 25, 2025" },
            { type: "Final", status: "Pending", dueDate: "Apr 10, 2025" },
        ],
        recentLogs: [
            { date: "Mar 15", hours: 4, activity: "Data cleaning pipeline" },
            { date: "Mar 10", hours: 5, activity: "Weekly report submission" },
            { date: "Mar 8", hours: 3.5, activity: "EDA on patient dataset" },
        ],
        reportsSubmitted: 5,
        reportsTotal: 10,
        attendanceRate: 68,
        gradientFrom: "#f43f5e",
        gradientTo: "#fb923c",
    },
    {
        id: 3,
        name: "Fatima Al-Rashid",
        initials: "FA",
        studentId: "STU-2024-003",
        program: "BSc. UI/UX Design",
        department: "Digital Product Design",
        institution: "INES Ruhengeri",
        email: "fatima.alrashid@ines.ac.rw",
        phone: "+250 733 345 678",
        status: "On Track",
        progress: 74,
        hoursCompleted: 222,
        hoursRequired: 300,
        startDate: "Jan 15, 2025",
        endDate: "Apr 15, 2025",
        skills: ["Figma", "Prototyping", "User Research", "CSS"],
        evaluations: [
            { type: "Mid-Term", status: "Submitted", score: 81, dueDate: "Feb 28, 2025" },
            { type: "Final", status: "Pending", dueDate: "Apr 10, 2025" },
        ],
        recentLogs: [
            { date: "Mar 20", hours: 8, activity: "Usability testing session" },
            { date: "Mar 19", hours: 7, activity: "High-fidelity prototype revision" },
            { date: "Mar 18", hours: 8, activity: "Stakeholder presentation prep" },
        ],
        reportsSubmitted: 9,
        reportsTotal: 12,
        attendanceRate: 92,
        gradientFrom: "#0ea5e9",
        gradientTo: "#06b6d4",
    },
    {
        id: 4,
        name: "Diego Morales",
        initials: "DM",
        studentId: "STU-2024-004",
        program: "BSc. Computer Science",
        department: "Backend Engineering",
        institution: "Adventist University of Central Africa",
        email: "diego.morales@auca.ac.rw",
        phone: "+250 788 456 789",
        status: "Excellent",
        progress: 91,
        hoursCompleted: 273,
        hoursRequired: 300,
        startDate: "Jan 15, 2025",
        endDate: "Apr 15, 2025",
        skills: ["Java", "Spring Boot", "Microservices", "Docker"],
        evaluations: [
            { type: "Mid-Term", status: "Submitted", score: 94, dueDate: "Feb 28, 2025" },
            { type: "Final", status: "Due Soon", dueDate: "Mar 28, 2025" },
        ],
        recentLogs: [
            { date: "Mar 20", hours: 8, activity: "Microservices deployment on k8s" },
            { date: "Mar 19", hours: 8, activity: "Performance benchmarking" },
            { date: "Mar 18", hours: 7.5, activity: "CI/CD pipeline configuration" },
        ],
        reportsSubmitted: 11,
        reportsTotal: 12,
        attendanceRate: 99,
        gradientFrom: "#10b981",
        gradientTo: "#059669",
    },
    {
        id: 5,
        name: "Nadine Uwase",
        initials: "NU",
        studentId: "STU-2024-005",
        program: "BSc. Health Informatics",
        department: "Medical Records & HIS",
        institution: "University of Rwanda",
        email: "nadine.uwase@ur.ac.rw",
        phone: "+250 722 567 890",
        status: "On Track",
        progress: 66,
        hoursCompleted: 198,
        hoursRequired: 300,
        startDate: "Jan 15, 2025",
        endDate: "Apr 15, 2025",
        skills: ["HL7 FHIR", "OpenMRS", "Python", "Data Privacy"],
        evaluations: [
            { type: "Mid-Term", status: "Submitted", score: 76, dueDate: "Feb 28, 2025" },
            { type: "Final", status: "Pending", dueDate: "Apr 10, 2025" },
        ],
        recentLogs: [
            { date: "Mar 20", hours: 7, activity: "FHIR resource implementation" },
            { date: "Mar 19", hours: 8, activity: "Patient data migration scripts" },
            { date: "Mar 17", hours: 6, activity: "System integration testing" },
        ],
        reportsSubmitted: 8,
        reportsTotal: 12,
        attendanceRate: 88,
        gradientFrom: "#f59e0b",
        gradientTo: "#d97706",
    },
];

// ─── Status Config ─────────────────────────────────────────────────────────────
const statusCfg: Record<Status, { bg: string; text: string; dot: string; border: string; bar: string }> = {
    Excellent: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", border: "border-emerald-200", bar: "bg-emerald-500" },
    "On Track": { bg: "bg-sky-50", text: "text-sky-700", dot: "bg-sky-500", border: "border-sky-200", bar: "bg-sky-500" },
    "At Risk": { bg: "bg-rose-50", text: "text-rose-600", dot: "bg-rose-400", border: "border-rose-200", bar: "bg-rose-400" },
    Completed: { bg: "bg-slate-50", text: "text-slate-500", dot: "bg-slate-400", border: "border-slate-200", bar: "bg-slate-400" },
};

const evalCfg: Record<EvalStatus, { bg: string; text: string }> = {
    Submitted: { bg: "bg-emerald-50", text: "text-emerald-700" },
    "Due Soon": { bg: "bg-amber-50", text: "text-amber-700" },
    Pending: { bg: "bg-slate-100", text: "text-slate-500" },
};

// ─── Circular Progress ────────────────────────────────────────────────────────
function CircularProgress({ value, size = 56, stroke = 5, color }: { value: number; size?: number; stroke?: number; color: string }) {
    const r = (size - stroke * 2) / 2;
    const circ = 2 * Math.PI * r;
    const offset = circ - (value / 100) * circ;
    return (
        <svg width={size} height={size} className="-rotate-90">
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={stroke} />
            <circle
                cx={size / 2} cy={size / 2} r={r} fill="none"
                stroke={color} strokeWidth={stroke}
                strokeDasharray={circ} strokeDashoffset={offset}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(.4,0,.2,1)" }}
            />
        </svg>
    );
}

// ─── Stat Mini ────────────────────────────────────────────────────────────────
function MiniStat({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
    return (
        <div className="bg-slate-50 rounded-xl p-3 text-center">
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-0.5">{label}</p>
            <p className="text-xl font-black text-slate-800 leading-none">{value}</p>
            {sub && <p className="text-[10px] text-slate-400 mt-0.5">{sub}</p>}
        </div>
    );
}

// ─── Intern Card ─────────────────────────────────────────────────────────────
function InternCard({ intern, isSelected, onClick }: { intern: Intern; isSelected: boolean; onClick: () => void }) {
    const cfg = statusCfg[intern.status];
    return (
        <button
            onClick={onClick}
            className={`w-full text-left rounded-2xl border-2 p-4 transition-all duration-200 group hover:shadow-md ${isSelected
                ? "border-indigo-400 bg-indigo-50/60 shadow-md"
                : `border-slate-100 bg-white hover:border-slate-200`
                }`}
        >
            <div className="flex items-center gap-3">
                {/* Avatar */}
                <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm"
                    style={{ background: `linear-gradient(135deg, ${intern.gradientFrom}, ${intern.gradientTo})` }}
                >
                    {intern.initials}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">{intern.name}</p>
                    <p className="text-xs text-slate-400 truncate">{intern.department}</p>
                </div>
                {/* Progress ring */}
                <div className="relative shrink-0">
                    <CircularProgress value={intern.progress} size={44} stroke={4} color={intern.gradientFrom} />
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-slate-700">
                        {intern.progress}%
                    </span>
                </div>
            </div>
            {/* Status + hours */}
            <div className="flex items-center justify-between mt-3">
                <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                    {intern.status}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                    {intern.hoursCompleted}h / {intern.hoursRequired}h
                </span>
            </div>
        </button>
    );
}

// ─── Intern Details Panel ─────────────────────────────────────────────────────
function InternDetails({ intern }: { intern: Intern }) {
    const [activeTab, setActiveTab] = useState<"overview" | "logs" | "evaluations">("overview");
    const cfg = statusCfg[intern.status];

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div
                className="rounded-2xl p-6 text-white relative overflow-hidden mb-5"
                style={{ background: `linear-gradient(135deg, ${intern.gradientFrom}, ${intern.gradientTo})` }}
            >
                {/* Decorative circles */}
                <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10" />
                <div className="absolute -bottom-10 -left-6 w-32 h-32 rounded-full bg-white/10" />

                <div className="relative flex items-start gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-black shadow-lg">
                        {intern.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-xl font-black">{intern.name}</h2>
                            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-semibold">{intern.studentId}</span>
                        </div>
                        <p className="text-sm text-white/80 mt-0.5">{intern.program}</p>
                        <p className="text-xs text-white/60 mt-1">{intern.institution}</p>
                    </div>
                    <span className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm`}>
                        {intern.status}
                    </span>
                </div>

                {/* Contact row */}
                <div className="relative flex gap-4 mt-4 flex-wrap">
                    <span className="flex items-center gap-1.5 text-xs text-white/70">
                        <span>✉</span> {intern.email}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-white/70">
                        <span>📞</span> {intern.phone}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-white/70">
                        <span>🏢</span> {intern.department}
                    </span>
                </div>

                {/* Internship period */}
                <div className="relative flex items-center gap-2 mt-3">
                    <span className="text-xs text-white/60">Internship Period:</span>
                    <span className="text-xs font-semibold text-white">{intern.startDate} → {intern.endDate}</span>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-3 mb-5">
                <MiniStat label="Progress" value={`${intern.progress}%`} />
                <MiniStat label="Hours" value={intern.hoursCompleted} sub={`/ ${intern.hoursRequired}h`} />
                <MiniStat label="Attendance" value={`${intern.attendanceRate}%`} />
                <MiniStat label="Reports" value={`${intern.reportsSubmitted}/${intern.reportsTotal}`} />
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-5 text-xs font-bold">
                {(["overview", "logs", "evaluations"] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-2 rounded-lg capitalize transition-all duration-200 ${activeTab === tab ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto">

                {/* ── Overview ── */}
                {activeTab === "overview" && (
                    <div className="space-y-5">
                        {/* Progress bar */}
                        <div className="bg-white rounded-2xl border border-slate-100 p-4">
                            <div className="flex justify-between items-center mb-3">
                                <p className="text-sm font-bold text-slate-700">Internship Progress</p>
                                <span className="text-sm font-black text-slate-800">{intern.progress}%</span>
                            </div>
                            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-700 ${cfg.bar}`}
                                    style={{ width: `${intern.progress}%` }}
                                />
                            </div>
                            <div className="flex justify-between mt-2">
                                <span className="text-[10px] text-slate-400">{intern.hoursCompleted}h completed</span>
                                <span className="text-[10px] text-slate-400">{intern.hoursRequired - intern.hoursCompleted}h remaining</span>
                            </div>
                        </div>

                        {/* Skills */}
                        <div className="bg-white rounded-2xl border border-slate-100 p-4">
                            <p className="text-sm font-bold text-slate-700 mb-3">Skills & Competencies</p>
                            <div className="flex flex-wrap gap-2">
                                {intern.skills.map((s) => (
                                    <span
                                        key={s}
                                        className="text-xs font-semibold px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100"
                                    >
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Evaluation summary */}
                        <div className="bg-white rounded-2xl border border-slate-100 p-4">
                            <p className="text-sm font-bold text-slate-700 mb-3">Evaluation Summary</p>
                            <div className="space-y-2">
                                {intern.evaluations.map((ev) => {
                                    const ec = evalCfg[ev.status];
                                    return (
                                        <div key={ev.type} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                                            <div>
                                                <p className="text-xs font-bold text-slate-700">{ev.type} Evaluation</p>
                                                <p className="text-[10px] text-slate-400">Due: {ev.dueDate}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {ev.score && (
                                                    <span className="text-sm font-black text-slate-800">{ev.score}/100</span>
                                                )}
                                                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${ec.bg} ${ec.text}`}>
                                                    {ev.status}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Logs ── */}
                {activeTab === "logs" && (
                    <div className="bg-white rounded-2xl border border-slate-100 p-4">
                        <p className="text-sm font-bold text-slate-700 mb-4">Recent Work Logs</p>
                        <div className="space-y-3">
                            {intern.recentLogs.map((log, i) => (
                                <div key={i} className="flex gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                                    <div
                                        className="w-10 h-10 rounded-xl flex flex-col items-center justify-center text-white text-[9px] font-bold shrink-0"
                                        style={{ background: `linear-gradient(135deg, ${intern.gradientFrom}, ${intern.gradientTo})` }}
                                    >
                                        <span className="text-sm font-black leading-none">{log.hours}</span>
                                        <span className="opacity-80">hrs</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-700">{log.activity}</p>
                                        <p className="text-[10px] text-slate-400 mt-0.5">{log.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="mt-4 w-full py-2.5 text-xs font-bold text-indigo-600 border border-dashed border-indigo-200 rounded-xl hover:bg-indigo-50 transition-colors">
                            View All Logs →
                        </button>
                    </div>
                )}

                {/* ── Evaluations ── */}
                {activeTab === "evaluations" && (
                    <div className="space-y-3">
                        {intern.evaluations.map((ev) => {
                            const ec = evalCfg[ev.status];
                            return (
                                <div key={ev.type} className="bg-white rounded-2xl border border-slate-100 p-5">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <p className="text-sm font-black text-slate-800">{ev.type} Evaluation</p>
                                            <p className="text-xs text-slate-400 mt-0.5">Due: {ev.dueDate}</p>
                                        </div>
                                        <span className={`text-xs font-bold px-2.5 py-1.5 rounded-full ${ec.bg} ${ec.text}`}>
                                            {ev.status}
                                        </span>
                                    </div>
                                    {ev.score ? (
                                        <div className="mb-4">
                                            <div className="flex justify-between mb-1.5">
                                                <span className="text-xs text-slate-500">Score</span>
                                                <span className="text-xs font-black text-slate-800">{ev.score}/100</span>
                                            </div>
                                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${ev.score}%` }} />
                                            </div>
                                        </div>
                                    ) : null}
                                    <button
                                        className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${ev.status === "Submitted"
                                            ? "bg-slate-100 text-slate-500 cursor-default"
                                            : "text-white shadow-sm hover:opacity-90 active:scale-95"
                                            }`}
                                        style={ev.status !== "Submitted" ? { background: `linear-gradient(135deg, ${intern.gradientFrom}, ${intern.gradientTo})` } : {}}
                                        disabled={ev.status === "Submitted"}
                                    >
                                        {ev.status === "Submitted" ? "✓ Evaluation Submitted" : `Start ${ev.type} Evaluation`}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 mt-5 pt-4 border-t border-slate-100">
                <button
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm hover:opacity-90 active:scale-95 transition-all"
                    style={{ background: `linear-gradient(135deg, ${intern.gradientFrom}, ${intern.gradientTo})` }}
                >
                    📋 Evaluate
                </button>
                <button className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
                    💬 Message
                </button>
                <button className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
                    📄 Report
                </button>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AssignedInternsPage() {
    const [selected, setSelected] = useState<Intern>(INTERNS[0]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<"All" | Status>("All");

    const filtered = INTERNS.filter((i) => {
        const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) ||
            i.department.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === "All" || i.status === filter;
        return matchSearch && matchFilter;
    });

    const statusFilters: ("All" | Status)[] = ["All", "Excellent", "On Track", "At Risk"];

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap');
        * { font-family: 'Sora', sans-serif; }
        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }
        .page-enter { animation: pageEnter 0.4s ease forwards; }
        @keyframes pageEnter {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

            <div className="min-h-screen bg-[#f7f8fc] p-4 sm:p-6 page-enter">
                {/* ── Page Header ── */}
                <div className="mb-6">
                    <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-1">Supervisor · Intern Management</p>
                    <h1 className="text-2xl font-black text-slate-900">Assigned Interns</h1>
                    <p className="text-sm text-slate-400 mt-1">Monitor and manage your {INTERNS.length} assigned interns</p>
                </div>

                {/* ── Summary Chips ── */}
                <div className="flex flex-wrap gap-3 mb-6">
                    {[
                        { label: "Total", value: INTERNS.length, color: "bg-indigo-100 text-indigo-700" },
                        { label: "Excellent", value: INTERNS.filter(i => i.status === "Excellent").length, color: "bg-emerald-100 text-emerald-700" },
                        { label: "On Track", value: INTERNS.filter(i => i.status === "On Track").length, color: "bg-sky-100 text-sky-700" },
                        { label: "At Risk", value: INTERNS.filter(i => i.status === "At Risk").length, color: "bg-rose-100 text-rose-600" },
                    ].map((c) => (
                        <div key={c.label} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${c.color}`}>
                            <span className="text-base font-black">{c.value}</span>
                            {c.label}
                        </div>
                    ))}
                </div>

                {/* ── Main layout: List + Details ── */}
                <div className="flex gap-6 h-[calc(100vh-220px)] min-h-[600px]">

                    {/* LEFT: Intern List */}
                    <div className="w-full max-w-xs flex flex-col shrink-0">
                        {/* Search */}
                        <div className="relative mb-3">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
                            <input
                                type="text"
                                placeholder="Search interns..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition"
                            />
                        </div>

                        {/* Filter pills */}
                        <div className="flex gap-1.5 mb-3 flex-wrap">
                            {statusFilters.map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`text-[10px] font-bold px-2.5 py-1.5 rounded-full transition-all duration-200 ${filter === f
                                        ? "bg-indigo-600 text-white shadow-sm"
                                        : "bg-white border border-slate-200 text-slate-500 hover:border-indigo-200"
                                        }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>

                        {/* Cards */}
                        <div className="flex-1 overflow-y-auto space-y-2.5 scrollbar-thin pr-1">
                            {filtered.length === 0 ? (
                                <div className="text-center py-12 text-sm text-slate-400">
                                    <p className="text-3xl mb-2">🔍</p>
                                    No interns found
                                </div>
                            ) : (
                                filtered.map((intern) => (
                                    <InternCard
                                        key={intern.id}
                                        intern={intern}
                                        isSelected={selected.id === intern.id}
                                        onClick={() => setSelected(intern)}
                                    />
                                ))
                            )}
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="w-px bg-slate-200 shrink-0 hidden sm:block" />

                    {/* RIGHT: Intern Details */}
                    <div className="flex-1 overflow-y-auto scrollbar-thin">
                        <InternDetails intern={selected} />
                    </div>
                </div>
            </div>
        </>
    );
}