"use client";

import { useMemo, useState } from "react";
import { Briefcase, Calendar, CheckCircle2, Clock, FileText, Plus, Search, Upload, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
    useGetApplicationsQuery,
    useGetPositionsQuery,
    useCreateApplicationMutation,
    useGetRecommendationsQuery,
} from "@/lib/redux/slices/InternshipsSlice";

export default function StudentApplicationsPage() {
    const [activeTab, setActiveTab] = useState<"applications" | "positions">("applications");
    const [searchTerm, setSearchTerm] = useState("");
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [selectedPositionId, setSelectedPositionId] = useState<string | null>(null);
    const [coverLetter, setCoverLetter] = useState("");
    const [cvFile, setCvFile] = useState<File | null>(null);

    const { data: applications } = useGetApplicationsQuery();
    const { data: positions } = useGetPositionsQuery();
    const { data: recommendations } = useGetRecommendationsQuery({ top: 6 });
    const [createApplication, { isLoading: isSubmitting }] = useCreateApplicationMutation();

    const filteredApplications = useMemo(() => {
        if (!applications) return [];
        if (!searchTerm) return applications;
        return applications.filter((app) => app.position.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [applications, searchTerm]);

    const positionMap = useMemo(() => {
        const map = new Map<string, string>();
        positions?.forEach((pos) => map.set(pos.id, pos.title));
        return map;
    }, [positions]);

    const filteredPositions = useMemo(() => {
        if (!positions) return [];
        if (!searchTerm) return positions;
        return positions.filter((pos) => pos.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [positions, searchTerm]);

    const handleSubmit = async () => {
        if (!selectedPositionId || !coverLetter || !cvFile) return;
        const formData = new FormData();
        formData.append("position", selectedPositionId);
        formData.append("cover_letter", coverLetter);
        formData.append("cv", cvFile);
        await createApplication(formData).unwrap();
        setShowApplyModal(false);
        setSelectedPositionId(null);
        setCoverLetter("");
        setCvFile(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="p-6 lg:p-8">
                <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Internship Applications</h1>
                        <p className="mt-1 text-sm text-gray-500">Apply for new positions and track your application progress</p>
                    </div>
                    <button
                        onClick={() => {
                            setActiveTab("positions");
                            setShowApplyModal(true);
                        }}
                        className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        New Application
                    </button>
                </div>

                <div className="mb-6 flex items-center gap-6 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab("applications")}
                        className={`pb-3 text-sm font-medium ${
                            activeTab === "applications" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"
                        }`}
                    >
                        My Applications
                    </button>
                    <button
                        onClick={() => setActiveTab("positions")}
                        className={`pb-3 text-sm font-medium ${
                            activeTab === "positions" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"
                        }`}
                    >
                        Available Positions
                    </button>
                </div>

                <div className="mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none"
                            placeholder={activeTab === "applications" ? "Search applications..." : "Search positions..."}
                        />
                    </div>
                </div>

                {activeTab === "applications" && (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {filteredApplications.length === 0 && (
                            <div className="rounded-2xl bg-white p-8 text-center text-sm text-gray-500">
                                No applications yet. Browse available positions to apply.
                            </div>
                        )}
                        {filteredApplications.map((app) => (
                            <div key={app.id} className="rounded-2xl bg-white p-6 shadow-sm">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">Application #{app.id.slice(0, 8)}</h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Position: {positionMap.get(app.position) || app.position}
                                        </p>
                                        <div className="mt-3 flex items-center gap-3 text-sm text-gray-500">
                                            <Calendar className="h-4 w-4" />
                                            Applied {formatDistanceToNow(new Date(app.created_at), { addSuffix: true })}
                                        </div>
                                    </div>
                                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                                        {app.status}
                                    </span>
                                </div>
                                <div className="mt-4 flex items-center gap-3 text-sm text-gray-500">
                                    <FileText className="h-4 w-4" />
                                    Cover letter submitted
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === "positions" && (
                    <div className="space-y-6">
                        {recommendations && recommendations.length > 0 && (
                            <div className="rounded-2xl bg-blue-50 p-6">
                                <h2 className="text-lg font-semibold text-blue-900">Recommended for You</h2>
                                <p className="mt-1 text-sm text-blue-700">
                                    Based on your skills and profile details.
                                </p>
                                <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                                    {recommendations.map((pos) => (
                                        <div key={pos.id} className="rounded-xl bg-white p-4 shadow-sm">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">{pos.title}</h3>
                                                    <p className="text-sm text-gray-500">Organization ID: {pos.organization}</p>
                                                </div>
                                                <span className="rounded-full bg-green-50 px-2 py-1 text-xs text-green-700">
                                                    Match {Math.round((pos.match_score || 0) * 100)}%
                                                </span>
                                            </div>
                                            <p className="mt-2 text-sm text-gray-600">{pos.description}</p>
                                            <button
                                                onClick={() => {
                                                    setSelectedPositionId(pos.id);
                                                    setShowApplyModal(true);
                                                }}
                                                className="mt-3 inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
                                            >
                                                Apply now
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-6">
                            {filteredPositions.length === 0 && (
                                <div className="rounded-2xl bg-white p-8 text-center text-sm text-gray-500">
                                    No positions available at the moment.
                                </div>
                            )}
                            {filteredPositions.map((pos) => (
                                <div key={pos.id} className="rounded-2xl bg-white p-6 shadow-sm">
                                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900">{pos.title}</h3>
                                            <p className="mt-1 text-sm text-gray-500">Organization ID: {pos.organization}</p>
                                            <p className="mt-2 text-sm text-gray-600">{pos.description}</p>
                                            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Briefcase className="h-4 w-4" />
                                                    Capacity: {pos.capacity}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-4 w-4" />
                                                    Skills: {pos.required_skills}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setSelectedPositionId(pos.id);
                                                setShowApplyModal(true);
                                            }}
                                            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                                        >
                                            <CheckCircle2 className="mr-2 h-4 w-4" />
                                            Apply Now
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {showApplyModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">Submit Application</h2>
                            <button onClick={() => setShowApplyModal(false)} className="rounded-lg p-2 hover:bg-gray-100">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="mt-4 space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">Select Position</label>
                                <select
                                    value={selectedPositionId || ""}
                                    onChange={(e) => setSelectedPositionId(e.target.value)}
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                                >
                                    <option value="">Choose a position</option>
                                    {positions?.map((pos) => (
                                        <option key={pos.id} value={pos.id}>
                                            {pos.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Cover Letter</label>
                                <textarea
                                    value={coverLetter}
                                    onChange={(e) => setCoverLetter(e.target.value)}
                                    rows={5}
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                                    placeholder="Write a short cover letter"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Upload CV</label>
                                <div className="mt-2 flex items-center gap-3">
                                    <label className="inline-flex cursor-pointer items-center rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700">
                                        <Upload className="mr-2 h-4 w-4" />
                                        Choose file
                                        <input
                                            type="file"
                                            className="hidden"
                                            onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                                        />
                                    </label>
                                    <span className="text-sm text-gray-500">
                                        {cvFile ? cvFile.name : "No file selected"}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => setShowApplyModal(false)}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-60"
                            >
                                {isSubmitting ? "Submitting..." : "Submit Application"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
