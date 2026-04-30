"use client";

import { useState } from "react";
import { toast } from "sonner";
import { EmptyState, PartnerCard, PartnerField, PartnerPageShell } from "@/components/partner/PartnerUi";
import { useCreatePositionMutation, useGetPositionsQuery, useUpdatePositionMutation } from "@/lib/redux/slices/InternshipsSlice";

export default function PartnerPositionsPage() {
    const { data: positions = [] } = useGetPositionsQuery();
    const [createPosition] = useCreatePositionMutation();
    const [updatePosition] = useUpdatePositionMutation();
    const [form, setForm] = useState({
        title: "",
        description: "",
        required_skills: "",
        requirements: "",
        location: "",
        capacity: "",
        start_date: "",
        end_date: "",
    });

    const savePosition = async () => {
        if (!form.title || !form.description || !form.capacity) {
            toast.error("Title, description, and capacity are required.");
            return;
        }
        try {
            await createPosition({
                ...form,
                capacity: Number(form.capacity || 1),
                start_date: form.start_date || null,
                end_date: form.end_date || null,
                is_active: true,
            }).unwrap();
            setForm({ title: "", description: "", required_skills: "", requirements: "", location: "", capacity: "", start_date: "", end_date: "" });
            toast.success("Internship position created.");
        } catch {
            toast.error("Could not create position. Make sure your organization profile exists first.");
        }
    };

    return (
        <PartnerPageShell>
            <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
                <PartnerCard>
                    <h2 className="font-semibold text-slate-900">Create Position</h2>
                    <div className="mt-4 space-y-3">
                        <PartnerField label="Title" value={form.title} onChange={(value) => setForm({ ...form, title: value })} />
                        <PartnerField label="Location" value={form.location} onChange={(value) => setForm({ ...form, location: value })} />
                        <PartnerField label="Capacity" type="number" value={form.capacity} onChange={(value) => setForm({ ...form, capacity: value })} />
                        <PartnerField label="Start date" type="date" value={form.start_date} onChange={(value) => setForm({ ...form, start_date: value })} />
                        <PartnerField label="End date" type="date" value={form.end_date} onChange={(value) => setForm({ ...form, end_date: value })} />
                        <textarea placeholder="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" rows={3} />
                        <textarea placeholder="Required skills" value={form.required_skills} onChange={(event) => setForm({ ...form, required_skills: event.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" rows={2} />
                        <textarea placeholder="Requirements" value={form.requirements} onChange={(event) => setForm({ ...form, requirements: event.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" rows={2} />
                        <button onClick={savePosition} className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Create Position</button>
                    </div>
                </PartnerCard>

                <PartnerCard>
                    <h2 className="font-semibold text-slate-900">My Positions</h2>
                    <div className="mt-4 divide-y divide-slate-100">
                        {positions.length ? positions.map((position) => (
                            <div key={position.id} className="py-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="font-semibold text-slate-900">{position.title}</p>
                                        <p className="text-sm text-slate-500">{position.location || "No location"} - Capacity {position.capacity}</p>
                                        <p className="mt-1 text-sm text-slate-600">{position.required_skills}</p>
                                    </div>
                                    <button
                                        onClick={() => updatePosition({ id: position.id, data: { is_active: !position.is_active } })}
                                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700"
                                    >
                                        {position.is_active ? "Close" : "Reopen"}
                                    </button>
                                </div>
                            </div>
                        )) : <EmptyState message="No internship positions created yet." />}
                    </div>
                </PartnerCard>
            </div>
        </PartnerPageShell>
    );
}
