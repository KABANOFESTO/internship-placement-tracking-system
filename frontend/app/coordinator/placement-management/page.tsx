"use client";

import { useMemo } from "react";
import { BriefcaseBusiness, Building2, CalendarDays, CheckCircle2, Mail, UserRound } from "lucide-react";
import { useGetPlacementsQuery, useUpdatePlacementMutation } from "@/lib/redux/slices/InternshipsSlice";
import { toast } from "sonner";

export default function CoordinatorPlacementManagementPage() {
    const { data: placements } = useGetPlacementsQuery();
    const [updatePlacement] = useUpdatePlacementMutation();

    const sortedPlacements = useMemo(() => {
        return [...(placements || [])].sort((a, b) => (b.confirmed === a.confirmed ? 0 : b.confirmed ? 1 : -1));
    }, [placements]);

    const handleConfirmToggle = async (id: string, confirmed: boolean) => {
        try {
            await updatePlacement({ id, data: { confirmed: !confirmed } }).unwrap();
            toast.success("Placement updated.");
        } catch {
            toast.error("Failed to update placement.");
        }
    };

    const resolveStudentName = (student?: { user?: { username?: string; email?: string; first_name?: string; last_name?: string } }) => {
        const user = student?.user;
        if (!user) return "Student not available";
        return [user.first_name, user.last_name].filter(Boolean).join(" ").trim() || user.username || user.email || "Student";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="p-6 lg:p-8">
                <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Placement Workflow</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Review confirmed placements, monitor assigned students, and keep coordinator oversight focused on approvals.
                        </p>
                    </div>
                    <CheckCircle2 className="h-6 w-6 text-gray-400" />
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900">Placements</h2>
                    {!sortedPlacements || sortedPlacements.length === 0 ? (
                        <div className="mt-4 rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">
                            No placements available yet.
                        </div>
                    ) : (
                        <div className="mt-4 space-y-3">
                            {sortedPlacements.map((placement) => {
                                const app = placement.application_details;
                                const student = placement.student_details;
                                const position = app?.position_details;
                                const organization = position?.organization_details;
                                return (
                                    <div key={placement.id} className="rounded-xl border border-gray-200 p-4">
                                        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <p className="text-base font-semibold text-gray-900">
                                                        {resolveStudentName(student)}
                                                    </p>
                                                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${placement.confirmed ? "bg-emerald-50 text-emerald-700" : "bg-yellow-50 text-yellow-700"}`}>
                                                        {placement.confirmed ? "Confirmed" : "Pending"}
                                                    </span>
                                                </div>
                                                <div className="mt-3 grid gap-2 text-sm text-gray-600 md:grid-cols-2">
                                                    <p className="flex items-center gap-2">
                                                        <UserRound className="h-4 w-4 text-gray-400" />
                                                        Student ID: <span className="font-medium text-gray-900">{student?.student_id || "N/A"}</span>
                                                    </p>
                                                    <p className="flex items-center gap-2">
                                                        <Mail className="h-4 w-4 text-gray-400" />
                                                        <span className="break-all">{student?.user?.email || "No email provided"}</span>
                                                    </p>
                                                    <p className="flex items-center gap-2 md:col-span-2">
                                                        <BriefcaseBusiness className="h-4 w-4 text-gray-400" />
                                                        {position?.title || "Position not assigned"}
                                                    </p>
                                                    <p className="flex items-center gap-2 md:col-span-2">
                                                        <Building2 className="h-4 w-4 text-gray-400" />
                                                        {organization?.name || "Organization not assigned"}
                                                        {position?.location ? ` | ${position.location}` : ""}
                                                    </p>
                                                    <p className="flex items-center gap-2 md:col-span-2">
                                                        <CalendarDays className="h-4 w-4 text-gray-400" />
                                                        {placement.start_date} to {placement.end_date}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="w-full rounded-xl border border-gray-200 bg-gray-50 p-4 xl:w-80">
                                                <p className="text-sm font-semibold text-gray-900">Supervisor</p>
                                                <p className="mt-2 text-sm text-gray-700">
                                                    {placement.supervisor_details?.user?.username || "Unassigned"}
                                                </p>
                                                <p className="text-xs text-gray-500">{placement.supervisor_details?.user?.email || "No supervisor email"}</p>
                                                <p className="text-xs text-gray-500">{placement.supervisor_details?.user?.phone || "No supervisor phone"}</p>
                                                <button
                                                    onClick={() => handleConfirmToggle(placement.id, placement.confirmed)}
                                                    className={`mt-4 w-full rounded-md px-3 py-2 text-xs font-semibold ${placement.confirmed ? "bg-emerald-600 text-white" : "bg-yellow-500 text-white"}`}
                                                >
                                                    {placement.confirmed ? "Confirmed" : "Confirm Placement"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
