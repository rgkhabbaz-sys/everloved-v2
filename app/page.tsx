
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

            {/* Content */}
            <div className="relative z-20 text-center px-4 max-w-6xl mx-auto animate-in fade-in duration-1000 flex flex-col items-center gap-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mt-8 w-full max-w-5xl">
                    {/* Patient Button */}
                    <button
                        onClick={handleStartSession}
                        className="px-8 py-4 text-3xl md:text-5xl font-bold hover:scale-105 transition-transform bg-transparent border-none cursor-pointer"
                        style={{ fontFamily: 'Avenir, sans-serif', color: '#89CFF0' }}
                    >
                        Patient
                    </button>

                    {/* Caregiver Link */}
                    <Link
                        href="/caregiver"
                        className="px-8 py-4 text-3xl md:text-5xl font-bold hover:scale-105 transition-transform bg-transparent border-none cursor-pointer no-underline"
                        style={{ fontFamily: 'Avenir, sans-serif', color: '#89CFF0' }}
                    >
                        Caregiver
                    </Link>

                    {/* New Science Link */}
                    <Link
                        href="/science"
                        className="px-8 py-4 text-3xl md:text-5xl font-bold hover:scale-105 transition-transform bg-transparent border-none cursor-pointer no-underline"
                        style={{ fontFamily: 'Avenir, sans-serif', color: '#89CFF0' }}
                    >
                        New Science
                    </Link>

                    {/* Health & Wellness Link */}
                    <Link
                        href="/wellness"
                        className="px-8 py-4 text-3xl md:text-5xl font-bold hover:scale-105 transition-transform bg-transparent border-none cursor-pointer no-underline"
                        style={{ fontFamily: 'Avenir, sans-serif', color: '#89CFF0' }}
                    >
                        Health & Wellness
                    </Link>
                </div>
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

