import { apiSlice } from "./ApiSlice";

export type EvaluationType = "MIDTERM" | "FINAL";

export interface Evaluation {
    id: number;
    student: number;
    supervisor: number | null;
    evaluation_type: EvaluationType;
    score: number;
    feedback?: string;
    created_at: string;
    ratings?: EvaluationRating[];
}

export interface EvaluationCriterion {
    id: number;
    name: string;
    description?: string;
    max_score: number;
    is_active: boolean;
}

export interface EvaluationRating {
    id: number;
    evaluation: number;
    criterion: number;
    score: number;
    comment?: string;
}

export interface EvaluationStatistics {
    total: number;
    by_type: Array<{ evaluation_type: EvaluationType; count: number }>;
    avg_score: number | null;
}

export const evaluationsSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getEvaluations: builder.query<Evaluation[], void>({
            query: () => ({ url: "evaluations/", method: "GET" }),
            providesTags: ["Evaluation"],
        }),
        createEvaluation: builder.mutation<Evaluation, Partial<Evaluation>>({
            query: (data) => ({ url: "evaluations/", method: "POST", body: data }),
            invalidatesTags: ["Evaluation"],
        }),
        updateEvaluation: builder.mutation<Evaluation, { id: number; data: Partial<Evaluation> }>({
            query: ({ id, data }) => ({ url: `evaluations/${id}/`, method: "PUT", body: data }),
            invalidatesTags: ["Evaluation"],
        }),
        deleteEvaluation: builder.mutation<void, number>({
            query: (id) => ({ url: `evaluations/${id}/`, method: "DELETE" }),
            invalidatesTags: ["Evaluation"],
        }),
        getEvaluationStatistics: builder.query<EvaluationStatistics, void>({
            query: () => ({ url: "evaluations/statistics/", method: "GET" }),
            providesTags: ["Analytics"],
        }),
        getEvaluationCriteria: builder.query<EvaluationCriterion[], void>({
            query: () => ({ url: "evaluation-criteria/", method: "GET" }),
            providesTags: ["EvaluationCriterion"],
        }),
        createEvaluationCriterion: builder.mutation<EvaluationCriterion, Partial<EvaluationCriterion>>({
            query: (data) => ({ url: "evaluation-criteria/", method: "POST", body: data }),
            invalidatesTags: ["EvaluationCriterion"],
        }),
        updateEvaluationCriterion: builder.mutation<EvaluationCriterion, { id: number; data: Partial<EvaluationCriterion> }>({
            query: ({ id, data }) => ({ url: `evaluation-criteria/${id}/`, method: "PUT", body: data }),
            invalidatesTags: ["EvaluationCriterion"],
        }),
        deleteEvaluationCriterion: builder.mutation<void, number>({
            query: (id) => ({ url: `evaluation-criteria/${id}/`, method: "DELETE" }),
            invalidatesTags: ["EvaluationCriterion"],
        }),
        getEvaluationRatings: builder.query<EvaluationRating[], void>({
            query: () => ({ url: "evaluation-ratings/", method: "GET" }),
            providesTags: ["EvaluationRating"],
        }),
        createEvaluationRating: builder.mutation<EvaluationRating, Partial<EvaluationRating>>({
            query: (data) => ({ url: "evaluation-ratings/", method: "POST", body: data }),
            invalidatesTags: ["EvaluationRating", "Evaluation"],
        }),
        updateEvaluationRating: builder.mutation<EvaluationRating, { id: number; data: Partial<EvaluationRating> }>({
            query: ({ id, data }) => ({ url: `evaluation-ratings/${id}/`, method: "PUT", body: data }),
            invalidatesTags: ["EvaluationRating", "Evaluation"],
        }),
        deleteEvaluationRating: builder.mutation<void, number>({
            query: (id) => ({ url: `evaluation-ratings/${id}/`, method: "DELETE" }),
            invalidatesTags: ["EvaluationRating", "Evaluation"],
        }),
    }),
});

export const {
    useGetEvaluationsQuery,
    useCreateEvaluationMutation,
    useUpdateEvaluationMutation,
    useDeleteEvaluationMutation,
    useGetEvaluationStatisticsQuery,
    useGetEvaluationCriteriaQuery,
    useCreateEvaluationCriterionMutation,
    useUpdateEvaluationCriterionMutation,
    useDeleteEvaluationCriterionMutation,
    useGetEvaluationRatingsQuery,
    useCreateEvaluationRatingMutation,
    useUpdateEvaluationRatingMutation,
    useDeleteEvaluationRatingMutation,
} = evaluationsSlice;
