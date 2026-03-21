"use client";

import { useState } from "react";
import {
    useGetPositionsQuery,
    useCreatePositionMutation,
    useUpdatePositionMutation,
    useDeletePositionMutation,
    useGetOrganizationsQuery,
} from "@/lib/redux/slices/InternshipsSlice";
import { toast } from "sonner";

export default function AdminInternshipManagementPage() {
    const { data: positions, isLoading } = useGetPositionsQuery();
    const { data: organizations } = useGetOrganizationsQuery();
    const [createPosition, { isLoading: isSaving }] = useCreatePositionMutation();
    const [updatePosition, { isLoading: isUpdating }] = useUpdatePositionMutation();
    const [deletePosition] = useDeletePositionMutation();

    const [title, setTitle] = useState("");
    const [organization, setOrganization] = useState("");
    const [description, setDescription] = useState("");
    const [skills, setSkills] = useState("");
    const [capacity, setCapacity] = useState("");

    const [editId, setEditId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editOrganization, setEditOrganization] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editSkills, setEditSkills] = useState("");
    const [editCapacity, setEditCapacity] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const handleCreate = async () => {
        if (!title || !organization || !description || !capacity) {
            toast.error("Title, organization, description, and capacity are required.");
            return;
        }
        try {
            await createPosition({
                title,
                organization,
                description,
                required_skills: skills,
                capacity: Number(capacity),
            }).unwrap();
            toast.success("Internship position created.");
            setTitle("");
            setOrganization("");
            setDescription("");
            setSkills("");
            setCapacity("");
        } catch {
            toast.error("Failed to create position.");
        }
    };

    const startEdit = (pos: any) => {
        setEditId(pos.id);
        setEditTitle(pos.title || "");
        setEditOrganization(pos.organization || "");
        setEditDescription(pos.description || "");
        setEditSkills(pos.required_skills || "");
        setEditCapacity(String(pos.capacity ?? ""));
    };

    const handleUpdate = async () => {
        if (!editId) return;
        try {
            await updatePosition({
                id: editId,
                data: {
                    title: editTitle,
                    organization: editOrganization,
                    description: editDescription,
                    required_skills: editSkills,
                    capacity: Number(editCapacity),
                },
            }).unwrap();
            toast.success("Position updated.");
            setEditId(null);
        } catch {
            toast.error("Failed to update position.");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deletePosition(id).unwrap();
            toast.success("Position deleted.");
        } catch {
            toast.error("Failed to delete position.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="p-6 lg:p-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Internship Management</h1>
                    <p className="mt-1 text-sm text-gray-500">Create and manage internship positions</p>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-1">
                        <div className="rounded-2xl bg-white p-6 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-900">Create Position</h2>
                            <div className="mt-4 space-y-4">
                                <input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                    placeholder="Position title"
                                />
                                <select
                                    value={organization}
                                    onChange={(e) => setOrganization(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                >
                                    <option value="">Select organization</option>
                                    {organizations?.map((org) => (
                                        <option key={org.id} value={org.id}>
                                            {org.name}
                                        </option>
                                    ))}
                                </select>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                    placeholder="Position description"
                                />
                                <input
                                    value={skills}
                                    onChange={(e) => setSkills(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                    placeholder="Required skills (comma separated)"
                                />
                                <input
                                    value={capacity}
                                    onChange={(e) => setCapacity(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                    placeholder="Capacity"
                                />
                                <button
                                    onClick={handleCreate}
                                    disabled={isSaving}
                                    className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
                                >
                                    {isSaving ? "Saving..." : "Create Position"}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                        <div className="rounded-2xl bg-white p-6 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-900">Positions</h2>
                            <div className="mt-3">
                                <input
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                    placeholder="Search positions"
                                />
                            </div>
                            {isLoading && <p className="mt-4 text-sm text-gray-500">Loading positions...</p>}
                            {!isLoading && (!positions || positions.length === 0) && (
                                <div className="mt-4 rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">
                                    No positions yet.
                                </div>
                            )}
                            {!isLoading && positions && positions.length > 0 && (
                                <div className="mt-4 space-y-3">
                                    {positions
                                        .filter((pos) =>
                                            searchTerm
                                                ? pos.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                  pos.required_skills.toLowerCase().includes(searchTerm.toLowerCase())
                                                : true
                                        )
                                        .map((pos) => (
                                        <div key={pos.id} className="rounded-xl border border-gray-200 p-4">
                                            <p className="text-sm font-medium text-gray-900">{pos.title}</p>
                                            <p className="text-xs text-gray-500">Organization: {pos.organization}</p>
                                            <p className="text-xs text-gray-500">Capacity: {pos.capacity}</p>
                                            <p className="text-xs text-gray-500">Skills: {pos.required_skills}</p>
                                            <div className="mt-3 flex items-center gap-2">
                                                <button
                                                    onClick={() => startEdit(pos)}
                                                    className="rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(pos.id)}
                                                    className="rounded-md border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {editId && (
                            <div className="rounded-2xl bg-white p-6 shadow-sm">
                                <h2 className="text-lg font-semibold text-gray-900">Edit Position</h2>
                                <div className="mt-4 space-y-4">
                                    <input
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                        placeholder="Position title"
                                    />
                                    <select
                                        value={editOrganization}
                                        onChange={(e) => setEditOrganization(e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                    >
                                        <option value="">Select organization</option>
                                        {organizations?.map((org) => (
                                            <option key={org.id} value={org.id}>
                                                {org.name}
                                            </option>
                                        ))}
                                    </select>
                                    <textarea
                                        value={editDescription}
                                        onChange={(e) => setEditDescription(e.target.value)}
                                        rows={3}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                        placeholder="Description"
                                    />
                                    <input
                                        value={editSkills}
                                        onChange={(e) => setEditSkills(e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                        placeholder="Required skills"
                                    />
                                    <input
                                        value={editCapacity}
                                        onChange={(e) => setEditCapacity(e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                        placeholder="Capacity"
                                    />
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={handleUpdate}
                                            disabled={isUpdating}
                                            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
                                        >
                                            Save Changes
                                        </button>
                                        <button
                                            onClick={() => setEditId(null)}
                                            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
