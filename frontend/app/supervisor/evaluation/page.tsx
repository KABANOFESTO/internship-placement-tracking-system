"use client";

import { useMemo, useState } from "react";
import { ClipboardCheck, ClipboardList } from "lucide-react";
import { useGetEvaluationsQuery, useCreateEvaluationMutation } from "@/lib/redux/slices/EvaluationsSlice";
import { useGetPlacementsQuery } from "@/lib/redux/slices/InternshipsSlice";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

type AssignedStudentOption = {
    profileId: number;
    label: string;
};

const EVALUATION_CRITERIA = [
    {
        key: "professional_knowledge",
        label: "Professional Knowledge",
        guidance: [],
    },
    {
        key: "professional_qualities",
        label: "Professional Qualities",
        guidance: ["Punctuality", "Initiative", "Adaptability", "Discipline", "Assiduity", "Achievement", "Team Spirit", "Other"],
    },
    {
        key: "personal_qualities",
        label: "Personal Qualities",
        guidance: ["Originality", "Enthusiasm", "Courtesy", "Other"],
    },
    {
        key: "responsibility",
        label: "Responsibility",
        guidance: [],
    },
    {
        key: "relationship_with_coworkers",
        label: "Relationship with Co-workers",
        guidance: [],
    },
] as const;

type CriterionKey = (typeof EVALUATION_CRITERIA)[number]["key"];

export default function SupervisorEvaluationPage() {
    const { data: evaluations, isLoading } = useGetEvaluationsQuery();
    const { data: placements } = useGetPlacementsQuery();
    const [createEvaluation, { isLoading: isSubmitting }] = useCreateEvaluationMutation();

    const [studentId, setStudentId] = useState("");
    const [type, setType] = useState<"MIDTERM" | "FINAL">("MIDTERM");
    const [criterionScores, setCriterionScores] = useState<Record<CriterionKey, string>>({
        professional_knowledge: "",
        professional_qualities: "",
        personal_qualities: "",
        responsibility: "",
        relationship_with_coworkers: "",
    });
    const [feedback, setFeedback] = useState("");

    const assignedStudents = useMemo<AssignedStudentOption[]>(() => {
        const seen = new Set<number>();
        return (placements || []).flatMap((placement) => {
            const student = placement.student_details;
            if (!student?.id || seen.has(student.id)) {
                return [];
            }
            seen.add(student.id);
            const username = student.user?.username || student.user?.email || `Student ${student.id}`;
            return [{
                profileId: student.id,
                label: `${username} (${student.student_id || `Profile #${student.id}`})`,
            }];
        });
    }, [placements]);

    const totalScore = useMemo(() => {
        return EVALUATION_CRITERIA.reduce((sum, criterion) => sum + (Number(criterionScores[criterion.key]) || 0), 0);
    }, [criterionScores]);

    const handleCriterionChange = (key: CriterionKey, value: string) => {
        const parsed = Number(value);
        const numeric = value === "" || Number.isNaN(parsed) ? "" : String(Math.max(0, Math.min(10, parsed)));
        setCriterionScores((prev) => ({ ...prev, [key]: numeric }));
    };

    const handleSubmit = async () => {
        if (!studentId) {
            toast.error("Select a student.");
            return;
        }

        const payloadCriterionScores: Record<string, number> = {};
        for (const criterion of EVALUATION_CRITERIA) {
            const raw = criterionScores[criterion.key];
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
                student: Number(studentId),
                evaluation_type: type,
                score: totalScore,
                criterion_scores: payloadCriterionScores,
                feedback,
            }).unwrap();
            toast.success("Evaluation submitted.");
            setStudentId("");
            setCriterionScores({
                professional_knowledge: "",
                professional_qualities: "",
                personal_qualities: "",
                responsibility: "",
                relationship_with_coworkers: "",
            });
            setFeedback("");
        } catch (error: any) {
            const studentError = error?.data?.student?.[0];
            const scoreError = error?.data?.score?.[0];
            const nonFieldError = error?.data?.non_field_errors?.[0];
            toast.error(scoreError || studentError || nonFieldError || "Failed to submit evaluation.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="p-6 lg:p-8">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Evaluations</h1>
                        <p className="mt-1 text-sm text-gray-500">Official internship evaluation form with automatic totals</p>
                    </div>
                    <ClipboardCheck className="h-6 w-6 text-gray-400" />
                </div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                    <div className="xl:col-span-1 rounded-2xl bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-900">New Evaluation</h2>
                        <div className="mt-4 space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">Assigned Student</label>
                                <select
                                    value={studentId}
                                    onChange={(e) => setStudentId(e.target.value)}
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                                >
                                    <option value="">Select assigned student</option>
                                    {assignedStudents.map((student) => (
                                        <option key={student.profileId} value={student.profileId}>
                                            {student.label}
                                        </option>
                                    ))}
                                </select>
                                {assignedStudents.length === 0 && (
                                    <p className="mt-2 text-xs text-amber-600">No assigned interns found for evaluation yet.</p>
                                )}
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700">Evaluation Type</label>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value as "MIDTERM" | "FINAL")}
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                                >
                                    <option value="MIDTERM">Midterm</option>
                                    <option value="FINAL">Final</option>
                                </select>
                            </div>

                            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-semibold text-blue-900">Current Total</p>
                                    <span className="text-lg font-bold text-blue-700">{totalScore}/50</span>
                                </div>
                                <p className="mt-1 text-xs text-blue-800">Each criterion is scored out of 10 and the system totals the marks automatically.</p>
                            </div>

                            <div className="space-y-3">
                                {EVALUATION_CRITERIA.map((criterion) => (
                                    <div key={criterion.key} className="rounded-xl border border-gray-200 p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-800">{criterion.label}</label>
                                                {criterion.guidance.length > 0 && (
                                                    <div className="mt-2 flex flex-wrap gap-1.5">
                                                        {criterion.guidance.map((item) => (
                                                            <span key={item} className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600">
                                                                {item}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="w-24">
                                                <input
                                                    type="number"
                                                    min={0}
                                                    max={10}
                                                    value={criterionScores[criterion.key]}
                                                    onChange={(e) => handleCriterionChange(criterion.key, e.target.value)}
                                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-right"
                                                    placeholder="0"
                                                />
                                                <p className="mt-1 text-[11px] text-gray-500 text-right">/10</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700">Feedback</label>
                                <textarea
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    rows={4}
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                                    placeholder="Write clear feedback for the intern"
                                />
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting || assignedStudents.length === 0}
                                className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
                            >
                                {isSubmitting ? "Submitting..." : "Submit Evaluation"}
                            </button>
                        </div>
                    </div>

                    <div className="xl:col-span-2 rounded-2xl bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Evaluations</h2>
                        {isLoading && <p className="mt-4 text-sm text-gray-500">Loading evaluations...</p>}
                        {!isLoading && (!evaluations || evaluations.length === 0) && (
                            <div className="mt-4 rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">
                                No evaluations yet.
                            </div>
                        )}
                        {!isLoading && evaluations && evaluations.length > 0 && (
                            <div className="mt-4 space-y-3">
                                {evaluations.map((evaluation) => (
                                    <div key={evaluation.id} className="rounded-xl border border-gray-200 p-4">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {evaluation.student_details?.user?.username || `Student ID: ${evaluation.student}`}
                                                </p>
                                                <p className="text-xs text-gray-500">Type: {evaluation.evaluation_type}</p>
                                                <p className="text-xs text-gray-500">
                                                    Final Marks: {evaluation.score}/{evaluation.max_score ?? 50}
                                                    {evaluation.score_out_of_20_component !== undefined ? ` (${evaluation.score_out_of_20_component}/10 contribution)` : ""}
                                                </p>
                                                {evaluation.feedback && (
                                                    <p className="mt-2 text-xs text-gray-600">{evaluation.feedback}</p>
                                                )}
                                            </div>
                                            <span className="text-xs text-gray-400">
                                                {formatDistanceToNow(new Date(evaluation.created_at), { addSuffix: true })}
                                            </span>
                                        </div>

                                        {evaluation.criterion_scores && (
                                            <div className="mt-4 rounded-lg bg-gray-50 p-4">
                                                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                                                    <ClipboardList className="h-4 w-4" />
                                                    Criterion Breakdown
                                                </div>
                                                <div className="grid gap-2 md:grid-cols-2">
                                                    {EVALUATION_CRITERIA.map((criterion) => (
                                                        <div key={criterion.key} className="flex items-center justify-between rounded-md bg-white px-3 py-2 text-sm">
                                                            <span className="text-gray-600">{criterion.label}</span>
                                                            <span className="font-semibold text-gray-900">
                                                                {(evaluation.criterion_scores?.[criterion.key] ?? 0)}/10
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
