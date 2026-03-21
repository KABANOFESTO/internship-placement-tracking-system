"use client";

import { useState, useMemo } from "react";

// ─── Types ─────────────────────────────────────────────────────────────────────
type TabType = "submitted" | "feedback";
type ReportType = "Weekly" | "Monthly" | "Final";
type ReportStatus = "Pending Review" | "Reviewed" | "Needs Revision" | "Approved" | "Resubmitted";
type FeedbackRating = 1 | 2 | 3 | 4 | 5;

interface Intern {
    id: number;
    name: string;
    initials: string;
    department: string;
    program: string;
    gradientFrom: string;
    gradientTo: string;
}

interface Report {
    id: number;
    internId: number;
    title: string;
    type: ReportType;
    submittedOn: string;
    dueDate: string;
    pages: number;
    wordCount: number;
    status: ReportStatus;
    version: number;
    similarityScore?: number;
    summary: string;
    hasFeedback: boolean;
    feedbackDate?: string;
}

interface FeedbackForm {
    rating: FeedbackRating | null;
    overallComment: string;
    contentQuality: string;
    writingStyle: string;
    recommendations: string;
    requiresRevision: boolean;
    submitted: boolean;
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const INTERNS: Intern[] = [
    { id: 1, name: "Amara Nkosi", initials: "AN", department: "Software Dev Unit", program: "BSc. Software Engineering", gradientFrom: "#6366f1", gradientTo: "#8b5cf6" },
    { id: 2, name: "Kwame Asante", initials: "KA", department: "Analytics & Research", program: "BSc. Data Science", gradientFrom: "#f43f5e", gradientTo: "#fb923c" },
    { id: 3, name: "Fatima Al-Rashid", initials: "FA", department: "Digital Product Design", program: "BSc. UI/UX Design", gradientFrom: "#0ea5e9", gradientTo: "#06b6d4" },
    { id: 4, name: "Diego Morales", initials: "DM", department: "Backend Engineering", program: "BSc. Computer Science", gradientFrom: "#10b981", gradientTo: "#059669" },
    { id: 5, name: "Nadine Uwase", initials: "NU", department: "Medical Records & HIS", program: "BSc. Health Informatics", gradientFrom: "#f59e0b", gradientTo: "#d97706" },
];

const REPORTS: Report[] = [
    { id: 1, internId: 1, title: "Week 10 Progress Report", type: "Weekly", submittedOn: "Mar 21, 2025", dueDate: "Mar 21, 2025", pages: 4, wordCount: 1240, status: "Pending Review", version: 1, similarityScore: 4, summary: "Covers OAuth2 implementation, database optimization, and upcoming sprint goals for Q2.", hasFeedback: false },
    { id: 2, internId: 1, title: "Week 9 Progress Report", type: "Weekly", submittedOn: "Mar 14, 2025", dueDate: "Mar 14, 2025", pages: 3, wordCount: 980, status: "Approved", version: 1, similarityScore: 3, summary: "Details auth module completion, unit tests and documentation review.", hasFeedback: true, feedbackDate: "Mar 16, 2025" },
    { id: 3, internId: 1, title: "February Monthly Report", type: "Monthly", submittedOn: "Mar 3, 2025", dueDate: "Mar 3, 2025", pages: 12, wordCount: 4200, status: "Approved", version: 1, similarityScore: 7, summary: "Full-month summary of the backend API module build, testing strategy and team collaboration.", hasFeedback: true, feedbackDate: "Mar 5, 2025" },
    { id: 4, internId: 2, title: "Week 10 Progress Report", type: "Weekly", submittedOn: "Mar 21, 2025", dueDate: "Mar 21, 2025", pages: 2, wordCount: 610, status: "Needs Revision", version: 1, similarityScore: 22, summary: "Data cleaning pipeline and preliminary EDA on appointment records dataset.", hasFeedback: true, feedbackDate: "Mar 22, 2025" },
    { id: 5, internId: 2, title: "Week 9 Progress Report", type: "Weekly", submittedOn: "Mar 17, 2025", dueDate: "Mar 14, 2025", pages: 2, wordCount: 540, status: "Needs Revision", version: 1, similarityScore: 18, summary: "SQL query writing and initial data visualization drafts.", hasFeedback: true, feedbackDate: "Mar 18, 2025" },
    { id: 6, internId: 3, title: "Week 10 Progress Report", type: "Weekly", submittedOn: "Mar 21, 2025", dueDate: "Mar 21, 2025", pages: 5, wordCount: 1580, status: "Pending Review", version: 1, similarityScore: 5, summary: "Usability testing sessions, participant feedback synthesis, and revised prototype changelog.", hasFeedback: false },
    { id: 7, internId: 3, title: "February Monthly Report", type: "Monthly", submittedOn: "Mar 3, 2025", dueDate: "Mar 3, 2025", pages: 10, wordCount: 3800, status: "Reviewed", version: 2, similarityScore: 6, summary: "Complete design process documentation, wireframes evolution, and stakeholder presentation outcomes.", hasFeedback: true, feedbackDate: "Mar 6, 2025" },
    { id: 8, internId: 4, title: "Week 10 Progress Report", type: "Weekly", submittedOn: "Mar 20, 2025", dueDate: "Mar 21, 2025", pages: 6, wordCount: 1920, status: "Pending Review", version: 1, similarityScore: 2, summary: "Kubernetes deployment, CI/CD pipeline configuration and performance benchmarking results.", hasFeedback: false },
    { id: 9, internId: 4, title: "Week 9 Progress Report", type: "Weekly", submittedOn: "Mar 14, 2025", dueDate: "Mar 14, 2025", pages: 5, wordCount: 1670, status: "Approved", version: 1, similarityScore: 3, summary: "Microservices architecture design and API gateway configuration.", hasFeedback: true, feedbackDate: "Mar 15, 2025" },
    { id: 10, internId: 4, title: "Final Internship Report (Draft)", type: "Final", submittedOn: "Mar 18, 2025", dueDate: "Apr 5, 2025", pages: 32, wordCount: 11400, status: "Resubmitted", version: 2, similarityScore: 9, summary: "Comprehensive final report covering full project lifecycle, technical achievements, and personal reflections.", hasFeedback: false },
    { id: 11, internId: 5, title: "Week 10 Progress Report", type: "Weekly", submittedOn: "Mar 21, 2025", dueDate: "Mar 21, 2025", pages: 4, wordCount: 1310, status: "Pending Review", version: 1, similarityScore: 8, summary: "FHIR R4 resource implementation, integration testing and data migration scripts.", hasFeedback: false },
    { id: 12, internId: 5, title: "February Monthly Report", type: "Monthly", submittedOn: "Mar 2, 2025", dueDate: "Mar 3, 2025", pages: 9, wordCount: 3200, status: "Approved", version: 1, similarityScore: 6, summary: "Health informatics systems integration overview and compliance testing outcomes.", hasFeedback: true, feedbackDate: "Mar 4, 2025" },
];

// ─── Config ────────────────────────────────────────────────────────────────────
const STATUS_CFG: Record<ReportStatus, { bg: string; text: string; border: string; dot: string; icon: string }> = {
    "Pending Review": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-400", icon: "⏳" },
    "Reviewed": { bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-200", dot: "bg-sky-500", icon: "👁" },
    "Needs Revision": { bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-200", dot: "bg-rose-400", icon: "✎" },
    "Approved": { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500", icon: "✓" },
    "Resubmitted": { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200", dot: "bg-violet-500", icon: "↺" },
};

const TYPE_CFG: Record<ReportType, { bg: string; text: string; icon: string }> = {
    "Weekly": { bg: "bg-indigo-50", text: "text-indigo-600", icon: "📄" },
    "Monthly": { bg: "bg-teal-50", text: "text-teal-600", icon: "📑" },
    "Final": { bg: "bg-orange-50", text: "text-orange-600", icon: "📘" },
};

const RATING_CFG: Record<FeedbackRating, { label: string; color: string; bg: string; emoji: string }> = {
    1: { label: "Poor", color: "text-rose-600", bg: "bg-rose-500", emoji: "😞" },
    2: { label: "Fair", color: "text-orange-500", bg: "bg-orange-400", emoji: "😐" },
    3: { label: "Good", color: "text-amber-500", bg: "bg-amber-400", emoji: "🙂" },
    4: { label: "Very Good", color: "text-sky-600", bg: "bg-sky-500", emoji: "😊" },
    5: { label: "Excellent", color: "text-emerald-600", bg: "bg-emerald-500", emoji: "🌟" },
};

function getSimilarityColor(score: number) {
    if (score <= 10) return { text: "text-emerald-600", bg: "bg-emerald-100", label: "Low" };
    if (score <= 20) return { text: "text-amber-600", bg: "bg-amber-100", label: "Medium" };
    return { text: "text-rose-600", bg: "bg-rose-100", label: "High" };
}

// ─── Avatar ────────────────────────────────────────────────────────────────────
function Avatar({ intern, size = "md" }: { intern: Intern; size?: "sm" | "md" | "lg" }) {
    const sz = size === "sm" ? "w-8 h-8 text-[10px]" : size === "lg" ? "w-14 h-14 text-lg" : "w-10 h-10 text-xs";
    return (
        <div className={`${sz} rounded-xl flex items-center justify-center text-white font-black shrink-0 shadow-sm`}
            style={{ background: `linear-gradient(135deg, ${intern.gradientFrom}, ${intern.gradientTo})` }}>
            {intern.initials}
        </div>
    );
}

// ─── Status Badge ──────────────────────────────────────────────────────────────
function Badge({ status }: { status: ReportStatus }) {
    const c = STATUS_CFG[status];
    return (
        <span className={`inline-flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1 rounded-full border ${c.bg} ${c.text} ${c.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
            {status}
        </span>
    );
}

// ─── Feedback Modal ────────────────────────────────────────────────────────────
function FeedbackModal({
    report, intern, onClose, onSubmitted,
}: {
    report: Report; intern: Intern;
    onClose: () => void; onSubmitted: (reportId: number) => void;
}) {
    const isReadOnly = report.hasFeedback;
    const [form, setForm] = useState<FeedbackForm>({
        rating: isReadOnly ? 4 : null,
        overallComment: isReadOnly
            ? "The report demonstrates solid understanding of the project scope. The technical depth is commendable and the writing is clear and well-structured. Please expand the challenges section in future reports."
            : "",
        contentQuality: isReadOnly ? "Content is well-organized with relevant technical details. Include more quantitative results." : "",
        writingStyle: isReadOnly ? "Writing is clear and professional. Minor grammatical issues noted in section 3." : "",
        recommendations: isReadOnly ? "Expand the challenges section. Add more diagrams for system architecture." : "",
        requiresRevision: false,
        submitted: isReadOnly,
    });
    const [saving, setSaving] = useState(false);
    const [draftSaved, setDraftSaved] = useState(false);

    const canSubmit = !form.submitted && form.rating !== null && form.overallComment.trim().length > 15;

    const handleSubmit = async () => {
        setSaving(true);
        await new Promise(r => setTimeout(r, 1100));
        setSaving(false);
        setForm(f => ({ ...f, submitted: true }));
        onSubmitted(report.id);
    };

    const handleDraft = () => {
        setDraftSaved(true);
        setTimeout(() => setDraftSaved(false), 2000);
    };

    const tc = TYPE_CFG[report.type];
    const sim = getSimilarityColor(report.similarityScore ?? 0);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="relative overflow-hidden text-white p-6 shrink-0"
                    style={{ background: `linear-gradient(135deg, ${intern.gradientFrom}, ${intern.gradientTo})` }}>
                    <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10" />
                    <div className="absolute -bottom-12 left-8 w-36 h-36 rounded-full bg-white/10" />
                    <div className="relative flex items-start justify-between gap-3">
                        <div className="flex items-start gap-4">
                            <Avatar intern={intern} size="lg" />
                            <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h2 className="text-lg font-black">{intern.name}</h2>
                                    <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-bold backdrop-blur-sm">
                                        {tc.icon} {report.type} Report
                                    </span>
                                </div>
                                <p className="text-sm text-white/80 mt-0.5 leading-snug">{report.title}</p>
                                <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                                    <span className="text-xs text-white/60">Submitted: {report.submittedOn}</span>
                                    <span className="text-xs text-white/60">{report.pages} pages · {report.wordCount.toLocaleString()} words</span>
                                    {report.version > 1 && <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-bold">v{report.version}</span>}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full font-bold">
                                {form.submitted ? "✓ Feedback Given" : isReadOnly ? "Viewing" : "Give Feedback"}
                            </span>
                            <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center text-white font-bold text-xl transition-colors">×</button>
                        </div>
                    </div>

                    {/* Stats row */}
                    <div className="relative flex gap-4 mt-4 flex-wrap">
                        <div className="bg-white/15 backdrop-blur-sm rounded-xl px-3 py-2 text-center">
                            <p className="text-base font-black">{report.pages}</p>
                            <p className="text-[10px] text-white/70 font-semibold">Pages</p>
                        </div>
                        <div className="bg-white/15 backdrop-blur-sm rounded-xl px-3 py-2 text-center">
                            <p className="text-base font-black">{report.wordCount.toLocaleString()}</p>
                            <p className="text-[10px] text-white/70 font-semibold">Words</p>
                        </div>
                        <div className={`backdrop-blur-sm rounded-xl px-3 py-2 text-center ${report.similarityScore! > 20 ? "bg-rose-500/30" : "bg-white/15"}`}>
                            <p className="text-base font-black">{report.similarityScore}%</p>
                            <p className="text-[10px] text-white/70 font-semibold">Similarity</p>
                        </div>
                        <div className="bg-white/15 backdrop-blur-sm rounded-xl px-3 py-2 text-center">
                            <p className="text-base font-black">v{report.version}</p>
                            <p className="text-[10px] text-white/70 font-semibold">Version</p>
                        </div>
                    </div>
                </div>

                {/* Report Summary Strip */}
                <div className="bg-slate-50 border-b border-slate-100 px-6 py-3 shrink-0">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Report Summary</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{report.summary}</p>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-5">

                    {/* Rating */}
                    <div>
                        <p className="text-xs font-black text-slate-600 uppercase tracking-wider mb-3">Overall Rating <span className="text-rose-400">*</span></p>
                        <div className="grid grid-cols-5 gap-2">
                            {([1, 2, 3, 4, 5] as FeedbackRating[]).map(r => {
                                const rc = RATING_CFG[r];
                                const active = form.rating === r;
                                return (
                                    <button
                                        key={r}
                                        onClick={() => !form.submitted && setForm(f => ({ ...f, rating: r }))}
                                        disabled={form.submitted}
                                        className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all duration-200 ${active
                                                ? `border-transparent shadow-md scale-105 text-white`
                                                : form.submitted
                                                    ? "border-slate-100 bg-slate-50 cursor-default"
                                                    : "border-slate-200 bg-white hover:border-slate-300 hover:scale-102"
                                            }`}
                                        style={active ? { background: `linear-gradient(135deg, ${intern.gradientFrom}, ${intern.gradientTo})` } : {}}
                                    >
                                        <span className="text-2xl">{rc.emoji}</span>
                                        <span className={`text-[10px] font-black ${active ? "text-white" : rc.color}`}>{rc.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-2">
                        <div className="h-px flex-1 bg-slate-100" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 px-2">Written Feedback</p>
                        <div className="h-px flex-1 bg-slate-100" />
                    </div>

                    {/* Overall comment */}
                    <div>
                        <label className="text-xs font-bold text-slate-600 mb-1.5 block">Overall Comments <span className="text-rose-400">*</span></label>
                        <textarea
                            value={form.overallComment}
                            onChange={e => setForm(f => ({ ...f, overallComment: e.target.value }))}
                            disabled={form.submitted}
                            rows={4}
                            placeholder="Provide a comprehensive assessment of this report's quality, coverage, and alignment with internship objectives..."
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent resize-none disabled:bg-slate-50 disabled:text-slate-500 transition"
                        />
                        <div className="flex justify-end mt-1">
                            <span className="text-[10px] text-slate-300">{form.overallComment.length} characters</span>
                        </div>
                    </div>

                    {/* 2-col fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-slate-600 mb-1.5 block">Content & Technical Quality</label>
                            <textarea
                                value={form.contentQuality}
                                onChange={e => setForm(f => ({ ...f, contentQuality: e.target.value }))}
                                disabled={form.submitted}
                                rows={3}
                                placeholder="Comment on technical depth, accuracy, and completeness..."
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none disabled:bg-slate-50 disabled:text-slate-500 transition"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-600 mb-1.5 block">Writing Style & Presentation</label>
                            <textarea
                                value={form.writingStyle}
                                onChange={e => setForm(f => ({ ...f, writingStyle: e.target.value }))}
                                disabled={form.submitted}
                                rows={3}
                                placeholder="Evaluate clarity, structure, grammar and formatting..."
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none disabled:bg-slate-50 disabled:text-slate-500 transition"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-600 mb-1.5 block">Recommendations for Improvement</label>
                        <textarea
                            value={form.recommendations}
                            onChange={e => setForm(f => ({ ...f, recommendations: e.target.value }))}
                            disabled={form.submitted}
                            rows={3}
                            placeholder="Specific actionable recommendations for the next report..."
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none disabled:bg-slate-50 disabled:text-slate-500 transition"
                        />
                    </div>

                    {/* Requires revision toggle */}
                    {!form.submitted && (
                        <div className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${form.requiresRevision ? "border-rose-300 bg-rose-50" : "border-slate-200 bg-white hover:border-slate-300"}`}
                            onClick={() => setForm(f => ({ ...f, requiresRevision: !f.requiresRevision }))}>
                            <div>
                                <p className="text-sm font-bold text-slate-700">Request Revision</p>
                                <p className="text-xs text-slate-400 mt-0.5">Intern will be notified to resubmit this report</p>
                            </div>
                            <div className={`w-12 h-6 rounded-full transition-colors duration-200 relative ${form.requiresRevision ? "bg-rose-500" : "bg-slate-200"}`}>
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${form.requiresRevision ? "translate-x-7" : "translate-x-1"}`} />
                            </div>
                        </div>
                    )}

                    {form.submitted && form.requiresRevision && (
                        <div className="flex items-center gap-3 p-3 bg-rose-50 border border-rose-200 rounded-xl">
                            <span className="text-rose-500 text-lg">✎</span>
                            <p className="text-xs font-semibold text-rose-700">Revision requested — intern has been notified.</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-slate-100 px-6 py-4 shrink-0 bg-slate-50/80 flex items-center justify-between gap-3">
                    <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-500 bg-white border border-slate-200 hover:bg-slate-100 transition-colors">
                        {form.submitted ? "Close" : "Cancel"}
                    </button>
                    {!form.submitted && (
                        <div className="flex gap-2">
                            <button onClick={handleDraft}
                                className="px-5 py-2.5 rounded-xl text-sm font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 transition-colors">
                                {draftSaved ? "✓ Saved" : "Save Draft"}
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={!canSubmit || saving}
                                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200 active:scale-95 shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
                                style={{ background: canSubmit ? `linear-gradient(135deg, ${intern.gradientFrom}, ${intern.gradientTo})` : "#94a3b8" }}
                            >
                                {saving ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                                            <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z" />
                                        </svg> Submitting...
                                    </span>
                                ) : "Submit Feedback"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Report Card ───────────────────────────────────────────────────────────────
function ReportCard({
    report, intern, onFeedback, highlight,
}: {
    report: Report; intern: Intern;
    onFeedback: () => void; highlight?: boolean;
}) {
    const sc = STATUS_CFG[report.status];
    const tc = TYPE_CFG[report.type];
    const sim = getSimilarityColor(report.similarityScore ?? 0);
    const needsAction = report.status === "Pending Review" || report.status === "Resubmitted";

    return (
        <div className={`bg-white rounded-2xl border-2 transition-all duration-200 hover:shadow-lg group overflow-hidden ${highlight ? "border-indigo-300 shadow-md shadow-indigo-100" :
                needsAction ? "border-amber-200" :
                    report.status === "Needs Revision" ? "border-rose-200" :
                        "border-slate-100 hover:border-slate-200"
            }`}>
            {/* Top accent line */}
            <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${intern.gradientFrom}, ${intern.gradientTo})` }} />

            <div className="p-5">
                {/* Header row */}
                <div className="flex items-start gap-3">
                    <Avatar intern={intern} />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-black text-slate-800 leading-snug">{report.title}</p>
                                <p className="text-xs text-slate-400 mt-0.5 truncate">{intern.name} · {intern.department}</p>
                            </div>
                            <Badge status={report.status} />
                        </div>
                    </div>
                </div>

                {/* Meta chips */}
                <div className="flex flex-wrap gap-2 mt-3">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${tc.bg} ${tc.text}`}>
                        {tc.icon} {report.type}
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">
                        📄 {report.pages}p · {report.wordCount.toLocaleString()}w
                    </span>
                    {report.version > 1 && (
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-violet-50 text-violet-600">
                            ↺ Version {report.version}
                        </span>
                    )}
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${sim.bg} ${sim.text}`}>
                        🔍 {report.similarityScore}% match
                    </span>
                </div>

                {/* Summary */}
                <p className="text-xs text-slate-500 mt-3 leading-relaxed line-clamp-2">{report.summary}</p>

                {/* Date row */}
                <div className="flex items-center justify-between mt-3 text-[10px] text-slate-400">
                    <span>Submitted: <span className="font-semibold text-slate-500">{report.submittedOn}</span></span>
                    <span>Due: <span className="font-semibold text-slate-500">{report.dueDate}</span></span>
                    {report.hasFeedback && report.feedbackDate && (
                        <span className="text-emerald-500 font-semibold">✓ Feedback: {report.feedbackDate}</span>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                    <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
                        ⬇ Download
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
                        👁 Preview
                    </button>
                    <button
                        onClick={onFeedback}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 ${report.hasFeedback
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                                : "text-white shadow-sm hover:opacity-90"
                            }`}
                        style={!report.hasFeedback ? { background: `linear-gradient(135deg, ${intern.gradientFrom}, ${intern.gradientTo})` } : {}}
                    >
                        {report.hasFeedback ? "✓ View Feedback" : needsAction ? "📝 Give Feedback" : "📝 Add Feedback"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Submitted Reports Tab ─────────────────────────────────────────────────────
function SubmittedReportsTab({
    reports, onFeedback, highlightId,
}: {
    reports: Report[]; onFeedback: (r: Report) => void; highlightId?: number;
}) {
    const [internFilter, setInternFilter] = useState<number | "all">("all");
    const [typeFilter, setTypeFilter] = useState<ReportType | "All">("All");
    const [statusFilter, setStatusFilter] = useState<ReportStatus | "All">("All");
    const [search, setSearch] = useState("");

    const filtered = useMemo(() => reports.filter(r =>
        (internFilter === "all" || r.internId === internFilter) &&
        (typeFilter === "All" || r.type === typeFilter) &&
        (statusFilter === "All" || r.status === statusFilter) &&
        (search === "" || r.title.toLowerCase().includes(search.toLowerCase()))
    ), [reports, internFilter, typeFilter, statusFilter, search]);

    const pendingCount = reports.filter(r => r.status === "Pending Review" || r.status === "Resubmitted").length;

    return (
        <div className="space-y-5">
            {pendingCount > 0 && (
                <div className="flex items-center gap-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl w-fit">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <p className="text-xs font-bold text-amber-700">{pendingCount} report{pendingCount > 1 ? "s" : ""} awaiting your review</p>
                </div>
            )}

            {/* Search */}
            <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search reports by title..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
                />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-start">
                {/* Intern pills */}
                <div className="flex gap-1.5 flex-wrap">
                    <button onClick={() => setInternFilter("all")}
                        className={`text-xs font-bold px-3 py-2 rounded-xl border-2 transition-all duration-200 ${internFilter === "all" ? "border-indigo-400 bg-indigo-600 text-white" : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"}`}>
                        All
                    </button>
                    {INTERNS.map(intern => (
                        <button key={intern.id} onClick={() => setInternFilter(intern.id)}
                            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border-2 transition-all duration-200 ${internFilter === intern.id ? "border-transparent text-white" : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"}`}
                            style={internFilter === intern.id ? { background: `linear-gradient(135deg, ${intern.gradientFrom}, ${intern.gradientTo})` } : {}}>
                            <span>{intern.name.split(" ")[0]}</span>
                        </button>
                    ))}
                </div>

                {/* Type + Status */}
                <div className="flex gap-2 flex-wrap">
                    <select value={typeFilter} onChange={e => setTypeFilter(e.target.value as ReportType | "All")}
                        className="text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer">
                        <option value="All">All Types</option>
                        {(["Weekly", "Monthly", "Final"] as ReportType[]).map(t => <option key={t}>{t}</option>)}
                    </select>
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as ReportStatus | "All")}
                        className="text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer">
                        <option value="All">All Status</option>
                        {(["Pending Review", "Reviewed", "Needs Revision", "Approved", "Resubmitted"] as ReportStatus[]).map(s => <option key={s}>{s}</option>)}
                    </select>
                    <span className="self-center text-xs text-slate-400 ml-1">{filtered.length} report{filtered.length !== 1 ? "s" : ""}</span>
                </div>
            </div>

            {/* Report Grid */}
            {filtered.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                    <p className="text-4xl mb-3">📭</p>
                    <p className="text-sm font-semibold">No reports match your filters</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {filtered.map(report => {
                        const intern = INTERNS.find(i => i.id === report.internId)!;
                        return (
                            <ReportCard
                                key={report.id}
                                report={report}
                                intern={intern}
                                onFeedback={() => onFeedback(report)}
                                highlight={report.id === highlightId}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}

// ─── Provide Feedback Tab ──────────────────────────────────────────────────────
function ProvideFeedbackTab({ reports, onFeedback }: { reports: Report[]; onFeedback: (r: Report) => void }) {
    const awaitingFeedback = reports.filter(r => !r.hasFeedback);
    const givenFeedback = reports.filter(r => r.hasFeedback);

    return (
        <div className="space-y-6">
            {/* Awaiting feedback */}
            <div>
                <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                        <h3 className="text-sm font-black text-slate-800">Awaiting Feedback</h3>
                    </div>
                    <span className="text-xs font-black bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">{awaitingFeedback.length}</span>
                </div>

                {awaitingFeedback.length === 0 ? (
                    <div className="text-center py-8 bg-emerald-50 border border-emerald-200 rounded-2xl">
                        <p className="text-3xl mb-2">🎉</p>
                        <p className="text-sm font-bold text-emerald-700">All reports have received feedback!</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {awaitingFeedback.map(report => {
                            const intern = INTERNS.find(i => i.id === report.internId)!;
                            const tc = TYPE_CFG[report.type];
                            const sc = STATUS_CFG[report.status];
                            return (
                                <div key={report.id}
                                    className={`bg-white rounded-2xl border-2 p-4 flex items-center gap-4 transition-all duration-200 hover:shadow-md ${report.status === "Resubmitted" ? "border-violet-200" : "border-amber-200"
                                        }`}>
                                    <Avatar intern={intern} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-black text-slate-800 truncate">{report.title}</p>
                                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                                            <span className="text-xs text-slate-400">{intern.name}</span>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tc.bg} ${tc.text}`}>{tc.icon} {report.type}</span>
                                            <Badge status={report.status} />
                                        </div>
                                        <p className="text-[10px] text-slate-400 mt-0.5">Due: {report.dueDate} · Submitted: {report.submittedOn}</p>
                                    </div>
                                    <button
                                        onClick={() => onFeedback(report)}
                                        className="shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-all active:scale-95 shadow-sm hover:opacity-90"
                                        style={{ background: `linear-gradient(135deg, ${intern.gradientFrom}, ${intern.gradientTo})` }}
                                    >
                                        📝 Give Feedback
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Given feedback history */}
            <div>
                <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <h3 className="text-sm font-black text-slate-800">Feedback History</h3>
                    </div>
                    <span className="text-xs font-black bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full">{givenFeedback.length}</span>
                </div>
                <div className="space-y-3">
                    {givenFeedback.map(report => {
                        const intern = INTERNS.find(i => i.id === report.internId)!;
                        const tc = TYPE_CFG[report.type];
                        return (
                            <div key={report.id} className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-4 hover:shadow-sm transition-all duration-200 opacity-80 hover:opacity-100">
                                <Avatar intern={intern} size="sm" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-700 truncate">{report.title}</p>
                                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                        <span className="text-xs text-slate-400">{intern.name}</span>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tc.bg} ${tc.text}`}>{tc.icon} {report.type}</span>
                                        <span className="text-[10px] text-emerald-500 font-semibold">✓ Feedback given {report.feedbackDate}</span>
                                    </div>
                                </div>
                                <button onClick={() => onFeedback(report)}
                                    className="shrink-0 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">
                                    View
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function ReportsReviewPage() {
    const [activeTab, setActiveTab] = useState<TabType>("submitted");
    const [modalReport, setModalReport] = useState<Report | null>(null);
    const [reports, setReports] = useState<Report[]>(REPORTS);
    const [highlightId, setHighlightId] = useState<number | undefined>();

    const pendingReview = reports.filter(r => r.status === "Pending Review" || r.status === "Resubmitted").length;
    const noFeedback = reports.filter(r => !r.hasFeedback).length;
    const approved = reports.filter(r => r.status === "Approved").length;
    const needsRevision = reports.filter(r => r.status === "Needs Revision").length;

    const handleFeedbackSubmitted = (reportId: number) => {
        setReports(prev => prev.map(r => r.id === reportId ? { ...r, hasFeedback: true, feedbackDate: "Mar 21, 2025", status: "Reviewed" as ReportStatus } : r));
        setModalReport(null);
        setHighlightId(reportId);
        setTimeout(() => setHighlightId(undefined), 3000);
    };

    const openFeedback = (report: Report) => {
        setModalReport(report);
        if (activeTab !== "submitted") setActiveTab("submitted");
    };

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap');
        * { font-family: 'Sora', sans-serif; }
        .page-enter { animation: pageEnter 0.4s ease forwards; }
        @keyframes pageEnter { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

            <div className="min-h-screen bg-[#f7f8fc] p-4 sm:p-6 page-enter">

                {/* ── Header ── */}
                <div className="mb-6">
                    <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-1">Supervisor · Reports Center</p>
                    <h1 className="text-2xl font-black text-slate-900">Reports Review</h1>
                    <p className="text-sm text-slate-400 mt-1">Review submitted reports and provide structured feedback to your interns</p>
                </div>

                {/* ── KPI Row ── */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    {[
                        { label: "Total Reports", value: reports.length, icon: "📚", col: "text-indigo-600", bg: "bg-indigo-50 border-indigo-100" },
                        { label: "Pending Review", value: pendingReview, icon: "⏳", col: "text-amber-600", bg: "bg-amber-50 border-amber-100" },
                        { label: "Needs Feedback", value: noFeedback, icon: "📝", col: "text-rose-600", bg: "bg-rose-50 border-rose-100" },
                        { label: "Approved", value: approved, icon: "✓", col: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
                    ].map(k => (
                        <div key={k.label} className={`rounded-2xl border-2 p-4 ${k.bg}`}>
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xl">{k.icon}</span>
                            </div>
                            <p className={`text-3xl font-black ${k.col}`}>{k.value}</p>
                            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mt-0.5">{k.label}</p>
                        </div>
                    ))}
                </div>

                {/* ── Type distribution ── */}
                <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-6 shadow-sm">
                    <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-3">Report Distribution</p>
                    <div className="flex gap-4 flex-wrap">
                        {(["Weekly", "Monthly", "Final"] as ReportType[]).map(type => {
                            const count = reports.filter(r => r.type === type).length;
                            const tc = TYPE_CFG[type];
                            const pct = Math.round((count / reports.length) * 100);
                            return (
                                <div key={type} className="flex items-center gap-3 flex-1 min-w-32">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${tc.bg}`}>{tc.icon}</div>
                                    <div className="flex-1">
                                        <div className="flex justify-between mb-1">
                                            <span className={`text-xs font-bold ${tc.text}`}>{type}</span>
                                            <span className="text-xs font-black text-slate-700">{count}</span>
                                        </div>
                                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: `${tc.text.replace("text-", "").includes("indigo") ? "#6366f1" : tc.text.replace("text-", "").includes("teal") ? "#14b8a6" : "#f97316"}` }} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ── Tabs ── */}
                <div className="flex gap-3 mb-6 flex-wrap">
                    {[
                        { key: "submitted" as TabType, label: "Submitted Reports", icon: "📋", badge: pendingReview },
                        { key: "feedback" as TabType, label: "Provide Feedback", icon: "💬", badge: noFeedback },
                    ].map(tab => (
                        <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                            className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl border-2 text-sm font-bold transition-all duration-200 ${activeTab === tab.key
                                    ? "border-indigo-400 bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                                }`}>
                            <span>{tab.icon}</span>
                            {tab.label}
                            {tab.badge > 0 && (
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${activeTab === tab.key ? "bg-white/20 text-white" : "bg-rose-100 text-rose-600"}`}>
                                    {tab.badge}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* ── Tab Content ── */}
                {activeTab === "submitted"
                    ? <SubmittedReportsTab reports={reports} onFeedback={r => setModalReport(r)} highlightId={highlightId} />
                    : <ProvideFeedbackTab reports={reports} onFeedback={r => { setModalReport(r); }} />
                }

                <p className="text-center text-[11px] text-slate-300 py-6 font-mono">
                    Internship Supervision System · Academic Year 2025–2026
                </p>
            </div>

            {/* ── Feedback Modal ── */}
            {modalReport && (() => {
                const intern = INTERNS.find(i => i.id === modalReport.internId)!;
                return (
                    <FeedbackModal
                        report={modalReport}
                        intern={intern}
                        onClose={() => setModalReport(null)}
                        onSubmitted={handleFeedbackSubmitted}
                    />
                );
            })()}
        </>
    );
}