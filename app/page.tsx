
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
        <main className="min-h-screen flex flex-col items-center justify-end pb-32 relative overflow-hidden bg-[var(--primary)]">
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

            {/* Right-Side Vertical Navigation Stack */}
            <div className="fixed right-8 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-6 items-end animate-in slide-in-from-right-10 duration-1000">

                {/* Microphone / Start Session Icon */}
                <button
                    onClick={handleStartSession}
                    className="w-20 h-20 bg-[var(--primary)] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(137,207,240,0.6)] hover:scale-110 transition-transform mb-4"
                    aria-label="Start Session"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black">
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                        <line x1="12" y1="19" x2="12" y2="23" />
                        <line x1="8" y1="23" x2="16" y2="23" />
                    </svg>
                </button>

                {/* 1. Patient Comfort (Start Session) */}
                <button
                    onClick={handleStartSession}
                    className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl hover:scale-105 transition-transform group"
                >
                    <Image
                        src="/assets/user-photos/photo1.jpg"
                        alt="Patient Comfort"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                    <span className="absolute bottom-2 left-2 text-white font-bold text-xs bg-black/50 px-2 py-1 rounded">Comfort</span>
                </button>

                {/* 2. Caregiver Control */}
                <Link
                    href="/caregiver"
                    className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl hover:scale-105 transition-transform group"
                >
                    <Image
                        src="/assets/user-photos/photo2.jpg"
                        alt="Caregiver Control"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                    <span className="absolute bottom-2 left-2 text-white font-bold text-xs bg-black/50 px-2 py-1 rounded">Caregiver</span>
                </Link>

                {/* 3. New Science */}
                <Link
                    href="/science"
                    className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl hover:scale-105 transition-transform group"
                >
                    <Image
                        src="/assets/user-photos/photo3.png"
                        alt="New Science"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                    <span className="absolute bottom-2 left-2 text-white font-bold text-xs bg-black/50 px-2 py-1 rounded">Science</span>
                </Link>

                {/* 4. Health & Wellness */}
                <Link
                    href="/wellness"
                    className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl hover:scale-105 transition-transform group"
                >
                    <Image
                        src="/assets/user-photos/photo4.jpg"
                        alt="Health & Wellness"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                    <span className="absolute bottom-2 left-2 text-white font-bold text-xs bg-black/50 px-2 py-1 rounded">Wellness</span>
                </Link>
            </div>

            {/* Ambient Elements */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--background)] to-transparent z-10" />

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

