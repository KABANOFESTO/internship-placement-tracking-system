"use client";

import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type EvalType = "midterm" | "final";
type EvalStatus = "Pending" | "In Progress" | "Submitted" | "Due Soon" | "Overdue";
type RatingLevel = 1 | 2 | 3 | 4 | 5;

interface Intern {
    id: number;
    name: string;
    initials: string;
    studentId: string;
    program: string;
    department: string;
    gradientFrom: string;
    gradientTo: string;
    midterm: EvalStatus;
    final: EvalStatus;
    midtermScore?: number;
    finalScore?: number;
    midtermDue: string;
    finalDue: string;
}

interface Criterion {
    id: string;
    category: string;
    label: string;
    description: string;
    weight: number;
}

interface EvalFormState {
    ratings: Record<string, RatingLevel>;
    feedback: string;
    strengths: string;
    improvements: string;
    recommendation: string;
    submitted: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const INTERNS: Intern[] = [
    {
        id: 1, name: "Amara Nkosi", initials: "AN", studentId: "STU-2024-001",
        program: "BSc. Software Engineering", department: "Software Development Unit",
        gradientFrom: "#6366f1", gradientTo: "#8b5cf6",
        midterm: "Submitted", final: "Due Soon",
        midtermScore: 88, midtermDue: "Feb 28, 2025", finalDue: "Apr 10, 2025",
    },
    {
        id: 2, name: "Kwame Asante", initials: "KA", studentId: "STU-2024-002",
        program: "BSc. Data Science", department: "Analytics & Research",
        gradientFrom: "#f43f5e", gradientTo: "#fb923c",
        midterm: "Overdue", final: "Pending",
        midtermDue: "Feb 28, 2025", finalDue: "Apr 10, 2025",
    },
    {
        id: 3, name: "Fatima Al-Rashid", initials: "FA", studentId: "STU-2024-003",
        program: "BSc. UI/UX Design", department: "Digital Product Design",
        gradientFrom: "#0ea5e9", gradientTo: "#06b6d4",
        midterm: "Submitted", final: "Pending",
        midtermScore: 81, midtermDue: "Feb 28, 2025", finalDue: "Apr 10, 2025",
    },
    {
        id: 4, name: "Diego Morales", initials: "DM", studentId: "STU-2024-004",
        program: "BSc. Computer Science", department: "Backend Engineering",
        gradientFrom: "#10b981", gradientTo: "#059669",
        midterm: "Submitted", final: "Due Soon",
        midtermScore: 94, midtermDue: "Feb 28, 2025", finalDue: "Mar 28, 2025",
    },
    {
        id: 5, name: "Nadine Uwase", initials: "NU", studentId: "STU-2024-005",
        program: "BSc. Health Informatics", department: "Medical Records & HIS",
        gradientFrom: "#f59e0b", gradientTo: "#d97706",
        midterm: "In Progress", final: "Pending",
        midtermDue: "Mar 25, 2025", finalDue: "Apr 10, 2025",
    },
];

const CRITERIA: Criterion[] = [
    { id: "technical", category: "Technical Skills", label: "Technical Competency", description: "Ability to apply technical knowledge and skills relevant to the internship role.", weight: 20 },
    { id: "quality", category: "Technical Skills", label: "Quality of Work", description: "Accuracy, thoroughness and overall quality of work produced.", weight: 15 },
    { id: "initiative", category: "Professional Conduct", label: "Initiative & Proactivity", description: "Takes ownership, seeks learning opportunities without being asked.", weight: 15 },
    { id: "communication", category: "Professional Conduct", label: "Communication Skills", description: "Clarity in written and verbal communication with team and supervisor.", weight: 15 },
    { id: "teamwork", category: "Professional Conduct", label: "Teamwork & Collaboration", description: "Works effectively with colleagues and contributes positively to team dynamics.", weight: 10 },
    { id: "punctuality", category: "Attendance & Reliability", label: "Punctuality & Attendance", description: "Consistent presence, on-time arrival, appropriate notification of absences.", weight: 10 },
    { id: "deadlines", category: "Attendance & Reliability", label: "Meeting Deadlines", description: "Submits tasks and reports on schedule with minimal follow-up needed.", weight: 10 },
    { id: "learning", category: "Growth & Development", label: "Learning Agility", description: "Ability to absorb feedback and continuously improve performance.", weight: 5 },
];

const RATING_LABELS: Record<RatingLevel, { label: string; color: string; bg: string }> = {
    1: { label: "Unsatisfactory", color: "text-rose-600", bg: "bg-rose-500" },
    2: { label: "Needs Improvement", color: "text-orange-500", bg: "bg-orange-400" },
    3: { label: "Satisfactory", color: "text-amber-500", bg: "bg-amber-400" },
    4: { label: "Good", color: "text-sky-600", bg: "bg-sky-500" },
    5: { label: "Excellent", color: "text-emerald-600", bg: "bg-emerald-500" },
};

const STATUS_CFG: Record<EvalStatus, { bg: string; text: string; border: string; dot: string }> = {
    Submitted: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
    "In Progress": { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200", dot: "bg-indigo-500" },
    "Due Soon": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-400" },
    Pending: { bg: "bg-slate-100", text: "text-slate-500", border: "border-slate-200", dot: "bg-slate-400" },
    Overdue: { bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-200", dot: "bg-rose-500" },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function calcScore(ratings: Record<string, RatingLevel>): number {
    let total = 0, weightSum = 0;
    CRITERIA.forEach((c) => {
        if (ratings[c.id]) {
            total += ratings[c.id] * c.weight;
            weightSum += c.weight;
        }
    });
    if (weightSum === 0) return 0;
    return Math.round((total / (weightSum * 5)) * 100);
}

function getScoreColor(score: number) {
    if (score >= 85) return { text: "text-emerald-600", bar: "bg-emerald-500", ring: "#10b981" };
    if (score >= 70) return { text: "text-sky-600", bar: "bg-sky-500", ring: "#0ea5e9" };
    if (score >= 55) return { text: "text-amber-600", bar: "bg-amber-400", ring: "#f59e0b" };
    return { text: "text-rose-600", bar: "bg-rose-500", ring: "#f43f5e" };
}

// ─── Circular Score ───────────────────────────────────────────────────────────
function ScoreRing({ score, size = 80 }: { score: number; size?: number }) {
    const stroke = 7;
    const r = (size - stroke * 2) / 2;
    const circ = 2 * Math.PI * r;
    const offset = circ - (score / 100) * circ;
    const col = getScoreColor(score);
    return (
        <div className="relative inline-flex items-center justify-center">
            <svg width={size} height={size} className="-rotate-90">
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={stroke} />
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={col.ring} strokeWidth={stroke}
                    strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(.4,0,.2,1)" }}
                />
            </svg>
            <div className="absolute text-center">
                <p className={`text-lg font-black leading-none ${col.text}`}>{score}</p>
                <p className="text-[9px] text-slate-400 font-semibold">/ 100</p>
            </div>
        </div>
    );
}

// ─── Rating Buttons ───────────────────────────────────────────────────────────
function RatingSelector({
    value, onChange, disabled,
}: { value?: RatingLevel; onChange: (v: RatingLevel) => void; disabled?: boolean }) {
    return (
        <div className="flex gap-1.5">
            {([1, 2, 3, 4, 5] as RatingLevel[]).map((r) => {
                const active = value === r;
                const cfg = RATING_LABELS[r];
                return (
                    <button
                        key={r}
                        onClick={() => !disabled && onChange(r)}
                        disabled={disabled}
                        title={cfg.label}
                        className={`w-8 h-8 rounded-lg text-xs font-black transition-all duration-150 border-2 ${active
                                ? `${cfg.bg} text-white border-transparent shadow-sm scale-110`
                                : disabled
                                    ? "bg-slate-100 text-slate-300 border-slate-100 cursor-default"
                                    : "bg-white text-slate-400 border-slate-200 hover:border-slate-300 hover:text-slate-600"
                            }`}
                    >
                        {r}
                    </button>
                );
            })}
        </div>
    );
}

// ─── Evaluation Form ──────────────────────────────────────────────────────────
function EvalForm({
    intern, evalType, onClose,
}: { intern: Intern; evalType: EvalType; onClose: () => void }) {
    const isReadOnly = evalType === "midterm" && intern.midterm === "Submitted";
    const prefill = isReadOnly && intern.midtermScore;

    const defaultRatings: Record<string, RatingLevel> = {};
    if (prefill) {
        CRITERIA.forEach((c) => {
            defaultRatings[c.id] = Math.max(1, Math.min(5, Math.round(intern.midtermScore! / 20))) as RatingLevel;
        });
    }

    const [form, setForm] = useState<EvalFormState>({
        ratings: defaultRatings,
        feedback: isReadOnly ? "Amara demonstrates strong technical ability and consistently delivers high-quality work. Shows excellent initiative in problem-solving." : "",
        strengths: isReadOnly ? "Technical skills, communication, meeting deadlines" : "",
        improvements: isReadOnly ? "Could improve on documentation practices" : "",
        recommendation: isReadOnly ? "promote" : "",
        submitted: isReadOnly,
    });
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const score = calcScore(form.ratings);
    const allRated = CRITERIA.every((c) => form.ratings[c.id]);
    const canSubmit = allRated && form.feedback.trim().length > 10 && !form.submitted;

    const categories = [...new Set(CRITERIA.map((c) => c.category))];

    const handleSubmit = async () => {
        setSaving(true);
        await new Promise((r) => setTimeout(r, 1200));
        setSaving(false);
        setSaved(true);
        setForm((f) => ({ ...f, submitted: true }));
    };

    const col = getScoreColor(score);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">

                {/* Modal Header */}
                <div
                    className="p-6 text-white relative overflow-hidden shrink-0"
                    style={{ background: `linear-gradient(135deg, ${intern.gradientFrom}, ${intern.gradientTo})` }}
                >
                    <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/10" />
                    <div className="absolute -bottom-8 left-12 w-28 h-28 rounded-full bg-white/10" />
                    <div className="relative flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl font-black shadow">
                                {intern.initials}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-lg font-black">{intern.name}</h2>
                                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-semibold">{intern.studentId}</span>
                                </div>
                                <p className="text-sm text-white/80">{intern.program}</p>
                                <p className="text-xs text-white/60 mt-0.5">{intern.department}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-center">
                                <p className="text-[10px] text-white/60 uppercase tracking-widest font-semibold mb-1">
                                    {evalType === "midterm" ? "Mid-Term" : "Final"} Evaluation
                                </p>
                                <span className="text-xs bg-white/20 px-3 py-1.5 rounded-full font-bold backdrop-blur-sm block">
                                    {form.submitted ? "✓ Submitted" : isReadOnly ? "Read Only" : "In Progress"}
                                </span>
                            </div>
                            <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors text-lg font-bold">
                                ×
                            </button>
                        </div>
                    </div>
                </div>

                {/* Score Preview Bar */}
                {Object.keys(form.ratings).length > 0 && (
                    <div className="bg-slate-50 border-b border-slate-100 px-6 py-3 shrink-0 flex items-center gap-4">
                        <ScoreRing score={score} size={64} />
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-1.5">
                                <p className="text-xs font-bold text-slate-600">Live Score Preview</p>
                                <span className={`text-xs font-black ${col.text}`}>
                                    {score >= 85 ? "Excellent" : score >= 70 ? "Good" : score >= 55 ? "Satisfactory" : "Needs Improvement"}
                                </span>
                            </div>
                            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${col.bar} transition-all duration-700`} style={{ width: `${score}%` }} />
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1">{Object.keys(form.ratings).length}/{CRITERIA.length} criteria rated</p>
                        </div>
                    </div>
                )}

                {/* Form Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    {/* Rubric */}
                    {categories.map((cat) => (
                        <div key={cat}>
                            <div className="flex items-center gap-2 mb-3">
                                <div className="h-px flex-1 bg-slate-100" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">{cat}</p>
                                <div className="h-px flex-1 bg-slate-100" />
                            </div>
                            <div className="space-y-3">
                                {CRITERIA.filter((c) => c.category === cat).map((c) => {
                                    const rated = form.ratings[c.id];
                                    const rCfg = rated ? RATING_LABELS[rated] : null;
                                    return (
                                        <div key={c.id} className={`rounded-2xl border p-4 transition-all duration-200 ${rated ? "border-slate-200 bg-white" : "border-dashed border-slate-200 bg-slate-50/50"}`}>
                                            <div className="flex items-start justify-between gap-4 flex-wrap">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-0.5">
                                                        <p className="text-sm font-bold text-slate-800">{c.label}</p>
                                                        <span className="text-[10px] bg-slate-100 text-slate-400 font-bold px-1.5 py-0.5 rounded-full">
                                                            {c.weight}%
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-slate-400 leading-relaxed">{c.description}</p>
                                                </div>
                                                <div className="flex flex-col items-end gap-1.5 shrink-0">
                                                    <RatingSelector
                                                        value={form.ratings[c.id]}
                                                        onChange={(v) => setForm((f) => ({ ...f, ratings: { ...f.ratings, [c.id]: v } }))}
                                                        disabled={form.submitted}
                                                    />
                                                    {rCfg && (
                                                        <p className={`text-[10px] font-semibold ${rCfg.color}`}>{rCfg.label}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    {/* Qualitative Feedback */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="h-px flex-1 bg-slate-100" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Written Feedback</p>
                            <div className="h-px flex-1 bg-slate-100" />
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs font-bold text-slate-600 mb-1.5 block">Overall Performance Comments <span className="text-rose-400">*</span></label>
                                <textarea
                                    value={form.feedback}
                                    onChange={(e) => setForm((f) => ({ ...f, feedback: e.target.value }))}
                                    disabled={form.submitted}
                                    rows={4}
                                    placeholder="Provide a comprehensive assessment of the intern's overall performance during this evaluation period..."
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent resize-none disabled:bg-slate-50 disabled:text-slate-500 transition"
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-bold text-slate-600 mb-1.5 block">Key Strengths</label>
                                    <textarea
                                        value={form.strengths}
                                        onChange={(e) => setForm((f) => ({ ...f, strengths: e.target.value }))}
                                        disabled={form.submitted}
                                        rows={3}
                                        placeholder="Notable strengths observed..."
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent resize-none disabled:bg-slate-50 disabled:text-slate-500 transition"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-600 mb-1.5 block">Areas for Improvement</label>
                                    <textarea
                                        value={form.improvements}
                                        onChange={(e) => setForm((f) => ({ ...f, improvements: e.target.value }))}
                                        disabled={form.submitted}
                                        rows={3}
                                        placeholder="Areas where development is needed..."
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent resize-none disabled:bg-slate-50 disabled:text-slate-500 transition"
                                    />
                                </div>
                            </div>

                            {/* Recommendation (Final only) */}
                            {evalType === "final" && (
                                <div>
                                    <label className="text-xs font-bold text-slate-600 mb-2 block">Final Recommendation</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                        {[
                                            { val: "promote", label: "Promote / Hire", icon: "🌟" },
                                            { val: "complete", label: "Successfully Completed", icon: "✅" },
                                            { val: "extend", label: "Extend Internship", icon: "🔄" },
                                            { val: "discontinue", label: "Discontinue", icon: "⛔" },
                                        ].map((opt) => (
                                            <button
                                                key={opt.val}
                                                onClick={() => !form.submitted && setForm((f) => ({ ...f, recommendation: opt.val }))}
                                                disabled={form.submitted}
                                                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-center transition-all duration-150 ${form.recommendation === opt.val
                                                        ? "border-indigo-400 bg-indigo-50 text-indigo-700"
                                                        : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 disabled:cursor-default"
                                                    }`}
                                            >
                                                <span className="text-xl">{opt.icon}</span>
                                                <span className="text-[10px] font-bold leading-tight">{opt.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="border-t border-slate-100 px-6 py-4 shrink-0 flex items-center justify-between gap-3 bg-slate-50/80">
                    <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-500 bg-white border border-slate-200 hover:bg-slate-100 transition-colors">
                        {form.submitted ? "Close" : "Cancel"}
                    </button>
                    {!form.submitted && (
                        <div className="flex gap-2">
                            <button
                                onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
                                className="px-5 py-2.5 rounded-xl text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors"
                            >
                                {saved ? "✓ Draft Saved" : "Save Draft"}
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={!canSubmit || saving}
                                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 shadow-md hover:shadow-lg"
                                style={{ background: canSubmit ? `linear-gradient(135deg, ${intern.gradientFrom}, ${intern.gradientTo})` : undefined, backgroundColor: !canSubmit ? "#94a3b8" : undefined }}
                            >
                                {saving ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                        </svg>
                                        Submitting...
                                    </span>
                                ) : "Submit Evaluation"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Intern Eval Card ─────────────────────────────────────────────────────────
function EvalCard({
    intern, evalType, onEvaluate,
}: { intern: Intern; evalType: EvalType; onEvaluate: () => void }) {
    const status = evalType === "midterm" ? intern.midterm : intern.final;
    const score = evalType === "midterm" ? intern.midtermScore : intern.finalScore;
    const due = evalType === "midterm" ? intern.midtermDue : intern.finalDue;
    const cfg = STATUS_CFG[status];
    const isSubmitted = status === "Submitted";

    return (
        <div className={`bg-white rounded-2xl border-2 p-5 transition-all duration-200 hover:shadow-md group ${status === "Overdue" ? "border-rose-200" : status === "Due Soon" ? "border-amber-200" : "border-slate-100"
            }`}>
            <div className="flex items-start gap-4">
                {/* Avatar */}
                <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-sm font-black shrink-0 shadow-sm"
                    style={{ background: `linear-gradient(135deg, ${intern.gradientFrom}, ${intern.gradientTo})` }}
                >
                    {intern.initials}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                            <p className="text-sm font-black text-slate-800">{intern.name}</p>
                            <p className="text-xs text-slate-400 truncate">{intern.department}</p>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                            {status}
                        </span>
                    </div>

                    <div className="flex items-center gap-4 mt-2 flex-wrap">
                        <span className="text-xs text-slate-400">
                            <span className="font-semibold text-slate-500">ID:</span> {intern.studentId}
                        </span>
                        <span className="text-xs text-slate-400">
                            <span className="font-semibold text-slate-500">Due:</span> {due}
                        </span>
                        {score && (
                            <span className={`text-xs font-black ${getScoreColor(score).text}`}>
                                Score: {score}/100
                            </span>
                        )}
                    </div>
                </div>

                {/* Score ring or action */}
                <div className="shrink-0 flex flex-col items-center gap-2">
                    {isSubmitted && score ? (
                        <ScoreRing score={score} size={60} />
                    ) : (
                        <div className="w-14 h-14 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center">
                            <span className="text-slate-300 text-xl">—</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Action button */}
            <div className="mt-4 flex gap-2">
                <button
                    onClick={onEvaluate}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 ${isSubmitted
                            ? "bg-slate-100 text-slate-500 hover:bg-slate-200"
                            : "text-white shadow-sm hover:opacity-90"
                        }`}
                    style={!isSubmitted ? { background: `linear-gradient(135deg, ${intern.gradientFrom}, ${intern.gradientTo})` } : {}}
                >
                    {isSubmitted ? "📋 View Evaluation" : status === "In Progress" ? "✏️ Continue Evaluation" : "📝 Start Evaluation"}
                </button>
                {isSubmitted && (
                    <button className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">
                        ⬇ Export
                    </button>
                )}
            </div>
        </div>
    );
}

// ─── Summary Stats ────────────────────────────────────────────────────────────
function SummaryBar({ evalType }: { evalType: EvalType }) {
    const submitted = INTERNS.filter((i) => (evalType === "midterm" ? i.midterm : i.final) === "Submitted").length;
    const pending = INTERNS.filter((i) => ["Pending", "In Progress"].includes(evalType === "midterm" ? i.midterm : i.final)).length;
    const dueSoon = INTERNS.filter((i) => (evalType === "midterm" ? i.midterm : i.final) === "Due Soon").length;
    const avgScore = (() => {
        const scores = INTERNS.map((i) => evalType === "midterm" ? i.midtermScore : i.finalScore).filter(Boolean) as number[];
        return scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
    })();

    return (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
            {[
                { label: "Total", value: INTERNS.length, bg: "bg-white border-slate-100", text: "text-slate-800" },
                { label: "Submitted", value: submitted, bg: "bg-emerald-50 border-emerald-100", text: "text-emerald-700" },
                { label: "Pending", value: pending, bg: "bg-slate-50 border-slate-100", text: "text-slate-600" },
                { label: "Due Soon", value: dueSoon, bg: "bg-amber-50 border-amber-100", text: "text-amber-700" },
                { label: "Avg Score", value: avgScore ? `${avgScore}%` : "—", bg: "bg-indigo-50 border-indigo-100", text: "text-indigo-700" },
            ].map((s) => (
                <div key={s.label} className={`rounded-2xl border-2 p-3 text-center ${s.bg}`}>
                    <p className={`text-2xl font-black ${s.text}`}>{s.value}</p>
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mt-0.5">{s.label}</p>
                </div>
            ))}
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function EvaluationsPage() {
    const [activeTab, setActiveTab] = useState<EvalType>("midterm");
    const [evalModal, setEvalModal] = useState<{ intern: Intern; type: EvalType } | null>(null);
    const [statusFilter, setStatusFilter] = useState<EvalStatus | "All">("All");

    const statusFilters: (EvalStatus | "All")[] = ["All", "Submitted", "Due Soon", "In Progress", "Pending", "Overdue"];

    const filtered = INTERNS.filter((intern) => {
        if (statusFilter === "All") return true;
        const s = activeTab === "midterm" ? intern.midterm : intern.final;
        return s === statusFilter;
    });

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap');
        * { font-family: 'Sora', sans-serif; }
        .page-enter { animation: pageEnter 0.4s ease forwards; }
        @keyframes pageEnter {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }
      `}</style>

            <div className="min-h-screen bg-[#f7f8fc] p-4 sm:p-6 page-enter">

                {/* ── Page Header ── */}
                <div className="mb-6">
                    <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-1">Supervisor · Evaluation Center</p>
                    <h1 className="text-2xl font-black text-slate-900">Intern Evaluations</h1>
                    <p className="text-sm text-slate-400 mt-1">Submit structured evaluations for your assigned interns</p>
                </div>

                {/* ── Type Tabs ── */}
                <div className="flex gap-3 mb-6 flex-wrap">
                    {(["midterm", "final"] as EvalType[]).map((tab) => {
                        const pendingCount = INTERNS.filter((i) => {
                            const s = tab === "midterm" ? i.midterm : i.final;
                            return s !== "Submitted";
                        }).length;
                        return (
                            <button
                                key={tab}
                                onClick={() => { setActiveTab(tab); setStatusFilter("All"); }}
                                className={`flex items-center gap-3 px-5 py-3 rounded-2xl border-2 text-sm font-bold transition-all duration-200 ${activeTab === tab
                                        ? "border-indigo-400 bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                                    }`}
                            >
                                <span>{tab === "midterm" ? "📋" : "🏁"}</span>
                                {tab === "midterm" ? "Mid-Term Evaluation" : "Final Evaluation"}
                                {pendingCount > 0 && (
                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${activeTab === tab ? "bg-white/20 text-white" : "bg-rose-100 text-rose-600"
                                        }`}>
                                        {pendingCount} pending
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* ── Summary Stats ── */}
                <SummaryBar evalType={activeTab} />

                {/* ── Banner ── */}
                {activeTab === "midterm" && (
                    <div className="mb-6 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-4 text-white flex items-center gap-4">
                        <span className="text-2xl shrink-0">📋</span>
                        <div>
                            <p className="text-sm font-black">Mid-Term Evaluations</p>
                            <p className="text-xs text-indigo-200 mt-0.5">Assess intern progress at the halfway point. Evaluations are shared with the intern and coordinator after submission.</p>
                        </div>
                    </div>
                )}
                {activeTab === "final" && (
                    <div className="mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-4 text-white flex items-center gap-4">
                        <span className="text-2xl shrink-0">🏁</span>
                        <div>
                            <p className="text-sm font-black">Final Evaluations</p>
                            <p className="text-xs text-emerald-100 mt-0.5">Provide a comprehensive final assessment. Your recommendation will contribute to the intern&apos;s official internship grade.</p>
                        </div>
                    </div>
                )}

                {/* ── Filter Pills ── */}
                <div className="flex gap-2 flex-wrap mb-5">
                    {statusFilters.map((f) => {
                        const count = f === "All" ? INTERNS.length : INTERNS.filter((i) => {
                            const s = activeTab === "midterm" ? i.midterm : i.final;
                            return s === f;
                        }).length;
                        if (count === 0 && f !== "All") return null;
                        return (
                            <button
                                key={f}
                                onClick={() => setStatusFilter(f)}
                                className={`flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full transition-all duration-200 ${statusFilter === f
                                        ? "bg-indigo-600 text-white shadow-sm"
                                        : "bg-white border border-slate-200 text-slate-500 hover:border-indigo-200"
                                    }`}
                            >
                                {f}
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${statusFilter === f ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                                    }`}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* ── Eval Cards Grid ── */}
                {filtered.length === 0 ? (
                    <div className="text-center py-16 text-slate-400">
                        <p className="text-4xl mb-3">📭</p>
                        <p className="text-sm font-semibold">No evaluations match the selected filter</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {filtered.map((intern) => (
                            <EvalCard
                                key={intern.id}
                                intern={intern}
                                evalType={activeTab}
                                onEvaluate={() => setEvalModal({ intern, type: activeTab })}
                            />
                        ))}
                    </div>
                )}

                {/* ── Legend ── */}
                <div className="mt-8 p-4 bg-white rounded-2xl border border-slate-100">
                    <p className="text-xs font-black text-slate-600 mb-3 uppercase tracking-wider">Rating Scale</p>
                    <div className="flex flex-wrap gap-3">
                        {([1, 2, 3, 4, 5] as RatingLevel[]).map((r) => {
                            const cfg = RATING_LABELS[r];
                            return (
                                <div key={r} className="flex items-center gap-2">
                                    <div className={`w-6 h-6 rounded-lg ${cfg.bg} flex items-center justify-center text-[10px] font-black text-white`}>{r}</div>
                                    <span className={`text-xs font-semibold ${cfg.color}`}>{cfg.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ── Modal ── */}
                {evalModal && (
                    <EvalForm
                        intern={evalModal.intern}
                        evalType={evalModal.type}
                        onClose={() => setEvalModal(null)}
                    />
                )}
            </div>
        </>
    );
}