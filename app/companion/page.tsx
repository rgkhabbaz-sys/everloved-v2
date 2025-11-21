'use client';

import Link from 'next/link';
import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { db } from '@/lib/db/service';
import { Profile } from '@/lib/db/types';

function CompanionContent() {
    const searchParams = useSearchParams();
    const profileId = searchParams.get('profileId');

    const [profile, setProfile] = useState<Profile | null>(null);
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [response, setResponse] = useState('');

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if (profileId) {
            db.getProfile(profileId).then(setProfile);
        }
    }, [profileId]);

    useEffect(() => {
        // Initialize Web Speech API
        if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
            const SpeechRecognition = (window as any).webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event: any) => {
                const text = event.results[0][0].transcript;
                setTranscript(text);
                handleConversation(text);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, [profile]);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            setTranscript('');
            setResponse('');
            setIsListening(true);
            recognitionRef.current?.start();
        }
    };

    const handleConversation = async (userText: string) => {
        setIsProcessing(true);
        try {
            // Context from the loaded profile
            const context = profile
                ? `${profile.name}, ${profile.relationship}. Bio: ${profile.biography}`
                : "Grandpa Joe, loves fishing, calm and reassuring."; // Fallback

            // 1. Get AI Response
            const chatRes = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userText, context }),
            });
            const chatData = await chatRes.json();
            const aiText = chatData.response;
            setResponse(aiText);

            // 2. Get Voice Audio
            const voiceRes = await fetch('/api/voice', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: aiText }),
            });

            if (voiceRes.ok) {
                const audioBlob = await voiceRes.blob();
                const audioUrl = URL.createObjectURL(audioBlob);

                if (audioRef.current) {
                    audioRef.current.src = audioUrl;
                    setIsSpeaking(true);
                    audioRef.current.play();
                    audioRef.current.onended = () => setIsSpeaking(false);
                }
            }

        } catch (error) {
            console.error('Conversation error:', error);
            setResponse("I'm having trouble connecting right now, but I'm here.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <main className="h-screen w-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
            {/* Back Button (Subtle) */}
            <Link href="/" className="absolute top-6 left-6 text-white/50 hover:text-white z-50">
                ← Exit
            </Link>

            {/* Audio Element */}
            <audio ref={audioRef} className="hidden" />

            {/* Avatar Container */}
            <div className="relative w-full h-full flex items-center justify-center">
                {/* Placeholder for the Avatar */}
                <div className={`relative w-[80vh] h-[80vh] max-w-[90vw] bg-gradient-to-b from-gray-800 to-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex items-center justify-center transition-all duration-500 ${isSpeaking ? 'scale-[1.02] ring-4 ring-blue-500/20' : ''}`}>
                    <div className="absolute inset-0 bg-[url('/placeholder-avatar.jpg')] bg-cover bg-center opacity-50 mix-blend-overlay" />

                    {/* Overlay UI */}
                    <div className="absolute top-8 left-0 right-0 text-center">
                        <h2 className="text-white/80 text-2xl font-light tracking-wide">EverLoved</h2>
                        {isProcessing && <p className="text-blue-300 text-sm mt-2 animate-pulse">Thinking...</p>}
                    </div>

                    {/* Central Focus / Visualizer */}
                    <div className={`w-64 h-64 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center transition-all duration-300 ${isSpeaking ? 'scale-110 bg-blue-500/10 border-blue-500/30' : ''}`}>
                        {isSpeaking ? (
                            <div className="flex gap-1 items-center h-12">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className="w-2 bg-blue-400 rounded-full animate-bounce" style={{ height: `${Math.random() * 40 + 10}px`, animationDelay: `${i * 0.1}s` }} />
                                ))}
                            </div>
                        ) : (
                            <span className="text-white/30">Avatar Stream</span>
                        )}
                    </div>

                    {/* Transcript Overlay (Optional, for debugging/accessibility) */}
                    {(transcript || response) && (
                        <div className="absolute bottom-32 left-8 right-8 text-center space-y-2">
                            {transcript && <p className="text-white/60 text-lg">"{transcript}"</p>}
                            {response && <p className="text-blue-200 text-xl font-medium">"{response}"</p>}
                        </div>
                    )}

                    {/* Bottom Controls */}
                    <div className="absolute bottom-12 left-0 right-0 flex justify-center">
                        <button
                            onClick={toggleListening}
                            className={`w-20 h-20 rounded-full backdrop-blur-md flex items-center justify-center transition-all border ${isListening
                                ? 'bg-red-500/20 border-red-500 text-red-500 animate-pulse'
                                : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                                }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                {isListening ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default function CompanionPage() {
    return (
        <Suspense fallback={<div className="h-screen w-screen bg-black flex items-center justify-center text-white">Loading...</div>}>
            <CompanionContent />
        </Suspense>
    );
}
