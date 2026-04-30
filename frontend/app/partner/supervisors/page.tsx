"use client";

import { EmptyState, PartnerCard, PartnerPageShell } from "@/components/partner/PartnerUi";
import { useGetPartnerSupervisorsQuery } from "@/lib/redux/slices/InternshipsSlice";

export default function PartnerSupervisorsPage() {
    const { data: supervisors = [] } = useGetPartnerSupervisorsQuery();

    return (
        <PartnerPageShell>
            <PartnerCard>
                <h2 className="font-semibold text-slate-900">My Supervisors</h2>
                <p className="mt-1 text-sm text-slate-500">Supervisors are linked when their profile organization matches your organization name.</p>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {supervisors.length ? supervisors.map((supervisor) => (
                        <div key={supervisor.id} className="rounded-lg border border-slate-200 p-4">
                            <p className="font-semibold text-slate-900">{supervisor.user?.username}</p>
                            <p className="text-sm text-slate-500">{supervisor.user?.email}</p>
                            <p className="mt-2 text-sm text-slate-600">{supervisor.position}</p>
                        </div>
                    )) : <EmptyState message="No supervisors are linked to this organization yet." />}
                </div>
            </PartnerCard>
        </PartnerPageShell>
    );
}
