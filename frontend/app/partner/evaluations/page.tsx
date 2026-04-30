"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { EmptyState, PartnerCard, PartnerField, PartnerPageShell } from "@/components/partner/PartnerUi";
import { useCreateEvaluationMutation, useGetEvaluationsQuery } from "@/lib/redux/slices/EvaluationsSlice";
import { useGetPlacementsQuery } from "@/lib/redux/slices/InternshipsSlice";

export default function PartnerEvaluationsPage() {
    const { data: placements = [] } = useGetPlacementsQuery();
    const { data: evaluations = [] } = useGetEvaluationsQuery();
    const [createEvaluation] = useCreateEvaluationMutation();
    const assignedStudents = useMemo(() => placements.map((placement) => placement.student_details).filter(Boolean), [placements]);
    const [form, setForm] = useState({ student: "", evaluation_type: "MIDTERM", score: "80", feedback: "" });

    const submitEvaluation = async () => {
        if (!form.student) {
            toast.error("Select a student first.");
            return;
        }
        try {
            await createEvaluation({
                student: Number(form.student),
                evaluation_type: form.evaluation_type as "MIDTERM" | "FINAL",
                score: Number(form.score),
                feedback: form.feedback,
            }).unwrap();
            toast.success("Evaluation submitted.");
        } catch {
            toast.error("Could not submit evaluation.");
        }
    };

    return (
        <PartnerPageShell>
            <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
                <PartnerCard>
                    <h2 className="font-semibold text-slate-900">Submit Evaluation</h2>
                    <div className="mt-4 space-y-3">
                        <select value={form.student} onChange={(event) => setForm({ ...form, student: event.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
                            <option value="">Select student</option>
                            {assignedStudents.map((student) => student && <option key={student.id} value={student.id}>{student.user?.username}</option>)}
                        </select>
                        <select value={form.evaluation_type} onChange={(event) => setForm({ ...form, evaluation_type: event.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
                            <option value="MIDTERM">Mid-term</option>
                            <option value="FINAL">Final</option>
                        </select>
                        <PartnerField label="Score" type="number" value={form.score} onChange={(value) => setForm({ ...form, score: value })} />
                        <textarea placeholder="Feedback" value={form.feedback} onChange={(event) => setForm({ ...form, feedback: event.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" rows={4} />
                        <button onClick={submitEvaluation} className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Submit Evaluation</button>
                    </div>
                </PartnerCard>

                <PartnerCard>
                    <h2 className="font-semibold text-slate-900">Feedback History</h2>
                    <div className="mt-4 space-y-3">
                        {evaluations.length ? evaluations.map((evaluation) => (
                            <div key={evaluation.id} className="rounded-lg border border-slate-200 p-4">
                                <p className="font-semibold text-slate-900">{evaluation.student_details?.user?.username}</p>
                                <p className="text-sm text-slate-500">{evaluation.evaluation_type} - Score {evaluation.score}</p>
                                <p className="mt-2 text-sm text-slate-600">{evaluation.feedback}</p>
                            </div>
                        )) : <EmptyState message="No evaluations have been submitted yet." />}
                    </div>
                </PartnerCard>
            </div>
        </PartnerPageShell>
    );
}
