"use client";

import { useState, useMemo } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type TabType = "logs" | "timesheets";
type LogStatus = "Approved" | "Pending" | "Flagged";
type TimesheetStatus = "Approved" | "Pending" | "Rejected" | "Under Review";

interface Intern {
  id: number;
  name: string;
  initials: string;
  department: string;
  program: string;
  hoursRequired: number;
  hoursCompleted: number;
  gradientFrom: string;
  gradientTo: string;
}

interface StudentLog {
  id: number;
  internId: number;
  date: string;
  day: string;
  hoursWorked: number;
  activity: string;
  description: string;
  category: string;
  status: LogStatus;
  supervisorNote?: string;
}

interface TimesheetWeek {
  id: number;
  internId: number;
  weekLabel: string;
  weekStart: string;
  weekEnd: string;
  totalHours: number;
  status: TimesheetStatus;
  submittedOn: string;
  days: { day: string; date: string; hours: number; activity: string }[];
  supervisorComment?: string;
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const INTERNS: Intern[] = [
  { id: 1, name: "Amara Nkosi", initials: "AN", department: "Software Dev Unit", program: "BSc. Software Engineering", hoursRequired: 300, hoursCompleted: 246, gradientFrom: "#6366f1", gradientTo: "#8b5cf6" },
  { id: 2, name: "Kwame Asante", initials: "KA", department: "Analytics & Research", program: "BSc. Data Science", hoursRequired: 300, hoursCompleted: 124, gradientFrom: "#f43f5e", gradientTo: "#fb923c" },
  { id: 3, name: "Fatima Al-Rashid", initials: "FA", department: "Digital Product Design", program: "BSc. UI/UX Design", hoursRequired: 300, hoursCompleted: 222, gradientFrom: "#0ea5e9", gradientTo: "#06b6d4" },
  { id: 4, name: "Diego Morales", initials: "DM", department: "Backend Engineering", program: "BSc. Computer Science", hoursRequired: 300, hoursCompleted: 273, gradientFrom: "#10b981", gradientTo: "#059669" },
  { id: 5, name: "Nadine Uwase", initials: "NU", department: "Medical Records & HIS", program: "BSc. Health Informatics", hoursRequired: 300, hoursCompleted: 198, gradientFrom: "#f59e0b", gradientTo: "#d97706" },
];

const STUDENT_LOGS: StudentLog[] = [
  { id: 1, internId: 1, date: "Mar 20, 2025", day: "Thu", hoursWorked: 8, activity: "API Development", description: "Implemented OAuth2 authentication flow for the internship portal backend.", category: "Development", status: "Approved" },
  { id: 2, internId: 1, date: "Mar 19, 2025", day: "Wed", hoursWorked: 7.5, activity: "Code Review", description: "Reviewed pull requests for the user management module and wrote unit tests.", category: "Quality Assurance", status: "Approved" },
  { id: 3, internId: 1, date: "Mar 18, 2025", day: "Tue", hoursWorked: 8, activity: "Database Optimization", description: "Optimized PostgreSQL queries, reduced response time by 40%.", category: "Development", status: "Pending" },
  { id: 4, internId: 2, date: "Mar 20, 2025", day: "Thu", hoursWorked: 4, activity: "Data Cleaning", description: "Preprocessed patient dataset for analysis pipeline.", category: "Data Science", status: "Flagged", supervisorNote: "Hours seem low — please clarify tasks done." },
  { id: 5, internId: 2, date: "Mar 18, 2025", day: "Tue", hoursWorked: 5, activity: "EDA", description: "Exploratory data analysis on appointment records.", category: "Data Science", status: "Pending" },
  { id: 6, internId: 3, date: "Mar 20, 2025", day: "Thu", hoursWorked: 8, activity: "Usability Testing", description: "Conducted usability sessions with 5 participants for the new patient portal.", category: "Research", status: "Approved" },
  { id: 7, internId: 3, date: "Mar 19, 2025", day: "Wed", hoursWorked: 7, activity: "Prototype Revision", description: "Revised high-fidelity prototypes based on usability test findings.", category: "Design", status: "Pending" },
  { id: 8, internId: 4, date: "Mar 20, 2025", day: "Thu", hoursWorked: 8, activity: "Kubernetes Deployment", description: "Deployed microservices to k8s cluster and configured auto-scaling.", category: "DevOps", status: "Approved" },
  { id: 9, internId: 4, date: "Mar 19, 2025", day: "Wed", hoursWorked: 8, activity: "Performance Testing", description: "Benchmarked API endpoints using k6, documented findings.", category: "Quality Assurance", status: "Approved" },
  { id: 10, internId: 5, date: "Mar 20, 2025", day: "Thu", hoursWorked: 7, activity: "FHIR Implementation", description: "Implemented Patient and Observation FHIR R4 resources in OpenMRS.", category: "Development", status: "Pending" },
  { id: 11, internId: 5, date: "Mar 18, 2025", day: "Tue", hoursWorked: 6, activity: "Integration Testing", description: "System integration testing between FHIR API and hospital HIS.", category: "Quality Assurance", status: "Flagged", supervisorNote: "Documentation incomplete — add test cases." },
];

const TIMESHEETS: TimesheetWeek[] = [
  {
    id: 1, internId: 1, weekLabel: "Week 10", weekStart: "Mar 17", weekEnd: "Mar 21, 2025",
    totalHours: 39.5, status: "Pending", submittedOn: "Mar 21, 2025",
    days: [
      { day: "Mon", date: "Mar 17", hours: 8, activity: "Database Optimization" },
      { day: "Tue", date: "Mar 18", hours: 8, activity: "Database Optimization" },
      { day: "Wed", date: "Mar 19", hours: 7.5, activity: "Code Review" },
      { day: "Thu", date: "Mar 20", hours: 8, activity: "API Development" },
      { day: "Fri", date: "Mar 21", hours: 8, activity: "Sprint Review" },
    ],
  },
  {
    id: 2, internId: 1, weekLabel: "Week 9", weekStart: "Mar 10", weekEnd: "Mar 14, 2025",
    totalHours: 40, status: "Approved", submittedOn: "Mar 14, 2025", supervisorComment: "Great week. Excellent progress on the auth module.",
    days: [
      { day: "Mon", date: "Mar 10", hours: 8, activity: "Auth Module" },
      { day: "Tue", date: "Mar 11", hours: 8, activity: "Auth Module" },
      { day: "Wed", date: "Mar 12", hours: 8, activity: "Unit Testing" },
      { day: "Thu", date: "Mar 13", hours: 8, activity: "Documentation" },
      { day: "Fri", date: "Mar 14", hours: 8, activity: "Code Review" },
    ],
  },
  {
    id: 3, internId: 2, weekLabel: "Week 10", weekStart: "Mar 17", weekEnd: "Mar 21, 2025",
    totalHours: 22, status: "Under Review", submittedOn: "Mar 21, 2025",
    days: [
      { day: "Mon", date: "Mar 17", hours: 4, activity: "Data Cleaning" },
      { day: "Tue", date: "Mar 18", hours: 5, activity: "EDA" },
      { day: "Wed", date: "Mar 19", hours: 0, activity: "Absent" },
      { day: "Thu", date: "Mar 20", hours: 4, activity: "Data Cleaning" },
      { day: "Fri", date: "Mar 21", hours: 9, activity: "Visualization" },
    ],
  },
  {
    id: 4, internId: 2, weekLabel: "Week 9", weekStart: "Mar 10", weekEnd: "Mar 14, 2025",
    totalHours: 18, status: "Rejected", submittedOn: "Mar 14, 2025", supervisorComment: "Total hours are inconsistent with logs. Please resubmit with accurate records.",
    days: [
      { day: "Mon", date: "Mar 10", hours: 4, activity: "Data Pipeline" },
      { day: "Tue", date: "Mar 11", hours: 3, activity: "SQL Queries" },
      { day: "Wed", date: "Mar 12", hours: 4, activity: "Reporting" },
      { day: "Thu", date: "Mar 13", hours: 4, activity: "Documentation" },
      { day: "Fri", date: "Mar 14", hours: 3, activity: "Presentation" },
    ],
  },
  {
    id: 5, internId: 3, weekLabel: "Week 10", weekStart: "Mar 17", weekEnd: "Mar 21, 2025",
    totalHours: 38, status: "Pending", submittedOn: "Mar 21, 2025",
    days: [
      { day: "Mon", date: "Mar 17", hours: 8, activity: "Stakeholder Prep" },
      { day: "Tue", date: "Mar 18", hours: 8, activity: "Stakeholder Presentation" },
      { day: "Wed", date: "Mar 19", hours: 7, activity: "Prototype Revision" },
      { day: "Thu", date: "Mar 20", hours: 8, activity: "Usability Testing" },
      { day: "Fri", date: "Mar 21", hours: 7, activity: "Documentation" },
    ],
  },
  {
    id: 6, internId: 4, weekLabel: "Week 10", weekStart: "Mar 17", weekEnd: "Mar 21, 2025",
    totalHours: 40, status: "Approved", submittedOn: "Mar 20, 2025", supervisorComment: "Exceptional work this week. Deployment was flawless.",
    days: [
      { day: "Mon", date: "Mar 17", hours: 8, activity: "CI/CD Pipeline" },
      { day: "Tue", date: "Mar 18", hours: 7.5, activity: "CI/CD Pipeline" },
      { day: "Wed", date: "Mar 19", hours: 8, activity: "Performance Testing" },
      { day: "Thu", date: "Mar 20", hours: 8, activity: "Kubernetes Deployment" },
      { day: "Fri", date: "Mar 21", hours: 8.5, activity: "Documentation" },
    ],
  },
  {
    id: 7, internId: 5, weekLabel: "Week 10", weekStart: "Mar 17", weekEnd: "Mar 21, 2025",
    totalHours: 34, status: "Under Review", submittedOn: "Mar 21, 2025",
    days: [
      { day: "Mon", date: "Mar 17", hours: 7, activity: "FHIR Resources" },
      { day: "Tue", date: "Mar 18", hours: 6, activity: "Integration Testing" },
      { day: "Wed", date: "Mar 19", hours: 7, activity: "Data Migration" },
      { day: "Thu", date: "Mar 20", hours: 7, activity: "FHIR Implementation" },
      { day: "Fri", date: "Mar 21", hours: 7, activity: "Reporting" },
    ],
  },
];

// ─── Config ────────────────────────────────────────────────────────────────────
const LOG_STATUS_CFG: Record<LogStatus, { bg: string; text: string; border: string; dot: string; icon: string }> = {
  Approved: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500", icon: "✓" },
  Pending: { bg: "bg-slate-100", text: "text-slate-500", border: "border-slate-200", dot: "bg-slate-400", icon: "○" },
  Flagged: { bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-200", dot: "bg-rose-400", icon: "⚑" },
};

const TS_STATUS_CFG: Record<TimesheetStatus, { bg: string; text: string; border: string; dot: string; rowBg: string }> = {
  Approved: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500", rowBg: "bg-emerald-50/40" },
  Pending: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-400", rowBg: "bg-amber-50/40" },
  Rejected: { bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-200", dot: "bg-rose-400", rowBg: "bg-rose-50/40" },
  "Under Review": { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200", dot: "bg-indigo-500", rowBg: "bg-indigo-50/40" },
};

const CATEGORIES = ["All", "Development", "Design", "Research", "Data Science", "Quality Assurance", "DevOps"];

// ─── Intern Avatar ──────────────────────────────────────────────────────────────
function Avatar({ intern, size = "md" }: { intern: Intern; size?: "sm" | "md" | "lg" }) {
  const sz = size === "sm" ? "w-8 h-8 text-xs" : size === "lg" ? "w-14 h-14 text-lg" : "w-10 h-10 text-sm";
  return (
    <div className={`${sz} rounded-xl flex items-center justify-center text-white font-black shrink-0 shadow-sm`}
      style={{ background: `linear-gradient(135deg, ${intern.gradientFrom}, ${intern.gradientTo})` }}>
      {intern.initials}
    </div>
  );
}

// ─── Hours Bar ──────────────────────────────────────────────────────────────────
function HoursBar({ completed, required, color }: { completed: number; required: number; color: string }) {
  const pct = Math.min(100, Math.round((completed / required) * 100));
  return (
    <div className="w-full">
      <div className="flex justify-between mb-1">
        <span className="text-[10px] text-slate-400 font-semibold">{completed}h done</span>
        <span className="text-[10px] font-black" style={{ color }}>{pct}%</span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}cc, ${color})` }} />
      </div>
      <span className="text-[10px] text-slate-300 mt-0.5 block">{required - completed}h remaining</span>
    </div>
  );
}

// ─── Status Badge ───────────────────────────────────────────────────────────────
function Badge({ status, type }: { status: LogStatus | TimesheetStatus; type: "log" | "ts" }) {
  const cfg = type === "log" ? LOG_STATUS_CFG[status as LogStatus] : TS_STATUS_CFG[status as TimesheetStatus];
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {status}
    </span>
  );
}

// ─── Timesheet Detail Modal ─────────────────────────────────────────────────────
function TimesheetModal({ ts, intern, onClose, onApprove, onReject }: {
  ts: TimesheetWeek; intern: Intern; onClose: () => void;
  onApprove: () => void; onReject: () => void;
}) {
  const [comment, setComment] = useState(ts.supervisorComment || "");
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);
  const maxH = Math.max(...ts.days.map(d => d.hours), 8);

  const handleAction = async (action: "approve" | "reject") => {
    setLoading(action);
    await new Promise(r => setTimeout(r, 900));
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    action === "approve" ? onApprove() : onReject();
    setLoading(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 shrink-0 relative overflow-hidden text-white"
          style={{ background: `linear-gradient(135deg, ${intern.gradientFrom}, ${intern.gradientTo})` }}>
          <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/10" />
          <div className="relative flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Avatar intern={intern} size="lg" />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-black">{intern.name}</h2>
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-bold">{ts.weekLabel}</span>
                </div>
                <p className="text-sm text-white/70">{ts.weekStart} – {ts.weekEnd}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-white/60">Submitted: {ts.submittedOn}</span>
                  <span className="text-xs font-black">{ts.totalHours}h total</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge status={ts.status} type="ts" />
              <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center text-white font-bold text-lg transition-colors">×</button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Day-by-day bar chart */}
          <div className="bg-slate-50 rounded-2xl p-4">
            <p className="text-xs font-black text-slate-600 uppercase tracking-wider mb-4">Daily Hours Breakdown</p>
            <div className="flex items-end gap-3 h-28">
              {ts.days.map((d) => {
                const h = d.hours;
                const pct = maxH > 0 ? (h / maxH) * 100 : 0;
                const isAbsent = h === 0;
                return (
                  <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5">
                    <span className={`text-[10px] font-black ${isAbsent ? "text-rose-400" : "text-slate-600"}`}>{h}h</span>
                    <div className="w-full rounded-t-lg overflow-hidden" style={{ height: "72px", display: "flex", alignItems: "flex-end" }}>
                      <div
                        className="w-full rounded-t-lg transition-all duration-700"
                        style={{
                          height: isAbsent ? "4px" : `${pct}%`,
                          background: isAbsent ? "#fca5a5" : `linear-gradient(180deg, ${intern.gradientFrom}, ${intern.gradientTo})`,
                          opacity: isAbsent ? 0.6 : 1,
                        }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500">{d.day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Day details table */}
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider">Day</th>
                  <th className="text-left px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider">Date</th>
                  <th className="text-left px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider">Activity</th>
                  <th className="text-right px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider">Hours</th>
                </tr>
              </thead>
              <tbody>
                {ts.days.map((d, i) => (
                  <tr key={i} className={`border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors ${d.hours === 0 ? "opacity-50" : ""}`}>
                    <td className="px-4 py-3 font-bold text-slate-700 text-xs">{d.day}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{d.date}</td>
                    <td className="px-4 py-3 text-slate-600 text-xs">{d.activity}</td>
                    <td className={`px-4 py-3 text-right font-black text-xs ${d.hours === 0 ? "text-rose-400" : "text-slate-800"}`}>
                      {d.hours === 0 ? "Absent" : `${d.hours}h`}
                    </td>
                  </tr>
                ))}
                <tr className="bg-slate-50 border-t-2 border-slate-200">
                  <td colSpan={3} className="px-4 py-3 text-xs font-black text-slate-600">Total</td>
                  <td className="px-4 py-3 text-right text-sm font-black" style={{ color: intern.gradientFrom }}>{ts.totalHours}h</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Supervisor comment */}
          <div>
            <label className="text-xs font-black text-slate-600 uppercase tracking-wider mb-2 block">Supervisor Comment</label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              disabled={ts.status === "Approved"}
              rows={3}
              placeholder="Add a comment or feedback for this timesheet..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none disabled:bg-slate-50 disabled:text-slate-500 transition"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 px-5 py-4 shrink-0 bg-slate-50/80 flex items-center justify-between gap-3">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-500 bg-white border border-slate-200 hover:bg-slate-100 transition-colors">
            Close
          </button>
          {ts.status !== "Approved" && (
            <div className="flex gap-2">
              <button
                onClick={() => handleAction("reject")}
                disabled={!!loading}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-rose-600 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors disabled:opacity-50"
              >
                {loading === "reject" ? "Rejecting..." : "✗ Reject"}
              </button>
              <button
                onClick={() => handleAction("approve")}
                disabled={!!loading}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200 active:scale-95 shadow-md disabled:opacity-50"
                style={{ background: `linear-gradient(135deg, ${intern.gradientFrom}, ${intern.gradientTo})` }}
              >
                {loading === "approve" ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/>
                      <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z"/>
                    </svg> Approving...
                  </span>
                ) : "✓ Approve"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Student Logs Tab ───────────────────────────────────────────────────────────
function StudentLogsTab() {
  const [selectedIntern, setSelectedIntern] = useState<number | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState<LogStatus | "All">("All");
  const [expandedLog, setExpandedLog] = useState<number | null>(null);
  const [approving, setApproving] = useState<number | null>(null);

  const logs = useMemo(() =>
    STUDENT_LOGS.filter(l =>
      (selectedIntern === "all" || l.internId === selectedIntern) &&
      (categoryFilter === "All" || l.category === categoryFilter) &&
      (statusFilter === "All" || l.status === statusFilter)
    ), [selectedIntern, categoryFilter, statusFilter]);

  const totalPending = STUDENT_LOGS.filter(l => l.status === "Pending").length;
  const totalFlagged = STUDENT_LOGS.filter(l => l.status === "Flagged").length;

  const handleApprove = async (logId: number) => {
    setApproving(logId);
    await new Promise(r => setTimeout(r, 700));
    setApproving(null);
  };

  return (
    <div className="space-y-5">
      {/* Alert bar */}
      {(totalPending > 0 || totalFlagged > 0) && (
        <div className="flex gap-3 flex-wrap">
          {totalPending > 0 && (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs font-bold text-amber-700">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              {totalPending} logs awaiting your review
            </div>
          )}
          {totalFlagged > 0 && (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-600">
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
              {totalFlagged} flagged logs need attention
            </div>
          )}
        </div>
      )}

      {/* Intern selector */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedIntern("all")}
          className={`text-xs font-bold px-3 py-2 rounded-xl border-2 transition-all duration-200 ${selectedIntern === "all" ? "border-indigo-400 bg-indigo-600 text-white" : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"}`}
        >
          All Interns
        </button>
        {INTERNS.map(intern => (
          <button
            key={intern.id}
            onClick={() => setSelectedIntern(intern.id)}
            className={`flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-xl border-2 transition-all duration-200 ${selectedIntern === intern.id ? "border-transparent text-white shadow-sm" : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"}`}
            style={selectedIntern === intern.id ? { background: `linear-gradient(135deg, ${intern.gradientFrom}, ${intern.gradientTo})` } : {}}
          >
            <div className={`w-4 h-4 rounded-md flex items-center justify-center text-[8px] font-black ${selectedIntern === intern.id ? "bg-white/20" : ""}`}
              style={selectedIntern !== intern.id ? { background: `linear-gradient(135deg, ${intern.gradientFrom}, ${intern.gradientTo})` } : {}}
            >
              <span className="text-white">{intern.initials[0]}</span>
            </div>
            {intern.name.split(" ")[0]}
          </button>
        ))}
      </div>

      {/* Filters row */}
      <div className="flex gap-2 flex-wrap items-center">
        <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl">
          {(["All", "Approved", "Pending", "Flagged"] as (LogStatus | "All")[]).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all duration-200 ${statusFilter === s ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}>
              {s}
            </button>
          ))}
        </div>
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer"
        >
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <span className="text-xs text-slate-400 ml-1">{logs.length} log{logs.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Logs list */}
      <div className="space-y-3">
        {logs.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <p className="text-3xl mb-2">📋</p>
            <p className="text-sm font-semibold">No logs match your filters</p>
          </div>
        ) : logs.map(log => {
          const intern = INTERNS.find(i => i.id === log.internId)!;
          const isExpanded = expandedLog === log.id;

          return (
            <div key={log.id}
              className={`bg-white rounded-2xl border-2 transition-all duration-200 overflow-hidden ${log.status === "Flagged" ? "border-rose-200" : log.status === "Pending" ? "border-amber-100" : "border-slate-100"} hover:shadow-md`}>
              {/* Card header */}
              <div
                className="flex items-center gap-4 p-4 cursor-pointer"
                onClick={() => setExpandedLog(isExpanded ? null : log.id)}
              >
                <Avatar intern={intern} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-black text-slate-800">{intern.name}</p>
                    <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-full">{log.category}</span>
                    <Badge status={log.status} type="log" />
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 font-semibold truncate">{log.activity}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{log.day}, {log.date}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <p className="text-xl font-black" style={{ color: intern.gradientFrom }}>{log.hoursWorked}</p>
                    <p className="text-[10px] text-slate-400 font-semibold">hours</p>
                  </div>
                  <svg className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Expanded */}
              {isExpanded && (
                <div className="border-t border-slate-100 bg-slate-50/50 p-4 space-y-3">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Activity Description</p>
                    <p className="text-sm text-slate-600 leading-relaxed">{log.description}</p>
                  </div>
                  {log.supervisorNote && (
                    <div className="bg-rose-50 border border-rose-200 rounded-xl p-3">
                      <p className="text-[10px] font-black text-rose-500 uppercase tracking-wider mb-1">⚑ Supervisor Note</p>
                      <p className="text-xs text-rose-700">{log.supervisorNote}</p>
                    </div>
                  )}
                  {log.status === "Pending" && (
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => handleApprove(log.id)}
                        disabled={approving === log.id}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white transition-all active:scale-95 disabled:opacity-60"
                        style={{ background: `linear-gradient(135deg, ${intern.gradientFrom}, ${intern.gradientTo})` }}
                      >
                        {approving === log.id ? "Approving..." : "✓ Approve Log"}
                      </button>
                      <button className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 transition-colors">
                        ⚑ Flag Log
                      </button>
                    </div>
                  )}
                  {log.status === "Flagged" && (
                    <button
                      onClick={() => handleApprove(log.id)}
                      disabled={approving === log.id}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white transition-all active:scale-95 disabled:opacity-60"
                      style={{ background: `linear-gradient(135deg, ${intern.gradientFrom}, ${intern.gradientTo})` }}
                    >
                      {approving === log.id ? "Approving..." : "✓ Approve Anyway"}
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Timesheets Tab ─────────────────────────────────────────────────────────────
function TimesheetsTab() {
  const [selectedIntern, setSelectedIntern] = useState<number | "all">("all");
  const [statusFilter, setStatusFilter] = useState<TimesheetStatus | "All">("All");
  const [activeModal, setActiveModal] = useState<TimesheetWeek | null>(null);
  const [localStatuses, setLocalStatuses] = useState<Record<number, TimesheetStatus>>({});

  const sheets = useMemo(() =>
    TIMESHEETS.filter(t =>
      (selectedIntern === "all" || t.internId === selectedIntern) &&
      (statusFilter === "All" || (localStatuses[t.id] || t.status) === statusFilter)
    ), [selectedIntern, statusFilter, localStatuses]);

  const pendingCount = TIMESHEETS.filter(t => (localStatuses[t.id] || t.status) === "Pending" || (localStatuses[t.id] || t.status) === "Under Review").length;

  const getStatus = (ts: TimesheetWeek): TimesheetStatus => localStatuses[ts.id] || ts.status;

  return (
    <div className="space-y-5">
      {pendingCount > 0 && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-indigo-50 border border-indigo-200 rounded-xl text-xs font-bold text-indigo-700 w-fit">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          {pendingCount} timesheets waiting for your approval
        </div>
      )}

      {/* Intern selector */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setSelectedIntern("all")}
          className={`text-xs font-bold px-3 py-2 rounded-xl border-2 transition-all duration-200 ${selectedIntern === "all" ? "border-indigo-400 bg-indigo-600 text-white" : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"}`}>
          All Interns
        </button>
        {INTERNS.map(intern => (
          <button key={intern.id} onClick={() => setSelectedIntern(intern.id)}
            className={`flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-xl border-2 transition-all duration-200 ${selectedIntern === intern.id ? "border-transparent text-white shadow-sm" : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"}`}
            style={selectedIntern === intern.id ? { background: `linear-gradient(135deg, ${intern.gradientFrom}, ${intern.gradientTo})` } : {}}>
            <div className="w-4 h-4 rounded-md flex items-center justify-center"
              style={selectedIntern !== intern.id ? { background: `linear-gradient(135deg, ${intern.gradientFrom}, ${intern.gradientTo})` } : { background: "rgba(255,255,255,0.2)" }}>
              <span className="text-white text-[8px] font-black">{intern.initials[0]}</span>
            </div>
            {intern.name.split(" ")[0]}
          </button>
        ))}
      </div>

      {/* Status filter */}
      <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl w-fit flex-wrap">
        {(["All", "Pending", "Under Review", "Approved", "Rejected"] as (TimesheetStatus | "All")[]).map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all duration-200 ${statusFilter === s ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}>
            {s}
          </button>
        ))}
      </div>

      {/* Timesheet cards */}
      <div className="space-y-4">
        {sheets.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <p className="text-3xl mb-2">🗓️</p>
            <p className="text-sm font-semibold">No timesheets match your filters</p>
          </div>
        ) : sheets.map(ts => {
          const intern = INTERNS.find(i => i.id === ts.internId)!;
          const status = getStatus(ts);
          const cfg = TS_STATUS_CFG[status];

          return (
            <div key={ts.id} className={`bg-white rounded-2xl border-2 overflow-hidden transition-all duration-200 hover:shadow-md ${cfg.rowBg} ${cfg.border}`}>
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <Avatar intern={intern} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between flex-wrap gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-black text-slate-800">{intern.name}</p>
                          <span className="text-[10px] bg-white border border-slate-200 text-slate-500 font-bold px-2 py-0.5 rounded-full">{ts.weekLabel}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{intern.department}</p>
                      </div>
                      <Badge status={status} type="ts" />
                    </div>

                    <div className="flex items-center gap-4 mt-2 flex-wrap">
                      <span className="text-xs text-slate-500"><span className="font-semibold">Period:</span> {ts.weekStart} – {ts.weekEnd}</span>
                      <span className="text-xs text-slate-500"><span className="font-semibold">Submitted:</span> {ts.submittedOn}</span>
                    </div>

                    {/* Mini day bars */}
                    <div className="flex items-end gap-1.5 mt-3 h-10">
                      {ts.days.map(d => {
                        const maxH = 8;
                        const pct = (d.hours / maxH) * 100;
                        return (
                          <div key={d.day} className="flex-1 flex flex-col items-center gap-0.5">
                            <div className="w-full rounded-sm overflow-hidden bg-slate-100" style={{ height: "28px", display: "flex", alignItems: "flex-end" }}>
                              <div className="w-full rounded-sm transition-all duration-500"
                                style={{ height: d.hours === 0 ? "2px" : `${pct}%`, background: d.hours === 0 ? "#fca5a5" : `linear-gradient(180deg, ${intern.gradientFrom}99, ${intern.gradientFrom})` }}
                              />
                            </div>
                            <span className="text-[8px] font-bold text-slate-400">{d.day}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Total hours */}
                  <div className="text-right shrink-0">
                    <p className="text-3xl font-black" style={{ color: intern.gradientFrom }}>{ts.totalHours}</p>
                    <p className="text-[10px] text-slate-400 font-semibold">total hours</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{(ts.totalHours / ts.days.length).toFixed(1)}h avg/day</p>
                  </div>
                </div>

                {ts.supervisorComment && (
                  <div className="mt-3 bg-white/70 rounded-xl border border-slate-100 px-3 py-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Supervisor Comment</p>
                    <p className="text-xs text-slate-600 italic">&quot;{ts.supervisorComment}&quot;</p>
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => setActiveModal(ts)}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white transition-all active:scale-95 shadow-sm hover:opacity-90"
                    style={{ background: `linear-gradient(135deg, ${intern.gradientFrom}, ${intern.gradientTo})` }}
                  >
                    {status === "Approved" || status === "Rejected" ? "📋 View Details" : "🔍 Review Timesheet"}
                  </button>
                  {status === "Pending" || status === "Under Review" ? (
                    <button
                      onClick={() => setLocalStatuses(p => ({ ...p, [ts.id]: "Approved" }))}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                    >
                      ✓ Quick Approve
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {activeModal && (() => {
        const intern = INTERNS.find(i => i.id === activeModal.internId)!;
        const tsWithStatus = { ...activeModal, status: getStatus(activeModal) };
        return (
          <TimesheetModal
            ts={tsWithStatus}
            intern={intern}
            onClose={() => setActiveModal(null)}
            onApprove={() => { setLocalStatuses(p => ({ ...p, [activeModal.id]: "Approved" })); setActiveModal(null); }}
            onReject={() => { setLocalStatuses(p => ({ ...p, [activeModal.id]: "Rejected" })); setActiveModal(null); }}
          />
        );
      })()}
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────────
export default function ProgressMonitoringPage() {
  const [activeTab, setActiveTab] = useState<TabType>("logs");

  const pendingLogs = STUDENT_LOGS.filter(l => l.status === "Pending" || l.status === "Flagged").length;
  const pendingSheets = TIMESHEETS.filter(t => t.status === "Pending" || t.status === "Under Review").length;

  const totalHours = INTERNS.reduce((a, i) => a + i.hoursCompleted, 0);
  const avgProgress = Math.round(INTERNS.reduce((a, i) => a + (i.hoursCompleted / i.hoursRequired) * 100, 0) / INTERNS.length);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap');
        * { font-family: 'Sora', sans-serif; }
        .page-enter { animation: pageEnter 0.45s ease forwards; }
        @keyframes pageEnter { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }
      `}</style>

      <div className="min-h-screen bg-[#f7f8fc] p-4 sm:p-6 page-enter">

        {/* ── Header ── */}
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-1">Supervisor · Progress Monitoring</p>
          <h1 className="text-2xl font-black text-slate-900">Progress Monitoring</h1>
          <p className="text-sm text-slate-400 mt-1">Track activity logs and review weekly timesheets for your interns</p>
        </div>

        {/* ── KPI Row ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Active Interns", value: INTERNS.length, icon: "🎓", col: "text-indigo-600", bg: "bg-indigo-50 border-indigo-100" },
            { label: "Total Hours Logged", value: `${totalHours}h`, icon: "⏱️", col: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
            { label: "Avg Progress", value: `${avgProgress}%`, icon: "📈", col: "text-sky-600", bg: "bg-sky-50 border-sky-100" },
            { label: "Pending Actions", value: pendingLogs + pendingSheets, icon: "⚠️", col: "text-amber-600", bg: "bg-amber-50 border-amber-100" },
          ].map(k => (
            <div key={k.label} className={`rounded-2xl border-2 p-4 ${k.bg}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-lg">{k.icon}</span>
              </div>
              <p className={`text-2xl font-black ${k.col}`}>{k.value}</p>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mt-0.5">{k.label}</p>
            </div>
          ))}
        </div>

        {/* ── Intern Progress Overview ── */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-6 shadow-sm">
          <p className="text-xs font-black text-slate-600 uppercase tracking-wider mb-4">Intern Hours Overview</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {INTERNS.map(intern => (
              <div key={intern.id} className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Avatar intern={intern} size="sm" />
                  <p className="text-xs font-bold text-slate-700 truncate">{intern.name.split(" ")[0]}</p>
                </div>
                <HoursBar completed={intern.hoursCompleted} required={intern.hoursRequired} color={intern.gradientFrom} />
              </div>
            ))}
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {([
            { key: "logs" as TabType, label: "Student Logs", icon: "📓", pending: pendingLogs },
            { key: "timesheets" as TabType, label: "Timesheets Review", icon: "🗓️", pending: pendingSheets },
          ]).map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-3 px-5 py-3 rounded-2xl border-2 text-sm font-bold transition-all duration-200 ${
                activeTab === tab.key
                  ? "border-indigo-400 bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
              {tab.pending > 0 && (
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${activeTab === tab.key ? "bg-white/20 text-white" : "bg-rose-100 text-rose-600"}`}>
                  {tab.pending}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Tab Content ── */}
        {activeTab === "logs" ? <StudentLogsTab /> : <TimesheetsTab />}

        {/* ── Footer ── */}
        <p className="text-center text-[11px] text-slate-300 py-6 font-mono">
          Internship Supervision System · Academic Year 2025–2026
        </p>
      </div>
    </>
  );
}