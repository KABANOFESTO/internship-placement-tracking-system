"use client";

export default function SupervisorAttendanceTrackingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="p-6 lg:p-8">
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                    <h1 className="text-3xl font-bold text-gray-900">Attendance Tracking</h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Attendance tracking is not yet configured in the backend. Once attendance endpoints are enabled,
                        this page will show intern attendance summaries and daily check-ins.
                    </p>
                </div>
            </div>
        </div>
    );
}
