import React from 'react';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    const quickLinks = [
        { label: 'Task Assignment', href: '#tasks' },
        { label: 'Attendance Tracking', href: '#attendance' },
        { label: 'Performance Dashboard', href: '#dashboard' },
        { label: 'Reports', href: '#reports' },
        { label: 'Notifications', href: '#notifications' },
    ];

    const legalLinks = [
        { label: 'Privacy Policy', href: '#privacy' },
        { label: 'Terms of Use', href: '#terms' },
        { label: 'Data Protection', href: '#data' },
    ];

    const contactDetails = [
        {
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            text: 'Ndengera Polyclinic, Kigali, Rwanda',
        },
        {
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
            ),
            text: '+250 788 000 000',
        },
        {
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
            text: 'admin@ndengera-clinic.rw',
        },
        {
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            text: 'Mon – Sat: 7:00 AM – 6:00 PM',
        },
    ];

    return (
        <footer
            style={{
                background: 'linear-gradient(160deg, #0d1f2d 0%, #0a1929 60%, #0d2137 100%)',
                fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
            }}
            className="text-white"
        >
            {/* Top accent bar */}
            <div
                style={{
                    height: '3px',
                    background: 'linear-gradient(90deg, #0ea5e9, #38bdf8, #7dd3fc, #0ea5e9)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 3s linear infinite',
                }}
            />

            <style>{`
                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
                .footer-link {
                    position: relative;
                    display: inline-block;
                    transition: color 0.2s;
                }
                .footer-link::after {
                    content: '';
                    position: absolute;
                    bottom: -2px;
                    left: 0;
                    width: 0;
                    height: 1px;
                    background: #38bdf8;
                    transition: width 0.25s ease;
                }
                .footer-link:hover::after { width: 100%; }
                .footer-link:hover { color: #7dd3fc; }
            `}</style>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-14 pb-8">

                {/* Main grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

                    {/* Brand block */}
                    <div className="lg:col-span-1">
                        {/* Logo mark */}
                        <div className="flex items-center gap-3 mb-5">
                            <div
                                style={{
                                    background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                                    boxShadow: '0 0 20px rgba(14,165,233,0.35)',
                                }}
                                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                            >
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-sky-400 tracking-widest uppercase leading-none">
                                    Ndengera
                                </div>
                                <div className="text-white font-bold text-base leading-tight">
                                    Polyclinic
                                </div>
                            </div>
                        </div>

                        <p style={{ color: '#94a3b8', lineHeight: '1.7', fontSize: '0.875rem' }} className="mb-5">
                            A digital hygiene management platform built to streamline cleaning
                            operations, enforce compliance standards, and empower supervisors
                            with real-time data at Ndengera Polyclinic.
                        </p>

                        {/* Compliance badge */}
                        <div
                            style={{
                                background: 'rgba(14,165,233,0.08)',
                                border: '1px solid rgba(14,165,233,0.2)',
                                borderRadius: '8px',
                                padding: '8px 12px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                            }}
                        >
                            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                WHO Hygiene Compliance Ready
                            </span>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4
                            style={{
                                fontSize: '0.7rem',
                                letterSpacing: '0.12em',
                                color: '#64748b',
                                textTransform: 'uppercase',
                                fontWeight: 700,
                                marginBottom: '16px',
                            }}
                        >
                            System Modules
                        </h4>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className="footer-link"
                                        style={{ color: '#94a3b8', fontSize: '0.9rem' }}
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal / Support */}
                    <div>
                        <h4
                            style={{
                                fontSize: '0.7rem',
                                letterSpacing: '0.12em',
                                color: '#64748b',
                                textTransform: 'uppercase',
                                fontWeight: 700,
                                marginBottom: '16px',
                            }}
                        >
                            Legal & Support
                        </h4>
                        <ul className="space-y-3">
                            {legalLinks.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className="footer-link"
                                        style={{ color: '#94a3b8', fontSize: '0.9rem' }}
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>

                        {/* Support note */}
                        <div
                            style={{
                                marginTop: '20px',
                                padding: '12px',
                                background: 'rgba(255,255,255,0.03)',
                                borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.06)',
                            }}
                        >
                            <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '4px' }}>
                                Technical Support
                            </div>
                            <a
                                href="mailto:support@ndengera-clinic.rw"
                                className="footer-link"
                                style={{ fontSize: '0.82rem', color: '#7dd3fc' }}
                            >
                                support@ndengera-clinic.rw
                            </a>
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4
                            style={{
                                fontSize: '0.7rem',
                                letterSpacing: '0.12em',
                                color: '#64748b',
                                textTransform: 'uppercase',
                                fontWeight: 700,
                                marginBottom: '16px',
                            }}
                        >
                            Contact Us
                        </h4>
                        <ul className="space-y-4">
                            {contactDetails.map((item, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <span style={{ color: '#0ea5e9', marginTop: '2px', flexShrink: 0 }}>
                                        {item.icon}
                                    </span>
                                    <span style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: '1.5' }}>
                                        {item.text}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', marginBottom: '24px' }} />

                {/* Bottom bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p style={{ color: '#475569', fontSize: '0.8rem' }}>
                        © {currentYear} Ndengera Polyclinic — Cleaning Staff Management System.
                        All rights reserved.
                    </p>
                    <div className="flex items-center gap-2">
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }} />
                        <span style={{ color: '#475569', fontSize: '0.78rem' }}>
                            System operational
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;