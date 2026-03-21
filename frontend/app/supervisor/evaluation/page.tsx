"use client";

import { useState } from "react";
import { ClipboardCheck } from "lucide-react";
import { useGetEvaluationsQuery, useCreateEvaluationMutation } from "@/lib/redux/slices/EvaluationsSlice";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

export default function SupervisorEvaluationPage() {
    const { data: evaluations, isLoading } = useGetEvaluationsQuery();
    const [createEvaluation, { isLoading: isSubmitting }] = useCreateEvaluationMutation();

    const [studentId, setStudentId] = useState("");
    const [type, setType] = useState<"MIDTERM" | "FINAL">("MIDTERM");
    const [score, setScore] = useState("");
    const [feedback, setFeedback] = useState("");

    const handleSubmit = async () => {
        if (!studentId) {
            toast.error("Student ID is required.");
            return;
        }
        if (!score || Number(score) <= 0) {
            toast.error("Score is required.");
            return;
        }
        try {
            await createEvaluation({
                student: Number(studentId),
                evaluation_type: type,
                score: Number(score),
                feedback,
            }).unwrap();
            toast.success("Evaluation submitted.");
            setStudentId("");
            setScore("");
            setFeedback("");
        } catch {
            toast.error("Failed to submit evaluation.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="p-6 lg:p-8">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Evaluations</h1>
                        <p className="mt-1 text-sm text-gray-500">Create and review intern evaluations</p>
                    </div>
                    <ClipboardCheck className="h-6 w-6 text-gray-400" />
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-1 rounded-2xl bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-900">New Evaluation</h2>
                        <div className="mt-4 space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">Student ID</label>
                                <input
                                    value={studentId}
                                    onChange={(e) => setStudentId(e.target.value)}
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                                    placeholder="e.g. 14"
                                />
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
                            <div>
                                <label className="text-sm font-medium text-gray-700">Score</label>
                                <input
                                    value={score}
                                    onChange={(e) => setScore(e.target.value)}
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Feedback</label>
                                <textarea
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    rows={4}
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                                />
                            </div>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
                            >
                                {isSubmitting ? "Submitting..." : "Submit Evaluation"}
                            </button>
                        </div>
                    </div>

                    <div className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-sm">
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
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Student ID: {evaluation.student}</p>
                                                <p className="text-xs text-gray-500">Type: {evaluation.evaluation_type}</p>
                                                <p className="text-xs text-gray-500">Score: {evaluation.score}</p>
                                                {evaluation.feedback && (
                                                    <p className="mt-2 text-xs text-gray-600">{evaluation.feedback}</p>
                                                )}
                                            </div>
                                            <span className="text-xs text-gray-400">
                                                {formatDistanceToNow(new Date(evaluation.created_at), { addSuffix: true })}
                                            </span>
                                        </div>
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
