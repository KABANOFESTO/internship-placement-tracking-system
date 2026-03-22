"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { useGetApplicationsQuery, useGetPositionsQuery, useUpdateApplicationMutation, useBulkUpdateApplicationStatusMutation } from "@/lib/redux/slices/InternshipsSlice";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export default function CoordinatorApplicationsPage() {
    const { data: applications, isLoading } = useGetApplicationsQuery();`n    const { data: positions } = useGetPositionsQuery();
    const [updateApplication] = useUpdateApplicationMutation();
    const [bulkUpdate] = useBulkUpdateApplicationStatusMutation();

    const [statusMap, setStatusMap] = useState<Record<string, string>>({});
    const [selected, setSelected] = useState<Record<string, boolean>>({});

    const handleUpdateStatus = async (id: string) => {
        const status = statusMap[id];
        if (!status) {
            toast.error("Select a status first.");
            return;
        }
        try {
            await updateApplication({ id, data: { status } }).unwrap();
            toast.success("Application updated.");
        } catch {
            toast.error("Failed to update application.");
        }
    };

    const selectedIds = Object.entries(selected)
        .filter(([, checked]) => checked)
        .map(([id]) => id);

    const handleBulkUpdate = async (status: "PENDING" | "APPROVED" | "REJECTED") => {
        if (selectedIds.length === 0) {
            toast.error("Select at least one application.");
            return;
        }
        try {
            await bulkUpdate({ ids: selectedIds, status }).unwrap();
            toast.success("Applications updated.");
        } catch {
            toast.error("Failed to update applications.");
        }
    };
    const positionMap = new Map((positions || []).map((pos) => [pos.id, pos.title]));

    const resolvePositionTitle = (positionId: string) =>
        positionMap.get(positionId) || positionId;

    const resolveStudentName = (app: { student_details?: { user?: { username?: string; email?: string } }; student?: number }) =>
        app.student_details?.user?.username ||
        app.student_details?.user?.email ||
        `Student ${app.student}`;
    const handleExportPdf = () => {
        if (!applications || applications.length === 0) {
            toast.error("No applications to export.");
            return;
        }
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("Applications List", 14, 16);
        doc.setFontSize(10);
        doc.text(`Exported ${new Date().toLocaleString()}`, 14, 22);

        autoTable(doc, {
            startY: 28,
            head: [["ID", "Student", "Position", "Status", "Created"]],
            body: applications.map((app) => [
                app.id,
                resolveStudentName(app),
                resolvePositionTitle(app.position),
                app.status,
                new Date(app.created_at).toLocaleDateString(),
            ]),
            styles: { fontSize: 9 },
            headStyles: { fillColor: [37, 99, 235] },
        });

        doc.save("applications.pdf");
        toast.success("PDF exported.");
    };

    const handleExportExcel = () => {
        if (!applications || applications.length === 0) {
            toast.error("No applications to export.");
            return;
        }
        const data = applications.map((app) => ({
            id: app.id,
            student: resolveStudentName(app),
            position: resolvePositionTitle(app.position),
            status: app.status,
            created_at: app.created_at,
        }));
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Applications");
        XLSX.writeFile(workbook, "applications.xlsx");
        toast.success("Excel exported.");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="p-6 lg:p-8">
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
                        <p className="mt-1 text-sm text-gray-500">Review and update internship applications</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handleBulkUpdate("APPROVED")}
                            className="inline-flex items-center rounded-lg border border-emerald-200 px-3 py-2 text-sm text-emerald-700 hover:bg-emerald-50"
                        >
                            Bulk Approve
                        </button>
                        <button
                            onClick={() => handleBulkUpdate("REJECTED")}
                            className="inline-flex items-center rounded-lg border border-red-200 px-3 py-2 text-sm text-red-700 hover:bg-red-50"
                        >
                            Bulk Reject
                        </button>
                        <button
                            onClick={handleExportPdf}
                            className="inline-flex items-center rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                            <Download className="mr-2 h-4 w-4" />
                            Export PDF
                        </button>
                        <button
                            onClick={handleExportExcel}
                            className="inline-flex items-center rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                            <Download className="mr-2 h-4 w-4" />
                            Export Excel
                        </button>
                    </div>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm">
                    {isLoading && <p className="text-sm text-gray-500">Loading applications...</p>}
                    {!isLoading && (!applications || applications.length === 0) && (
                        <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">
                            No applications yet.
                        </div>
                    )}
                    {!isLoading && applications && applications.length > 0 && (
                        <div className="space-y-3">
                            {applications.map((app) => (
                                <div key={app.id} className="rounded-xl border border-gray-200 p-4">
                                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                                        <div>
                                            <label className="mr-3 inline-flex items-center gap-2 text-xs text-gray-500">
                                                <input
                                                    type="checkbox"
                                                    checked={!!selected[app.id]}
                                                    onChange={(e) =>
                                                        setSelected((prev) => ({ ...prev, [app.id]: e.target.checked }))
                                                    }
                                                />
                                                Select
                                            </label>
                                            <p className="text-sm font-medium text-gray-900">
                                                {resolveStudentName(app)}
                                            </p>
                                            <p className="text-xs text-gray-500">Position: {resolvePositionTitle(app.position)}</p>
                                            <p className="text-xs text-gray-500">Status: {app.status}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <select
                                                value={statusMap[app.id] || ""}
                                                onChange={(e) => setStatusMap((prev) => ({ ...prev, [app.id]: e.target.value }))}
                                                className="rounded-md border border-gray-300 px-2 py-1 text-xs"
                                            >
                                                <option value="">Set status</option>
                                                <option value="PENDING">Pending</option>
                                                <option value="APPROVED">Approved</option>
                                                <option value="REJECTED">Rejected</option>
                                            </select>
                                            <button
                                                onClick={() => handleUpdateStatus(app.id)}
                                                className="rounded-md bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700"
                                            >
                                                Update
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
