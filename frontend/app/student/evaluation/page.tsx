"use client";

import { useMemo } from "react";
import { Star, ClipboardList } from "lucide-react";
import { useGetEvaluationsQuery } from "@/lib/redux/slices/EvaluationsSlice";
import { formatDistanceToNow } from "date-fns";

export default function StudentEvaluationPage() {
    const { data: evaluations, isLoading } = useGetEvaluationsQuery();

    const averageScore = useMemo(() => {
        if (!evaluations || evaluations.length === 0) return null;
        const total = evaluations.reduce((sum, e) => sum + (e.score || 0), 0);
        return Math.round((total / evaluations.length) * 10) / 10;
    }, [evaluations]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="p-6 lg:p-8">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Evaluations</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            {averageScore !== null ? `Average score: ${averageScore}/5` : "No evaluations yet"}
                        </p>
                    </div>
                    <Star className="h-6 w-6 text-yellow-500" />
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm">
                    {isLoading && <p className="text-sm text-gray-500">Loading evaluations...</p>}
                    {!isLoading && (!evaluations || evaluations.length === 0) && (
                        <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">
                            Evaluations will appear here once submitted by your supervisor.
                        </div>
                    )}
                    {!isLoading && evaluations && evaluations.length > 0 && (
                        <div className="space-y-4">
                            {evaluations.map((evaluation) => (
                                <div key={evaluation.id} className="rounded-xl border border-gray-200 p-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">{evaluation.evaluation_type} Evaluation</h3>
                                            <p className="mt-1 text-sm text-gray-500">Score: {evaluation.score}/5</p>
                                            {evaluation.feedback && (
                                                <p className="mt-2 text-sm text-gray-600">{evaluation.feedback}</p>
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            {formatDistanceToNow(new Date(evaluation.created_at), { addSuffix: true })}
                                        </span>
                                    </div>
                                    {evaluation.ratings && evaluation.ratings.length > 0 && (
                                        <div className="mt-4 rounded-lg bg-gray-50 p-4">
                                            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                                                <ClipboardList className="h-4 w-4" />
                                                Rubric Breakdown
                                            </div>
                                            <div className="space-y-2">
                                                {evaluation.ratings.map((rating) => (
                                                    <div key={rating.id} className="flex items-center justify-between text-sm text-gray-600">
                                                        <span>Criterion #{rating.criterion}</span>
                                                        <span className="font-medium text-gray-900">{rating.score}</span>
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
    );
}
