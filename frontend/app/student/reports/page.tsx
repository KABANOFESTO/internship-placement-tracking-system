"use client";

import { useState } from "react";
import { FileText, Upload, Download } from "lucide-react";
import { useGetReportsQuery, useCreateReportMutation } from "@/lib/redux/slices/ReportsSlice";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useGetMyDetailsMutation } from "@/lib/redux/slices/AuthSlice";

export default function StudentReportsPage() {
    const { data: reports, isLoading } = useGetReportsQuery();
    const [createReport, { isLoading: isSubmitting }] = useCreateReportMutation();
    const [getMyDetails, { data: userDetails }] = useGetMyDetailsMutation();

    const [type, setType] = useState<"WEEKLY" | "FINAL">("WEEKLY");
    const [file, setFile] = useState<File | null>(null);

    const handleSubmit = async () => {
        if (!file) {
            toast.error("Please select a report file.");
            return;
        }
        try {
            const formData = new FormData();
            formData.append("type", type);
            formData.append("file", file);
            await createReport(formData).unwrap();
            toast.success("Report submitted.");
            setFile(null);
        } catch (error: any) {
            const studentError = error?.data?.student?.[0];
            const fileError = error?.data?.file?.[0];
            const typeError = error?.data?.type?.[0];
            toast.error(studentError || fileError || typeError || "Failed to submit report.");
        }
    };

    const loadLogoDataUrl = async (logoUrl: string): Promise<string | null> => {
        try {
            const response = await fetch(logoUrl);
            if (!response.ok) return null;
            const blob = await response.blob();
            return await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(blob);
            });
        } catch {
            return null;
        }
    };

    const handleExportPdf = async () => {
        if (!reports || reports.length === 0) {
            toast.error("No reports to export.");
            return;
        }
        try {
            if (!userDetails) {
                await getMyDetails({}).unwrap();
            }
            const exporterName = userDetails?.username || "Student";
            const doc = new jsPDF();

            const logoDataUrl = await loadLogoDataUrl("/logo.png");
            if (logoDataUrl) {
                doc.addImage(logoDataUrl, "PNG", 14, 10, 20, 20);
            }

            doc.setFontSize(16);
            doc.text("Internship Reports Summary", 40, 18);
            doc.setFontSize(10);
            doc.text(`Exported on ${new Date().toLocaleString()}`, 40, 24);

            const tableBody = reports.map((report) => [
                report.id,
                report.type,
                report.submitted_at ? new Date(report.submitted_at).toLocaleDateString() : "-",
                report.feedback ? "Yes" : "No",
            ]);

            autoTable(doc, {
                startY: 32,
                head: [["ID", "Type", "Submitted", "Feedback"]],
                body: tableBody,
                styles: { fontSize: 9 },
                headStyles: { fillColor: [37, 99, 235] },
            });

            const pageHeight = doc.internal.pageSize.height || 297;
            doc.setFontSize(9);
            doc.text(`Exported by ${exporterName}`, 14, pageHeight - 10);

            doc.save("internship-reports.pdf");
            toast.success("PDF exported.");
        } catch {
            toast.error("Failed to export PDF.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="p-6 lg:p-8">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
                        <p className="mt-1 text-sm text-gray-500">Submit and track internship reports</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleExportPdf}
                            className="inline-flex items-center rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                            <Download className="mr-2 h-4 w-4" />
                            Export PDF
                        </button>
                        <FileText className="h-6 w-6 text-gray-400" />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-1 rounded-2xl bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-900">Submit Report</h2>
                        <div className="mt-4 space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">Report Type</label>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value as "WEEKLY" | "FINAL")}
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                                >
                                    <option value="WEEKLY">Weekly</option>
                                    <option value="FINAL">Final</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Upload File</label>
                                <input
                                    type="file"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                                />
                            </div>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
                            >
                                <Upload className="mr-2 h-4 w-4" />
                                {isSubmitting ? "Submitting..." : "Submit Report"}
                            </button>
                        </div>
                    </div>

                    <div className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-900">Submitted Reports</h2>
                        {isLoading && <p className="mt-4 text-sm text-gray-500">Loading reports...</p>}
                        {!isLoading && (!reports || reports.length === 0) && (
                            <div className="mt-4 rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">
                                No reports submitted yet.
                            </div>
                        )}
                        {!isLoading && reports && reports.length > 0 && (
                            <div className="mt-4 space-y-3">
                                {reports.map((report) => (
                                    <div key={report.id} className="flex items-start justify-between rounded-xl border border-gray-200 p-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{report.type} report</p>
                                            <p className="mt-1 text-xs text-gray-500">
                                                Submitted {formatDistanceToNow(new Date(report.submitted_at), { addSuffix: true })}
                                            </p>
                                            {report.feedback && (
                                                <p className="mt-2 text-xs text-gray-600">Feedback: {report.feedback}</p>
                                            )}
                                        </div>
                                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700">{report.type}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
