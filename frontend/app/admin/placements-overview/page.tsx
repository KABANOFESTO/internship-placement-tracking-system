"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { useGetPlacementsQuery, useUpdatePlacementMutation } from "@/lib/redux/slices/InternshipsSlice";
import { toast } from "sonner";

export default function AdminPlacementsOverviewPage() {
    const { data: placements, isLoading } = useGetPlacementsQuery();
    const [updatePlacement] = useUpdatePlacementMutation();
    const [confirming, setConfirming] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const handleToggleConfirm = async (id: string, confirmed: boolean) => {
        try {
            setConfirming(id);
            await updatePlacement({ id, data: { confirmed } }).unwrap();
            toast.success("Placement updated.");
        } catch {
            toast.error("Failed to update placement.");
        } finally {
            setConfirming(null);
        }
    };

    const filteredPlacements = (placements || []).filter((placement) => {
        const studentName = placement.student_details?.user?.username || `Student ${placement.application}`;
        const matchesSearch = searchTerm
            ? studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
              String(placement.application).toLowerCase().includes(searchTerm.toLowerCase())
            : true;
        const matchesStatus =
            statusFilter === "ALL"
                ? true
                : statusFilter === "CONFIRMED"
                ? placement.confirmed
                : !placement.confirmed;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="p-6 lg:p-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Placements Overview</h1>
                    <p className="mt-1 text-sm text-gray-500">Track internship placements and confirmation status</p>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm">
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm sm:max-w-sm"
                            placeholder="Search by student or application"
                        />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        >
                            <option value="ALL">All Status</option>
                            <option value="CONFIRMED">Confirmed</option>
                            <option value="PENDING">Pending</option>
                        </select>
                    </div>
                    {isLoading && <p className="text-sm text-gray-500">Loading placements...</p>}
                    {!isLoading && filteredPlacements.length === 0 && (
                        <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">
                            No placements yet.
                        </div>
                    )}
                    {!isLoading && filteredPlacements.length > 0 && (
                        <div className="space-y-3">
                            {filteredPlacements.map((placement) => (
                                <div key={placement.id} className="rounded-xl border border-gray-200 p-4">
                                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {placement.student_details?.user?.username || `Student ID ${placement.application}`}
                                            </p>
                                            <p className="text-xs text-gray-500">Application: {placement.application}</p>
                                            <p className="text-xs text-gray-500">
                                                Dates: {new Date(placement.start_date).toLocaleDateString()} - {new Date(placement.end_date).toLocaleDateString()}
                                            </p>
                                            <p className="text-xs text-gray-500">Supervisor: {placement.supervisor ?? "Unassigned"}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                                    placement.confirmed ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                                                }`}
                                            >
                                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                                {placement.confirmed ? "Confirmed" : "Pending"}
                                            </span>
                                            <button
                                                onClick={() => handleToggleConfirm(placement.id, !placement.confirmed)}
                                                disabled={confirming === placement.id}
                                                className="rounded-md border border-gray-200 px-3 py-1 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                                            >
                                                {confirming === placement.id ? "Updating..." : "Toggle"}
                                            </button>
                                        </div>
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
