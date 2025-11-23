
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { SessionView } from '@/components/SessionView';
import { db } from '@/lib/db/service';
import { Profile } from '@/lib/db/types';

export default function Home() {
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [activeProfile, setActiveProfile] = useState<Profile | null>(null);

    useEffect(() => {
        // Load the most recent profile as default
        db.getProfiles().then(profiles => {
            if (profiles.length > 0) {
                setActiveProfile(profiles[profiles.length - 1]);
            }
        });
    }, []);

    const handleStartSession = () => {
        if (!activeProfile) {
            alert("Please ask your caregiver to create a profile first.");
            return;
        }
        setIsSessionActive(true);
    };

    return (
        <main className="min-h-screen flex flex-col relative bg-[var(--primary)]">
            {/* Immersive Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-[var(--primary)]/40 to-[var(--primary)]/90 z-10" />
                <Image
                    src="/landing-bg.jpg"
                    alt="Comforting Background"
                    fill
                    className="object-cover object-center opacity-60"
                    priority
                />
            </div>

            {/* Main Content Area (pushes dock to bottom) */}
            <div className="flex-1 relative z-20"></div>

            {/* Navigation Dock - Standard Flow */}
            <div className="relative z-20 p-6 pb-12 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/80 to-transparent mt-auto">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
                    {/* Patient Button */}
                    <button
                        onClick={handleStartSession}
                        className="group relative h-32 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10 hover:border-[#89CFF0] hover:bg-[#89CFF0]/10 transition-all duration-500 flex flex-col items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(137,207,240,0.2)] hover:-translate-y-2"
                    >
                        <span className="text-2xl md:text-3xl font-bold text-white group-hover:text-[#89CFF0] transition-colors" style={{ fontFamily: 'Avenir, sans-serif' }}>Patient</span>
                        <span className="text-xs text-white/40 uppercase tracking-widest group-hover:text-[#89CFF0]/60">Start Session</span>
                    </button>

                    {/* Caregiver Link */}
                    <Link
                        href="/caregiver"
                        className="group relative h-32 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10 hover:border-[#89CFF0] hover:bg-[#89CFF0]/10 transition-all duration-500 flex flex-col items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(137,207,240,0.2)] hover:-translate-y-2 no-underline"
                    >
                        <span className="text-2xl md:text-3xl font-bold text-white group-hover:text-[#89CFF0] transition-colors" style={{ fontFamily: 'Avenir, sans-serif' }}>Caregiver</span>
                        <span className="text-xs text-white/40 uppercase tracking-widest group-hover:text-[#89CFF0]/60">Manage Profiles</span>
                    </Link>

                    {/* New Science Link */}
                    <Link
                        href="/science"
                        className="group relative h-32 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10 hover:border-[#89CFF0] hover:bg-[#89CFF0]/10 transition-all duration-500 flex flex-col items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(137,207,240,0.2)] hover:-translate-y-2 no-underline"
                    >
                        <span className="text-2xl md:text-3xl font-bold text-white group-hover:text-[#89CFF0] transition-colors" style={{ fontFamily: 'Avenir, sans-serif' }}>New Science</span>
                        <span className="text-xs text-white/40 uppercase tracking-widest group-hover:text-[#89CFF0]/60">Research & Tips</span>
                    </Link>

                    {/* Health & Wellness Link */}
                    <Link
                        href="/wellness"
                        className="group relative h-32 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10 hover:border-[#89CFF0] hover:bg-[#89CFF0]/10 transition-all duration-500 flex flex-col items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(137,207,240,0.2)] hover:-translate-y-2 no-underline"
                    >
                        <span className="text-2xl md:text-3xl font-bold text-white group-hover:text-[#89CFF0] transition-colors" style={{ fontFamily: 'Avenir, sans-serif' }}>Wellness</span>
                        <span className="text-xs text-white/40 uppercase tracking-widest group-hover:text-[#89CFF0]/60">Health Metrics</span>
                    </Link>
                </div>
            </div>

            {/* Session Overlay */}
            {isSessionActive && activeProfile && (
                <SessionView
                    profile={activeProfile}
                    onEndSession={() => setIsSessionActive(false)}
                />
            )}
        </main>
    );
}

