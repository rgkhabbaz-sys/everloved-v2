
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
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 z-10" />
                <Image
                    src="/assets/user-photos/photo1.jpg"
                    alt="Comforting Background"
                    fill
                    className="object-cover object-center opacity-100"
                    priority
                />
            </div>

            {/* Top Center Navigation Bar - INLINE STYLES DEBUG */}
            <nav
                style={{
                    position: 'fixed',
                    top: '2rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 99999,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    visibility: 'visible',
                    opacity: 1,
                    display: 'flex'
                }}
                className="rounded-full px-8 py-4 gap-8 items-center shadow-2xl border border-white/20 backdrop-blur-xl group hover:bg-black/50 transition-all duration-500"
            >
                {[
                    { name: 'Patient Comfort', href: '/' },
                    { name: 'Caregiver Control', href: '/caregiver' },
                    { name: 'New Science', href: '/science' },
                    { name: 'Health & Wellness', href: '/wellness' }
                ].map((link) => (
                    <Link
                        key={link.name}
                        href={link.href}
                        className="text-sm font-medium text-white/90 hover:text-white transition-colors uppercase tracking-widest hover:scale-105 transform"
                        style={{ fontFamily: 'Avenir, sans-serif' }}
                    >
                        {link.name}
                    </Link>
                ))}
            </nav>

            {/* "everLoved" Logo - INLINE STYLES DEBUG - RED BORDER */}
            <div
                style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 99999,
                    pointerEvents: 'none',
                    border: '5px solid red', // DEBUG BORDER
                    visibility: 'visible',
                    opacity: 1,
                    display: 'flex' // Added display flex as per instruction
                }}
            >
                <h1 className="text-[7rem] md:text-[9rem] text-white font-light tracking-tight italic drop-shadow-2xl" style={{ fontFamily: "Times New Roman, serif" }}>
                    <span className="lowercase">e</span>verLoved
                </h1>
            </div>

            {/* Status Indicator */}
            {isThinking && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[110]">
                    <span className="text-white text-4xl font-light tracking-widest animate-pulse drop-shadow-lg">Thinking...</span>
                </div>
            )}

            {/* Right-Side Vertical Navigation Stack - INLINE STYLES DEBUG */}
            <div
                style={{
                    position: 'fixed',
                    right: '2rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 99999,
                    visibility: 'visible',
                    opacity: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem',
                    alignItems: 'center'
                }}
            >

                {/* Microphone / Start Session Icon */}
                <button
                    onClick={handleStartSession}
                    disabled={isThinking || isSpeaking}
                    className={`w-20 h-20 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(137,207,240,0.4)] transition-all duration-500 mb-6 border border-white/30 backdrop-blur-md ${isListening
                        ? 'bg-red-500/80 scale-110 animate-pulse border-red-400'
                        : 'bg-white/10 hover:scale-110 hover:bg-white/20'
                        }`}
                    aria-label={isListening ? "Listening..." : "Start Session"}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
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
                        className="w-14 h-14 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white/90 hover:text-white hover:bg-white/20 hover:scale-105 transition-all shadow-xl group relative"
                        title={btn}
                    >
                        {/* Icons based on button name */}
                        {btn === 'Conversation' && <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>}
                        {btn === 'Video' && <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>}
                        {btn === 'Music' && <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>}
                        {btn === 'Calming' && <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>}

                        <span className="absolute right-full mr-4 bg-black/80 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10">
                            {btn}
                        </span>
                    </button>
                ))}
            </div>

            {/* Ambient Elements */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10" />

            {/* Animation Keyframes */}
            <style jsx global>{`
                @keyframes logoSlide {
                    0% {
                        top: 40%;
                        left: 50%;
                        transform: translate(-50%, -50%) scale(1.2);
                        opacity: 1; /* Changed from 0 to 1 */
                    }
                    10% {
                        opacity: 1; /* Fade in quickly */
                    }
                    100% {
                        top: auto;
                        bottom: 5vh; /* Fixed using viewport height */
                        left: 5vw;   /* Fixed using viewport width */
                        transform: translate(0, 0) scale(1);
                        opacity: 1;
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

