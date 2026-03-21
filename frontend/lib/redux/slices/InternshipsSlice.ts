import { apiSlice } from "./ApiSlice";

export interface Organization {
    id: string;
    name: string;
    address: string;
    contact_email: string;
}

export interface InternshipPosition {
    id: string;
    title: string;
    organization: string;
    description: string;
    required_skills: string;
    capacity: number;
    match_score?: number;
    matched_skills?: string[];
}

export type ApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Application {
    id: string;
    student: number;
    student_details?: {
        id: number;
        student_id: string;
        program: string;
        year_of_study: number;
        graduation_date: string;
        skills: string;
        user?: {
            id: number;
            username: string;
            email: string;
            role: string;
            profile_picture?: string | null;
        };
    };
    position: string;
    cover_letter: string;
    cv: string;
    status: ApplicationStatus;
    created_at: string;
}

export interface Placement {
    id: string;
    application: string;
    student_details?: {
        id: number;
        student_id: string;
        program: string;
        year_of_study: number;
        graduation_date: string;
        skills: string;
        user?: {
            id: number;
            username: string;
            email: string;
            role: string;
            profile_picture?: string | null;
        };
    };
    supervisor: number | null;
    start_date: string;
    end_date: string;
    confirmed: boolean;
}

export interface ApplicationStatistics {
    total: number;
    by_status: Array<{ status: ApplicationStatus; count: number }>;
}

export interface PlacementStatistics {
    total: number;
    confirmed: number;
    by_supervisor: Array<{ supervisor: number | null; count: number }>;
}

export const internshipsSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getOrganizations: builder.query<Organization[], void>({
            query: () => ({ url: "organizations/", method: "GET" }),
            providesTags: ["Organization"],
        }),
        createOrganization: builder.mutation<Organization, Partial<Organization>>({
            query: (data) => ({ url: "organizations/", method: "POST", body: data }),
            invalidatesTags: ["Organization"],
        }),
        updateOrganization: builder.mutation<Organization, { id: string; data: Partial<Organization> }>({
            query: ({ id, data }) => ({ url: `organizations/${id}/`, method: "PUT", body: data }),
            invalidatesTags: ["Organization"],
        }),
        deleteOrganization: builder.mutation<void, string>({
            query: (id) => ({ url: `organizations/${id}/`, method: "DELETE" }),
            invalidatesTags: ["Organization"],
        }),
        getPositions: builder.query<InternshipPosition[], void>({
            query: () => ({ url: "positions/", method: "GET" }),
            providesTags: ["Position"],
        }),
        createPosition: builder.mutation<InternshipPosition, Partial<InternshipPosition>>({
            query: (data) => ({ url: "positions/", method: "POST", body: data }),
            invalidatesTags: ["Position"],
        }),
        updatePosition: builder.mutation<InternshipPosition, { id: string; data: Partial<InternshipPosition> }>({
            query: ({ id, data }) => ({ url: `positions/${id}/`, method: "PUT", body: data }),
            invalidatesTags: ["Position"],
        }),
        deletePosition: builder.mutation<void, string>({
            query: (id) => ({ url: `positions/${id}/`, method: "DELETE" }),
            invalidatesTags: ["Position"],
        }),
        getRecommendations: builder.query<InternshipPosition[], { top?: number; student_id?: number } | void>({
            query: (params) => ({
                url: "positions/recommendations/",
                method: "GET",
                params,
            }),
            providesTags: ["Position"],
        }),
        getApplications: builder.query<Application[], void>({
            query: () => ({ url: "applications/", method: "GET" }),
            providesTags: ["Application"],
        }),
        createApplication: builder.mutation<Application, FormData | Partial<Application>>({
            query: (data) => ({ url: "applications/", method: "POST", body: data }),
            invalidatesTags: ["Application"],
        }),
        updateApplication: builder.mutation<Application, { id: string; data: Partial<Application> }>({
            query: ({ id, data }) => ({ url: `applications/${id}/`, method: "PUT", body: data }),
            invalidatesTags: ["Application"],
        }),
        bulkUpdateApplicationStatus: builder.mutation<{ updated: number }, { ids: string[]; status: ApplicationStatus }>({
            query: (data) => ({
                url: "applications/bulk_status/",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Application"],
        }),
        deleteApplication: builder.mutation<void, string>({
            query: (id) => ({ url: `applications/${id}/`, method: "DELETE" }),
            invalidatesTags: ["Application"],
        }),
        getApplicationStatistics: builder.query<ApplicationStatistics, void>({
            query: () => ({ url: "applications/statistics/", method: "GET" }),
            providesTags: ["Analytics"],
        }),
        getPlacements: builder.query<Placement[], void>({
            query: () => ({ url: "placements/", method: "GET" }),
            providesTags: ["Placement"],
        }),
        createPlacement: builder.mutation<Placement, Partial<Placement>>({
            query: (data) => ({ url: "placements/", method: "POST", body: data }),
            invalidatesTags: ["Placement"],
        }),
        updatePlacement: builder.mutation<Placement, { id: string; data: Partial<Placement> }>({
            query: ({ id, data }) => ({ url: `placements/${id}/`, method: "PUT", body: data }),
            invalidatesTags: ["Placement"],
        }),
        deletePlacement: builder.mutation<void, string>({
            query: (id) => ({ url: `placements/${id}/`, method: "DELETE" }),
            invalidatesTags: ["Placement"],
        }),
        getPlacementStatistics: builder.query<PlacementStatistics, void>({
            query: () => ({ url: "placements/statistics/", method: "GET" }),
            providesTags: ["Analytics"],
        }),
    }),
});

export const {
    useGetOrganizationsQuery,
    useCreateOrganizationMutation,
    useUpdateOrganizationMutation,
    useDeleteOrganizationMutation,
    useGetPositionsQuery,
    useCreatePositionMutation,
    useUpdatePositionMutation,
    useDeletePositionMutation,
    useGetRecommendationsQuery,
    useGetApplicationsQuery,
    useCreateApplicationMutation,
    useUpdateApplicationMutation,
    useDeleteApplicationMutation,
    useBulkUpdateApplicationStatusMutation,
    useGetApplicationStatisticsQuery,
    useGetPlacementsQuery,
    useCreatePlacementMutation,
    useUpdatePlacementMutation,
    useDeletePlacementMutation,
    useGetPlacementStatisticsQuery,
} = internshipsSlice;
