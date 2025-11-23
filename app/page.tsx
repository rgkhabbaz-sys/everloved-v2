
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
        <main className="min-h-screen relative overflow-hidden">
            {/* Immersive Background - Fixed & Z-Indexed deeply negative */}
            <div className="fixed inset-0 z-[-1]">
                <div className="absolute inset-0 bg-black/30 z-10" />
                <Image
                    src="/landing-bg.jpg"
                    alt="Comforting Background"
                    fill
                    className="object-cover object-center"
                    priority
                />
            </div>

            {/* Floating Neon Dock - Fixed to bottom, High Z-Index to force visibility */}
            <div className="fixed bottom-8 left-0 right-0 z-[9999] px-4">
                <div className="max-w-5xl mx-auto bg-black/40 backdrop-blur-2xl rounded-[2rem] border border-white/10 p-4 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* Patient Button */}
                        <button
                            onClick={handleStartSession}
                            className="group relative h-24 md:h-32 rounded-2xl bg-[#89CFF0]/10 border border-[#89CFF0]/30 hover:bg-[#89CFF0]/20 hover:border-[#89CFF0] transition-all duration-300 flex flex-col items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(137,207,240,0.4)] hover:-translate-y-1"
                        >
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#89CFF0]/20 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#89CFF0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
                            </div>
                            <span className="text-lg md:text-xl font-bold text-white group-hover:text-[#89CFF0]" style={{ fontFamily: 'Avenir, sans-serif' }}>Patient</span>
                        </button>

                        {/* Caregiver Link */}
                        <Link
                            href="/caregiver"
                            className="group relative h-24 md:h-32 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 transition-all duration-300 flex flex-col items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:-translate-y-1 no-underline"
                        >
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/70 group-hover:text-white"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                            </div>
                            <span className="text-lg md:text-xl font-bold text-white/70 group-hover:text-white" style={{ fontFamily: 'Avenir, sans-serif' }}>Caregiver</span>
                        </Link>

                        {/* New Science Link */}
                        <Link
                            href="/science"
                            className="group relative h-24 md:h-32 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 transition-all duration-300 flex flex-col items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:-translate-y-1 no-underline"
                        >
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/70 group-hover:text-white"><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></svg>
                            </div>
                            <span className="text-lg md:text-xl font-bold text-white/70 group-hover:text-white" style={{ fontFamily: 'Avenir, sans-serif' }}>New Science</span>
                        </Link>

                        {/* Health & Wellness Link */}
                        <Link
                            href="/wellness"
                            className="group relative h-24 md:h-32 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 transition-all duration-300 flex flex-col items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:-translate-y-1 no-underline"
                        >
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/70 group-hover:text-white"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
                            </div>
                            <span className="text-lg md:text-xl font-bold text-white/70 group-hover:text-white" style={{ fontFamily: 'Avenir, sans-serif' }}>Wellness</span>
                        </Link>
                    </div>
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

