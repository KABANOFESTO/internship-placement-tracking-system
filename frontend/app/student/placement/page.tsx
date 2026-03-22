"use client";

import { useMemo } from "react";
import { Briefcase, Calendar, CheckCircle2 } from "lucide-react";
import { useGetPlacementsQuery } from "@/lib/redux/slices/InternshipsSlice";
import { format } from "date-fns";

export default function StudentPlacementPage() {
    const { data: placements, isLoading } = useGetPlacementsQuery();

    const confirmedPlacement = useMemo(() => {
        if (!placements) return null;
        return placements.find((p) => p.confirmed) || null;
    }, [placements]);

    const supervisorName =
        confirmedPlacement?.supervisor_details?.user?.username ||
        confirmedPlacement?.supervisor_details?.user?.email ||
        null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="p-6 lg:p-8">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Placement</h1>
                        <p className="mt-1 text-sm text-gray-500">Your internship placement details</p>
                    </div>
                    <Briefcase className="h-6 w-6 text-gray-400" />
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm">
                    {isLoading && <p className="text-sm text-gray-500">Loading placement...</p>}
                    {!isLoading && !confirmedPlacement && (
                        <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">
                            Placement has not been confirmed yet.
                        </div>
                    )}
                    {!isLoading && confirmedPlacement && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">Confirmed Internship Placement</h2>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {confirmedPlacement.student_details?.program || "Internship placement details"}
                                    </p>
                                </div>
                                <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs text-green-700">
                                    <CheckCircle2 className="mr-1 h-3 w-3" />
                                    Confirmed
                                </span>
                            </div>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="rounded-lg bg-gray-50 p-4">
                                    <p className="text-xs text-gray-500">Start Date</p>
                                    <p className="mt-1 text-sm font-medium text-gray-900">
                                        {format(new Date(confirmedPlacement.start_date), "MMM dd, yyyy")}
                                    </p>
                                </div>
                                <div className="rounded-lg bg-gray-50 p-4">
                                    <p className="text-xs text-gray-500">End Date</p>
                                    <p className="mt-1 text-sm font-medium text-gray-900">
                                        {format(new Date(confirmedPlacement.end_date), "MMM dd, yyyy")}
                                    </p>
                                </div>
                                <div className="rounded-lg bg-gray-50 p-4">
                                    <p className="text-xs text-gray-500">Program</p>
                                    <p className="mt-1 text-sm font-medium text-gray-900">
                                        {confirmedPlacement.student_details?.program || "Not available"}
                                    </p>
                                </div>
                                <div className="rounded-lg bg-gray-50 p-4">
                                    <p className="text-xs text-gray-500">Status</p>
                                    <p className="mt-1 text-sm font-medium text-gray-900">Confirmed</p>
                                </div>
                                <div className="rounded-lg bg-gray-50 p-4 sm:col-span-2">
                                    <p className="text-xs text-gray-500">Supervisor</p>
                                    <p className="mt-1 text-sm font-medium text-gray-900">
                                        {supervisorName || "Pending assignment"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Calendar className="h-4 w-4" />
                                Please contact your coordinator if dates need to be adjusted.
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
