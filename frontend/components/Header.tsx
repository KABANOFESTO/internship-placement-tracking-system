'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full font-sans">
            {/* Main Header Bar */}
            <div
                className="relative overflow-hidden border-b border-blue-900/30"
                style={{
                    background: 'linear-gradient(90deg, #050d1a 0%, #071224 40%, #0a1a35 70%, #0d2040 100%)',
                    boxShadow: '0 1px 40px rgba(37,99,235,0.08)',
                }}
            >
                {/* Glow blobs */}
                <div className="pointer-events-none absolute -top-16 right-[10%] w-80 h-36 rounded-full bg-blue-600/10 blur-3xl" />
                <div className="pointer-events-none absolute -top-10 right-[25%] w-48 h-24 rounded-full bg-blue-400/10 blur-2xl" />

                <div className="relative mx-auto flex items-center justify-between px-6 py-3 max-w-7xl">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3">
                        <div
                            className="rounded-xl p-1 shadow-lg"
                            style={{
                                background: 'linear-gradient(135deg, #1d4ed8, #2563eb)',
                                boxShadow: '0 0 16px rgba(37,99,235,0.4)',
                            }}
                        >
                            <Image
                                src="/logo.png"
                                alt="Internaship logo"
                                height={40}
                                width={40}
                                className="rounded-lg block"
                            />
                        </div>
                        <div className="flex flex-col justify-center">
                            <span className="text-[0.68rem] tracking-widest uppercase text-slate-400/80 font-normal">
                                Internaship & Placement
                            </span>
                            <span className="text-[1.05rem] font-bold text-slate-50 tracking-tight leading-tight">
                                Platform
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        {[
                            { label: 'Home', href: '/' },
                            { label: 'Features', href: '/features' },
                            { label: 'About', href: '/about' },
                        ].map(({ label, href }) => (
                            <Link
                                key={label}
                                href={href}
                                className="relative text-sm font-medium text-slate-300/85 hover:text-blue-300 transition-colors duration-200 group pb-0.5"
                            >
                                {label}
                                <span className="absolute bottom-0 left-0 h-[1.5px] w-0 group-hover:w-full bg-gradient-to-r from-blue-500 to-blue-300 rounded-full transition-all duration-300" />
                            </Link>
                        ))}
                    </nav>

                    {/* Auth Buttons — Desktop */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link
                            href="/auth"
                            className="px-5 py-2 rounded-lg text-sm font-medium text-blue-300 border border-blue-500/50 hover:bg-blue-500/10 hover:border-blue-400 hover:text-blue-200 transition-all duration-200"
                        >
                            Login
                        </Link>
                        <Link
                            href="/auth/signup"
                            className="px-5 py-2 rounded-lg text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-px"
                            style={{
                                background: 'linear-gradient(135deg, #1d4ed8, #2563eb)',
                                boxShadow: '0 0 14px rgba(37,99,235,0.35)',
                            }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 22px rgba(59,130,246,0.55)';
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 14px rgba(37,99,235,0.35)';
                            }}
                        >
                            Register
                        </Link>
                    </div>

                    {/* Mobile Hamburger */}
                    <button
                        className="md:hidden p-1.5 text-slate-300 hover:text-blue-300 transition-colors"
                        aria-label="Toggle menu"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                            {menuOpen
                                ? <path d="M6 18L18 6M6 6l12 12" />
                                : <path d="M4 6h16M4 12h16M4 18h16" />
                            }
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div
                    className="md:hidden flex flex-col gap-3 px-6 py-4 border-t border-blue-900/20"
                    style={{ background: '#071224' }}
                >
                    {[
                        { label: 'Home', href: '/' },
                        { label: 'Features', href: '/features' },
                        { label: 'About', href: '/about' },
                    ].map(({ label, href }) => (
                        <Link
                            key={label}
                            href={href}
                            onClick={() => setMenuOpen(false)}
                            className="text-sm font-medium text-slate-300/85 hover:text-blue-300 transition-colors border-b border-blue-900/20 pb-3"
                        >
                            {label}
                        </Link>
                    ))}
                    <div className="flex gap-3 pt-1">
                        <Link
                            href="/auth"
                            onClick={() => setMenuOpen(false)}
                            className="flex-1 text-center px-4 py-2 rounded-lg text-sm font-medium text-blue-300 border border-blue-500/50 hover:bg-blue-500/10 transition-all"
                        >
                            Login
                        </Link>
                        <Link
                            href="/auth"
                            onClick={() => setMenuOpen(false)}
                            className="flex-1 text-center px-4 py-2 rounded-lg text-sm font-semibold text-white"
                            style={{
                                background: 'linear-gradient(135deg, #1d4ed8, #2563eb)',
                                boxShadow: '0 0 14px rgba(37,99,235,0.3)',
                            }}
                        >
                            Register
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}