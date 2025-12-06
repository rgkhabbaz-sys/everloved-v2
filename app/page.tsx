
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
                    src="/landing-bg.png"
                    alt="Comforting Background"
                    fill
                    className="object-cover object-center"
                    priority
                />
            </div>

            {/* Main Interface - Right Side Vertical Stack */}
            <div className="fixed right-8 md:right-16 top-1/2 -translate-y-1/2 flex flex-col items-center gap-6 z-[9999]">

                {/* 1. Large Microphone Icon (Primary Action) */}
                <button
                    onClick={handleStartSession}
                    className="group relative w-24 h-24 md:w-28 md:h-28 rounded-full bg-[#89CFF0]/20 backdrop-blur-xl border border-[#89CFF0]/50 hover:bg-[#89CFF0]/30 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center shadow-[0_0_40px_rgba(137,207,240,0.3)] animate-pulse mb-2"
                >
                    <div className="absolute inset-0 rounded-full border-2 border-[#89CFF0]/30 animate-ping opacity-20" />
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#89CFF0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="md:w-14 md:h-14"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="22" /></svg>
                </button>

                {/* 2. Photo Buttons Stack */}
                <div className="flex flex-col gap-4">
                    {/* Conversation (Island - Photo 4) */}
                    <button
                        onClick={handleStartSession}
                        className="group relative w-48 h-24 md:w-60 md:h-28 rounded-2xl overflow-hidden border border-white/20 hover:border-[#89CFF0] transition-all shadow-lg hover:shadow-[0_0_30px_rgba(137,207,240,0.3)] hover:scale-105 active:scale-95"
                    >
                        <Image src="/assets/user-photos/photo4.jpg" alt="Conversation" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <span className="absolute bottom-3 left-4 text-white font-bold text-lg md:text-xl tracking-wide" style={{ fontFamily: 'Avenir, sans-serif' }}>Conversation</span>
                    </button>

                    {/* Video (Waterfall - Photo 2) */}
                    <button
                        onClick={() => alert("Video features coming soon!")}
                        className="group relative w-48 h-24 md:w-60 md:h-28 rounded-2xl overflow-hidden border border-white/20 hover:border-[#89CFF0] transition-all shadow-lg hover:shadow-[0_0_30px_rgba(137,207,240,0.3)] hover:scale-105 active:scale-95"
                    >
                        <Image src="/assets/user-photos/photo2.jpg" alt="Video" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <span className="absolute bottom-3 left-4 text-white font-bold text-lg md:text-xl tracking-wide" style={{ fontFamily: 'Avenir, sans-serif' }}>Video</span>
                    </button>

                    {/* Music (Cliffs - Photo 3) */}
                    <button
                        onClick={() => alert("Music library coming soon!")}
                        className="group relative w-48 h-24 md:w-60 md:h-28 rounded-2xl overflow-hidden border border-white/20 hover:border-[#89CFF0] transition-all shadow-lg hover:shadow-[0_0_30px_rgba(137,207,240,0.3)] hover:scale-105 active:scale-95"
                    >
                        <Image src="/assets/user-photos/photo3.png" alt="Music" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <span className="absolute bottom-3 left-4 text-white font-bold text-lg md:text-xl tracking-wide" style={{ fontFamily: 'Avenir, sans-serif' }}>Music</span>
                    </button>

                    {/* Meditation (Canyon - Photo 1) */}
                    <button
                        onClick={() => alert("Meditation guides coming soon!")}
                        className="group relative w-48 h-24 md:w-60 md:h-28 rounded-2xl overflow-hidden border border-white/20 hover:border-[#89CFF0] transition-all shadow-lg hover:shadow-[0_0_30px_rgba(137,207,240,0.3)] hover:scale-105 active:scale-95"
                    >
                        <Image src="/assets/user-photos/photo1.jpg" alt="Meditation" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <span className="absolute bottom-3 left-4 text-white font-bold text-lg md:text-xl tracking-wide" style={{ fontFamily: 'Avenir, sans-serif' }}>Meditation</span>
                    </button>
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

