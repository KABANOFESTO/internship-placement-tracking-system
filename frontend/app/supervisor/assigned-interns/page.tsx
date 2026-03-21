"use client";

import { useGetPlacementsQuery } from "@/lib/redux/slices/InternshipsSlice";

export default function SupervisorAssignedInternsPage() {
    const { data: placements, isLoading } = useGetPlacementsQuery();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="p-6 lg:p-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Assigned Interns</h1>
                    <p className="mt-1 text-sm text-gray-500">Placements assigned to you</p>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm">
                    {isLoading && <p className="text-sm text-gray-500">Loading placements...</p>}
                    {!isLoading && (!placements || placements.length === 0) && (
                        <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">
                            No interns assigned yet.
                        </div>
                    )}
                    {!isLoading && placements && placements.length > 0 && (
                        <div className="space-y-3">
                            {placements.map((placement) => (
                                <div key={placement.id} className="rounded-xl border border-gray-200 p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Placement #{placement.id}</p>
                                            <p className="text-xs text-gray-500">Application ID: {placement.application}</p>
                                        </div>
                                        <span className={`rounded-full px-3 py-1 text-xs ${placement.confirmed ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}>
                                            {placement.confirmed ? "Confirmed" : "Pending"}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
