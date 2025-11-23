
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
        <main
            className="min-h-screen flex flex-col justify-end pb-12 px-6 bg-cover bg-center bg-no-repeat relative"
            style={{ backgroundImage: 'url("/landing-bg.jpg")' }}
        >
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/40 z-0" />

            {/* Navigation Dock - Standard Flow */}
            <div className="relative z-10 w-full max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
                    {/* Patient Button */}
                    <button
                        onClick={handleStartSession}
                        className="group h-32 rounded-3xl bg-black/60 backdrop-blur-xl border-2 border-white/20 hover:border-[#89CFF0] transition-all duration-300 flex flex-col items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 shadow-lg"
                    >
                        <span className="text-2xl md:text-3xl font-bold text-white group-hover:text-[#89CFF0]" style={{ fontFamily: 'Avenir, sans-serif' }}>Patient</span>
                        <span className="text-xs text-white/60 uppercase tracking-widest">Start Session</span>
                    </button>

                    {/* Caregiver Link */}
                    <Link
                        href="/caregiver"
                        className="group h-32 rounded-3xl bg-black/60 backdrop-blur-xl border-2 border-white/20 hover:border-[#89CFF0] transition-all duration-300 flex flex-col items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 shadow-lg no-underline"
                    >
                        <span className="text-2xl md:text-3xl font-bold text-white group-hover:text-[#89CFF0]" style={{ fontFamily: 'Avenir, sans-serif' }}>Caregiver</span>
                        <span className="text-xs text-white/60 uppercase tracking-widest">Manage Profiles</span>
                    </Link>

                    {/* New Science Link */}
                    <Link
                        href="/science"
                        className="group h-32 rounded-3xl bg-black/60 backdrop-blur-xl border-2 border-white/20 hover:border-[#89CFF0] transition-all duration-300 flex flex-col items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 shadow-lg no-underline"
                    >
                        <span className="text-2xl md:text-3xl font-bold text-white group-hover:text-[#89CFF0]" style={{ fontFamily: 'Avenir, sans-serif' }}>New Science</span>
                        <span className="text-xs text-white/60 uppercase tracking-widest">Research & Tips</span>
                    </Link>

                    {/* Health & Wellness Link */}
                    <Link
                        href="/wellness"
                        className="group h-32 rounded-3xl bg-black/60 backdrop-blur-xl border-2 border-white/20 hover:border-[#89CFF0] transition-all duration-300 flex flex-col items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 shadow-lg no-underline"
                    >
                        <span className="text-2xl md:text-3xl font-bold text-white group-hover:text-[#89CFF0]" style={{ fontFamily: 'Avenir, sans-serif' }}>Wellness</span>
                        <span className="text-xs text-white/60 uppercase tracking-widest">Health Metrics</span>
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

