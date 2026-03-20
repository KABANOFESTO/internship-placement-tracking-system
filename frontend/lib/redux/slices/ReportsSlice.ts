import { apiSlice } from "./ApiSlice";

export type ReportType = "WEEKLY" | "FINAL";

export interface Report {
    id: number;
    student: number;
    type: ReportType;
    file: string;
    feedback?: string;
    submitted_at: string;
}

export const reportsSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getReports: builder.query<Report[], void>({
            query: () => ({ url: "reports/", method: "GET" }),
            providesTags: ["Report"],
        }),
        getReportById: builder.query<Report, number>({
            query: (id) => ({ url: `reports/${id}/`, method: "GET" }),
            providesTags: ["Report"],
        }),
        createReport: builder.mutation<Report, FormData | Partial<Report>>({
            query: (data) => ({
                url: "reports/",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Report"],
        }),
        updateReport: builder.mutation<Report, { id: number; data: Partial<Report> }>({
            query: ({ id, data }) => ({
                url: `reports/${id}/`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Report"],
        }),
        deleteReport: builder.mutation<void, number>({
            query: (id) => ({
                url: `reports/${id}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["Report"],
        }),
    }),
});

export const {
    useGetReportsQuery,
    useGetReportByIdQuery,
    useCreateReportMutation,
    useUpdateReportMutation,
    useDeleteReportMutation,
} = reportsSlice;
