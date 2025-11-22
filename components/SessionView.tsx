"use client";

import { useState, useEffect, useRef } from "react";
import { Profile } from "@/lib/db/types";

interface SessionViewProps {
    profile: Profile;
    onEndSession: () => void;
}

type SessionState = "idle" | "listening" | "thinking" | "speaking";

export function SessionView({ profile, onEndSession }: SessionViewProps) {
    const [state, setState] = useState<SessionState>("idle");
    const [transcript, setTranscript] = useState("");
    const [response, setResponse] = useState("");

    const recognitionRef = useRef<any>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Initialize Web Speech API
        if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
            // @ts-ignore
            const recognition = new window.webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = "en-US";

            recognition.onstart = () => setState("listening");

            recognition.onresult = (event: any) => {
                const text = event.results[0][0].transcript;
                setTranscript(text);
                handleUserMessage(text);
            };

            recognition.onerror = (event: any) => {
                console.error("Speech recognition error", event.error);
                setState("idle");
            };

            recognition.onend = () => {
                if (state === "listening") setState("idle");
            };

            recognitionRef.current = recognition;
        }

        return () => {
            if (recognitionRef.current) recognitionRef.current.stop();
        };
    }, []);

    const startListening = () => {
        if (recognitionRef.current) {
            try {
                recognitionRef.current.start();
            } catch (e) {
                console.error("Error starting recognition:", e);
            }
        } else {
            alert("Speech recognition not supported in this browser. Please use Chrome or Safari.");
        }
    };

    const handleUserMessage = async (text: string) => {
        setState("thinking");

        try {
            // 1. Get AI Response
            const chatRes = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: text,
                    context: `Name: ${profile.name}. Relationship: ${profile.relationship}. Bio: ${profile.biography}`,
                }),
            });

            const chatData = await chatRes.json();
            const aiText = chatData.response;
            setResponse(aiText);

            // 2. Get Voice Audio
            const voiceRes = await fetch("/api/voice", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text: aiText,
                    voiceId: profile.voice_id,
                }),
            });

            if (voiceRes.ok) {
                const audioBlob = await voiceRes.blob();
                if (audioBlob.size > 0) {
                    const audioUrl = URL.createObjectURL(audioBlob);
                    playAudio(audioUrl);
                } else {
                    // Simulation Mode: No audio returned
                    simulateSpeaking(aiText);
                }
            } else {
                console.error("Voice generation failed");
                setState("idle");
            }

        } catch (error) {
            console.error("Session error:", error);
            setState("idle");
        }
    };

    const playAudio = (url: string) => {
        setState("speaking");
        if (audioRef.current) {
            audioRef.current.src = url;
            audioRef.current.play();
            audioRef.current.onended = () => {
                setState("idle");
            };
        }
    };

    const simulateSpeaking = (text: string) => {
        setState("speaking");
        // Estimate duration: ~80ms per character
        const duration = Math.min(Math.max(text.length * 80, 2000), 10000);

        setTimeout(() => {
            setState("idle");
        }, duration);
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-xl animate-in fade-in duration-500">
            <button
                onClick={onEndSession}
                className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>

            <div className="text-center max-w-4xl px-4 w-full flex flex-col items-center gap-12">
                {/* Visualizer */}
                <div className="relative">
                    <div
                        className={`w-64 h-64 mx-auto rounded-full border-2 transition-all duration-1000 flex items-center justify-center overflow-hidden relative
                        ${state === "listening" ? "scale-110 shadow-[0_0_60px_#89CFF0]" :
                                state === "speaking" ? "scale-105 shadow-[0_0_40px_#89CFF0]" :
                                    state === "thinking" ? "animate-pulse shadow-[0_0_30px_#89CFF0]" :
                                        "border-white/10"
                            }`}
                        style={{
                            borderColor: state === 'idle' ? 'rgba(255,255,255,0.1)' : '#89CFF0',
                            backgroundColor: state === 'idle' ? 'transparent' : 'rgba(137, 207, 240, 0.05)'
                        }}
                    >
                        {/* Inner Pulse */}
                        {state !== 'idle' && (
                            <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: '#89CFF0' }} />
                        )}

                        <div className="text-8xl font-light text-white/80" style={{ fontFamily: 'Avenir, sans-serif' }}>
                            {profile.name[0]}
                        </div>
                    </div>

                    {/* Status Text */}
                    <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 whitespace-nowrap">
                        <span
                            className="text-xl tracking-[0.2em] font-medium animate-pulse"
                            style={{ color: '#89CFF0', fontFamily: 'Avenir, sans-serif' }}
                        >
                            {state === "listening" ? "LISTENING..." :
                                state === "thinking" ? "THINKING..." :
                                    state === "speaking" ? "SPEAKING..." : ""}
                        </span>
                    </div>
                </div>

                {/* Conversation Display */}
                <div className="min-h-[200px] space-y-8 max-w-2xl w-full">
                    {transcript && (
                        <p className="text-3xl text-white/60 font-light leading-relaxed" style={{ fontFamily: 'Avenir, sans-serif' }}>
                            "{transcript}"
                        </p>
                    )}
                    {response && state !== "listening" && (
                        <p className="text-4xl text-white font-medium leading-relaxed animate-in slide-in-from-bottom-4" style={{ fontFamily: 'Avenir, sans-serif' }}>
                            {response}
                        </p>
                    )}
                </div>

                {/* Controls */}
                <div className="mt-8">
                    {state === "idle" && (
                        <button
                            onClick={startListening}
                            className="group relative px-12 py-6 rounded-full text-2xl font-bold hover:scale-105 transition-transform"
                            style={{
                                backgroundColor: '#89CFF0',
                                color: '#000',
                                fontFamily: 'Avenir, sans-serif'
                            }}
                        >
                            Tap to Speak
                        </button>
                    )}
                </div>
            </div>

            <audio ref={audioRef} className="hidden" />
        </div>
    );
}
