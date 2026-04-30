"use client";

import PartnerNavbar from "@/components/partner/Navbar";
import PartnerSidebar from "@/components/partner/Sidebar";

export default function PartnerLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="min-h-screen bg-slate-50">
            <PartnerSidebar />
            <div className="md:ml-[280px]">
                <PartnerNavbar />
                <main>{children}</main>
            </div>
        </div>
    );
}
