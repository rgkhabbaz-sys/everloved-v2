
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { PatientView } from '@/components/PatientView';
import { db } from '@/lib/db/service';
import { Profile } from '@/lib/db/types';

export default function Home() {
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [activeProfile, setActiveProfile] = useState<Profile | null>(null);
    const [isListening, setIsListening] = useState(false);
    const [isThinking, setIsThinking] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

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

        // Open the Patient View (VAD handled internally)
        setIsSessionActive(true);
    };

    const startListening = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert("Speech recognition is not supported in this browser. Please use Chrome or Safari.");
            return;
        }

        const recognition = new (window as any).webkitSpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setIsListening(true);
            setIsSpeaking(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.onresult = async (event: any) => {
            const transcript = event.results[0][0].transcript;
            console.log("User said:", transcript);
            await processAIResponse(transcript);
        };

        recognition.start();
    };

    const processAIResponse = async (userMessage: string) => {
        setIsThinking(true);
        try {
            // Retrieve active persona profile from localStorage
            const storedProfile = localStorage.getItem("everloved_active_profile");
            const profile = storedProfile ? JSON.parse(storedProfile) : null;

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage,
                    profile: profile // Pass the profile context
                }),
            });

            const data = await response.json();
            if (data.audio) {
                playAudioResponse(data.audio);
            } else if (data.text) {
                // Fallback if no audio (though backend should provide it)
                console.warn("No audio returned, falling back to text log:", data.text);
            }
        } catch (error) {
            console.error("Error processing AI response:", error);
        } finally {
            setIsThinking(false);
        }
    };

    const playAudioResponse = (audioBase64: string) => {
        try {
            const audio = new Audio(`data:audio/mpeg;base64,${audioBase64}`);

            audio.onplay = () => setIsSpeaking(true);
            audio.onended = () => setIsSpeaking(false);
            audio.onerror = (e) => {
                console.error("Audio playback error:", e);
                setIsSpeaking(false);
            };

            audio.play();
        } catch (error) {
            console.error("Error playing audio:", error);
            setIsSpeaking(false);
        }
    };

    return (
        <main className="min-h-screen flex flex-col items-center justify-end pb-32 relative overflow-hidden bg-[var(--primary)] font-sans">
            {/* Immersive Background */}
            <div className={`absolute inset-0 z-0 transition-transform duration-[2000ms] ${isSpeaking ? 'scale-105' : 'scale-100'}`}>
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 z-10" />
                <Image
                    src="/assets/user-photos/photo1.jpg"
                    alt="Comforting Background"
                    fill
                    className="object-cover object-center opacity-80"
                    priority
                />
            </div>

            {/* Top Center Navigation Bar */}
            <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full px-8 py-4 flex gap-8 items-center animate-in slide-in-from-top-10 duration-700 shadow-2xl">
                {[
                    { name: 'Patient Comfort', href: '/' },
                    { name: 'Caregiver Control', href: '/caregiver' },
                    { name: 'New Science', href: '/science' },
                    { name: 'Health & Wellness', href: '/wellness' }
                ].map((link) => (
                    <Link
                        key={link.name}
                        href={link.href}
                        className="text-sm font-medium text-white/80 hover:text-white transition-colors uppercase tracking-widest hover:scale-105 transform"
                        style={{ fontFamily: 'Avenir, sans-serif' }}
                    >
                        {link.name}
                    </Link>
                ))}
            </nav>

            {/* "everLoved" Logo Animation */}
            {/* Diagonal Slide: Start Top-Right (ish) -> End Bottom-Left */}
            {/* Using animation delay to simulate "fast to slow" feel via CSS curve if possible, or just standard ease-out */}
            <div className="fixed z-40 animate-out fade-out fill-mode-forwards opacity-0 animate-[diagonal-slide_2s_ease-out_forwards]"
                style={{
                    fontFamily: "Times New Roman, serif", // Using serif for contrast/branding as requested? Or standard. User said "white font".
                    bottom: '3rem',
                    left: '3rem',
                    animationName: 'diagonalSlide',
                    animationDuration: '2.5s',
                    animationTimingFunction: 'cubic-bezier(0.25, 0.1, 0.25, 1)', // Decelerating
                    animationFillMode: 'forwards'
                }}>
                <h1 className="text-6xl text-white font-light tracking-tight italic">
                    <span className="lowercase">e</span>verLoved
                </h1>
            </div>

            {/* Status Indicator */}
            {isThinking && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40">
                    <span className="text-white text-2xl font-light tracking-widest animate-pulse">Thinking...</span>
                </div>
            )}

            {/* Right-Side Vertical Navigation Stack */}
            <div className="fixed right-8 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-4 items-center animate-in slide-in-from-right-10 duration-1000">

                {/* Microphone / Start Session Icon */}
                <button
                    onClick={handleStartSession}
                    disabled={isThinking || isSpeaking}
                    className={`w-16 h-16 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(137,207,240,0.6)] transition-all duration-300 mb-6 ${isListening
                        ? 'bg-red-500 scale-110 animate-pulse'
                        : 'bg-white/10 backdrop-blur-md border border-white/20 hover:scale-110 hover:bg-white/20'
                        }`}
                    aria-label={isListening ? "Listening..." : "Start Session"}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                        <line x1="12" y1="19" x2="12" y2="23" />
                        <line x1="8" y1="23" x2="16" y2="23" />
                    </svg>
                </button>

                {/* Function Buttons Stack */}
                {['Conversation', 'Video', 'Music', 'Calming'].map((btn) => (
                    <button
                        key={btn}
                        className="w-14 h-14 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 hover:scale-105 transition-all shadow-lg group relative"
                        title={btn}
                    >
                        {/* Icons based on button name */}
                        {btn === 'Conversation' && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>}
                        {btn === 'Video' && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>}
                        {btn === 'Music' && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>}
                        {btn === 'Calming' && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>}

                        <span className="absolute right-full mr-3 bg-black/60 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            {btn}
                        </span>
                    </button>
                ))}
            </div>

            {/* Ambient Elements */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent z-10" />

            {/* Animation Keyframes (Inline for simplicity, or add to global css) */}
            <style jsx global>{`
                @keyframes diagonalSlide {
                    0% {
                        opacity: 0;
                        transform: translate(100px, -100px); /* Start from Top-Rightish offset relative to final position */
                    }
                    100% {
                        opacity: 1;
                        transform: translate(0, 0);
                    }
                }
            `}</style>

            {/* Session Overlay */}
            {isSessionActive && activeProfile && (
                <PatientView
                    profile={activeProfile}
                    onEndSession={() => {
                        setIsSessionActive(false);
                        setIsListening(false);
                    }}
                />
            )}
        </main>
    );
}

