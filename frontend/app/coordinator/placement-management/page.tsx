"use client";

import { useState } from "react";
import { useGetApplicationsQuery, useCreatePlacementMutation, useGetPlacementsQuery, useUpdatePlacementMutation } from "@/lib/redux/slices/InternshipsSlice";
import { useGetUsersByRoleQuery } from "@/lib/redux/slices/AuthSlice";
import { toast } from "sonner";

export default function CoordinatorPlacementManagementPage() {
    const { data: applications } = useGetApplicationsQuery();
    const { data: placements } = useGetPlacementsQuery();
    const { data: supervisors } = useGetUsersByRoleQuery("Supervisor");
    const [createPlacement, { isLoading: isSaving }] = useCreatePlacementMutation();
    const [updatePlacement] = useUpdatePlacementMutation();

    const [step, setStep] = useState(1);
    const [applicationId, setApplicationId] = useState("");
    const [supervisorId, setSupervisorId] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleNext = () => {
        if (step === 1 && !applicationId) {
            toast.error("Select an application first.");
            return;
        }
        if (step === 2 && (!startDate || !endDate)) {
            toast.error("Set start and end dates.");
            return;
        }
        setStep((prev) => Math.min(3, prev + 1));
    };

    const handleCreate = async () => {
        if (!applicationId || !startDate || !endDate) {
            toast.error("Application and dates are required.");
            return;
        }
        try {
            await createPlacement({
                application: applicationId,
                supervisor: supervisorId ? Number(supervisorId) : null,
                start_date: startDate,
                end_date: endDate,
                confirmed: true,
            }).unwrap();
            toast.success("Placement created.");
            setApplicationId("");
            setSupervisorId("");
            setStartDate("");
            setEndDate("");
            setStep(1);
        } catch {
            toast.error("Failed to create placement.");
        }
    };

    const handleConfirmToggle = async (id: string, confirmed: boolean) => {
        try {
            await updatePlacement({ id, data: { confirmed: !confirmed } }).unwrap();
            toast.success("Placement updated.");
        } catch {
            toast.error("Failed to update placement.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="p-6 lg:p-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Placement Workflow</h1>
                    <p className="mt-1 text-sm text-gray-500">Assign an application, set dates, and choose a supervisor</p>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center gap-4 text-sm text-gray-500">
                        <div className={`rounded-full px-3 py-1 ${step >= 1 ? "bg-blue-50 text-blue-600" : "bg-gray-100"}`}>
                            1. Application
                        </div>
                        <div className={`rounded-full px-3 py-1 ${step >= 2 ? "bg-blue-50 text-blue-600" : "bg-gray-100"}`}>
                            2. Dates
                        </div>
                        <div className={`rounded-full px-3 py-1 ${step >= 3 ? "bg-blue-50 text-blue-600" : "bg-gray-100"}`}>
                            3. Supervisor
                        </div>
                    </div>

                    {step === 1 && (
                        <div className="space-y-4">
                            <label className="text-sm font-medium text-gray-700">Select Application</label>
                            <select
                                value={applicationId}
                                onChange={(e) => setApplicationId(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            >
                                <option value="">Choose application</option>
                                {applications?.map((app) => (
                                    <option key={app.id} value={app.id}>
                                        {app.student_details?.user?.username || `Student ID ${app.student}`}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="text-sm font-medium text-gray-700">Start Date</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">End Date</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                                />
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4">
                            <label className="text-sm font-medium text-gray-700">Assign Supervisor (optional)</label>
                            <select
                                value={supervisorId}
                                onChange={(e) => setSupervisorId(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            >
                                <option value="">Select supervisor</option>
                                {supervisors?.map((sup: any) => (
                                    <option key={sup.id} value={sup.id}>
                                        {sup.username} ({sup.email})
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="mt-6 flex items-center justify-between">
                        <button
                            onClick={() => setStep((prev) => Math.max(1, prev - 1))}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                            Back
                        </button>
                        {step < 3 ? (
                            <button
                                onClick={handleNext}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                onClick={handleCreate}
                                disabled={isSaving}
                                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700 disabled:opacity-60"
                            >
                                {isSaving ? "Saving..." : "Create Placement"}
                            </button>
                        )}
                    </div>
                </div>

                <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900">Placements</h2>
                    {!placements || placements.length === 0 ? (
                        <div className="mt-4 rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">
                            No placements created yet.
                        </div>
                    ) : (
                        <div className="mt-4 space-y-3">
                            {placements.map((placement) => (
                                <div key={placement.id} className="rounded-xl border border-gray-200 p-4">
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {placement.student_details?.user?.username || `Placement ${placement.id}`}
                                            </p>
                                            <p className="text-xs text-gray-500">Application ID: {placement.application}</p>
                                            <p className="text-xs text-gray-500">Supervisor: {placement.supervisor || "Unassigned"}</p>
                                        </div>
                                        <button
                                            onClick={() => handleConfirmToggle(placement.id, placement.confirmed)}
                                            className={`rounded-md px-3 py-1 text-xs ${placement.confirmed ? "bg-emerald-600 text-white" : "bg-yellow-500 text-white"}`}
                                        >
                                            {placement.confirmed ? "Confirmed" : "Confirm"}
                                        </button>
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
