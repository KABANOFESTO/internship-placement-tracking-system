"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { EmptyState, PartnerCard, PartnerPageShell } from "@/components/partner/PartnerUi";
import { useCreateEvaluationMutation, useGetEvaluationSummariesQuery, useGetEvaluationsQuery } from "@/lib/redux/slices/EvaluationsSlice";
import { useGetPlacementsQuery } from "@/lib/redux/slices/InternshipsSlice";

const EVALUATION_CRITERIA = [
    { key: "professional_knowledge", label: "Professional Knowledge" },
    { key: "professional_qualities", label: "Professional Qualities" },
    { key: "personal_qualities", label: "Personal Qualities" },
    { key: "responsibility", label: "Responsibility" },
    { key: "relationship_with_coworkers", label: "Relationship with Co-workers" },
] as const;

type CriterionKey = (typeof EVALUATION_CRITERIA)[number]["key"];

export default function PartnerEvaluationsPage() {
    const { data: placements = [] } = useGetPlacementsQuery();
    const { data: evaluations = [] } = useGetEvaluationsQuery();
    const { data: summaries = [] } = useGetEvaluationSummariesQuery();
    const [createEvaluation] = useCreateEvaluationMutation();

    const assignedStudents = useMemo(() => placements.map((placement) => placement.student_details).filter(Boolean), [placements]);
    const [form, setForm] = useState({
        student: "",
        evaluation_type: "MIDTERM",
        feedback: "",
        criterion_scores: {
            professional_knowledge: "",
            professional_qualities: "",
            personal_qualities: "",
            responsibility: "",
            relationship_with_coworkers: "",
        } as Record<CriterionKey, string>,
    });

    const totalScore = useMemo(() => {
        return EVALUATION_CRITERIA.reduce((sum, criterion) => sum + (Number(form.criterion_scores[criterion.key]) || 0), 0);
    }, [form.criterion_scores]);

    const submitEvaluation = async () => {
        if (!form.student) {
            toast.error("Select a student first.");
            return;
        }

        const payloadCriterionScores: Record<string, number> = {};
        for (const criterion of EVALUATION_CRITERIA) {
            const raw = form.criterion_scores[criterion.key];
            if (raw === "") {
                toast.error(`Please score ${criterion.label}.`);
                return;
            }
            const numeric = Number(raw);
            if (Number.isNaN(numeric) || numeric < 0 || numeric > 10) {
                toast.error(`${criterion.label} must be between 0 and 10.`);
                return;
            }
            payloadCriterionScores[criterion.key] = numeric;
        }

        try {
            await createEvaluation({
                student: Number(form.student),
                evaluation_type: form.evaluation_type as "MIDTERM" | "FINAL",
                score: totalScore,
                criterion_scores: payloadCriterionScores,
                feedback: form.feedback,
            }).unwrap();
            toast.success("Evaluation submitted.");
            setForm((current) => ({
                ...current,
                feedback: "",
                criterion_scores: {
                    professional_knowledge: "",
                    professional_qualities: "",
                    personal_qualities: "",
                    responsibility: "",
                    relationship_with_coworkers: "",
                },
            }));
        } catch (error: any) {
            const scoreError = error?.data?.score?.[0];
            toast.error(scoreError || "Could not submit evaluation.");
        }
    };

    return (
        <PartnerPageShell>
            <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
                <PartnerCard>
                    <h2 className="font-semibold text-slate-900">Submit Evaluation</h2>
                    <p className="mt-1 text-sm text-slate-500">Use the official criteria form and the system will total the marks automatically.</p>
                    <div className="mt-4 space-y-3">
                        <select
                            value={form.student}
                            onChange={(event) => setForm({ ...form, student: event.target.value })}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                        >
                            <option value="">Select student</option>
                            {assignedStudents.map((student) => student && <option key={student.id} value={student.id}>{student.user?.username}</option>)}
                        </select>
                        <select
                            value={form.evaluation_type}
                            onChange={(event) => setForm({ ...form, evaluation_type: event.target.value })}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                        >
                            <option value="MIDTERM">Mid-term</option>
                            <option value="FINAL">Final</option>
                        </select>

                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold text-slate-900">Current Total</p>
                                <span className="text-lg font-bold text-slate-700">{totalScore}/50</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {EVALUATION_CRITERIA.map((criterion) => (
                                <label key={criterion.key} className="block rounded-lg border border-slate-200 p-3">
                                    <span className="mb-1 block text-sm font-medium text-slate-800">{criterion.label}</span>
                                    <input
                                        type="number"
                                        min={0}
                                        max={10}
                                        value={form.criterion_scores[criterion.key]}
                                        onChange={(event) =>
                                            setForm({
                                                ...form,
                                                criterion_scores: {
                                                    ...form.criterion_scores,
                                                    [criterion.key]: event.target.value,
                                                },
                                            })
                                        }
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-500"
                                        placeholder="0"
                                    />
                                    <span className="mt-1 block text-[11px] text-slate-500">/10</span>
                                </label>
                            ))}
                        </div>

                        <textarea
                            placeholder="Feedback"
                            value={form.feedback}
                            onChange={(event) => setForm({ ...form, feedback: event.target.value })}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                            rows={4}
                        />
                        <button onClick={submitEvaluation} className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
                            Submit Evaluation
                        </button>
                    </div>
                </PartnerCard>

                <PartnerCard>
                    <h2 className="font-semibold text-slate-900">Evaluation Summary</h2>
                    <div className="mt-4 space-y-3">
                        {summaries.length ? summaries.map((summary) => (
                            <div key={summary.student.id} className="rounded-lg border border-slate-200 p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="font-semibold text-slate-900">{summary.student.user?.username || summary.student.student_id}</p>
                                        <p className="text-sm text-slate-500">
                                            Midterm {summary.midterm_score ?? "-"}/50 | Final {summary.final_score ?? "-"}/50
                                        </p>
                                    </div>
                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                        {summary.is_complete ? `${summary.final_score_out_of_20}/20` : "Pending"}
                                    </span>
                                </div>
                            </div>
                        )) : <EmptyState message="No evaluation summaries yet." />}
                    </div>
                </PartnerCard>
            </div>

            <PartnerCard>
                <h2 className="font-semibold text-slate-900">Feedback History</h2>
                <div className="mt-4 space-y-3">
                    {evaluations.length ? evaluations.map((evaluation) => (
                        <div key={evaluation.id} className="rounded-lg border border-slate-200 p-4">
                            <p className="font-semibold text-slate-900">{evaluation.student_details?.user?.username}</p>
                            <p className="text-sm text-slate-500">
                                {evaluation.evaluation_type} - Final Marks {evaluation.score}/{evaluation.max_score ?? 50}
                            </p>
                            <p className="mt-2 text-sm text-slate-600">{evaluation.feedback}</p>
                        </div>
                    )) : <EmptyState message="No evaluations have been submitted yet." />}
                </div>
            </PartnerCard>
        </PartnerPageShell>
    );
}
