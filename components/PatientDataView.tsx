"use client";

import { useEffect, useState } from "react";
import { Interaction, Profile } from "@/lib/db/types";
import { db } from "@/lib/db/service";

interface PatientDataViewProps {
    profile: Profile;
    onClose: () => void;
}

export function PatientDataView({ profile, onClose }: PatientDataViewProps) {
    const [interactions, setInteractions] = useState<Interaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            const data = await db.getInteractions(profile.id);
            setInteractions(data);
            setIsLoading(false);
        };
        loadData();
    }, [profile.id]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 animate-in fade-in duration-300">
            <div className="bg-[#0f172a] w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] border border-white/10">
                <header className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <div>
                        <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'Avenir, sans-serif' }}>Patient Data: {profile.name}</h2>
                        <p className="text-sm text-white/60" style={{ fontFamily: 'Avenir, sans-serif' }}>Interaction History & Insights</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Safety Settings Summary */}
                    <div className="bg-red-500/10 p-6 rounded-2xl border border-red-500/20">
                        <h3 className="text-sm font-bold text-red-400 mb-4 uppercase tracking-wider" style={{ fontFamily: 'Avenir, sans-serif' }}>Active Safety Protocols</h3>
                        <div className="grid grid-cols-2 gap-6 text-sm">
                            <div>
                                <span className="text-white/60 block mb-1" style={{ fontFamily: 'Avenir, sans-serif' }}>Restricted Topics:</span>
                                <p className="font-medium text-white" style={{ fontFamily: 'Avenir, sans-serif' }}>
                                    {profile.safetySettings?.restrictedTopics?.length
                                        ? profile.safetySettings.restrictedTopics.join(", ")
                                        : "None set"}
                                </p>
                            </div>
                            <div>
                                <span className="text-white/60 block mb-1" style={{ fontFamily: 'Avenir, sans-serif' }}>Emergency Contact:</span>
                                <p className="font-medium text-white" style={{ fontFamily: 'Avenir, sans-serif' }}>
                                    {profile.safetySettings?.emergencyContact || "Not set"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Interaction Log */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 text-white" style={{ fontFamily: 'Avenir, sans-serif' }}>Recent Interactions</h3>
                        {isLoading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-24 bg-white/5 rounded-2xl animate-pulse" />
                                ))}
                            </div>
                        ) : interactions.length === 0 ? (
                            <p className="text-white/40 text-center py-8" style={{ fontFamily: 'Avenir, sans-serif' }}>No interactions recorded yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {interactions.map(interaction => (
                                    <div key={interaction.id} className="bg-white/5 p-6 rounded-2xl space-y-4 border border-white/5 hover:border-[#89CFF0]/30 transition-colors">
                                        <div className="flex justify-between text-xs text-white/40" style={{ fontFamily: 'Avenir, sans-serif' }}>
                                            <span>{new Date(interaction.created_at).toLocaleString()}</span>
                                            <span>ID: {interaction.id}</span>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-sm font-bold text-[#89CFF0]" style={{ fontFamily: 'Avenir, sans-serif' }}>Patient:</p>
                                            <p className="text-white/90 italic font-light" style={{ fontFamily: 'Avenir, sans-serif' }}>"{interaction.transcript}"</p>
                                        </div>
                                        <div className="space-y-2 pl-4 border-l-2 border-[#89CFF0]/30">
                                            <p className="text-sm font-bold text-[#89CFF0]" style={{ fontFamily: 'Avenir, sans-serif' }}>AI Companion:</p>
                                            <p className="text-white/90 font-light" style={{ fontFamily: 'Avenir, sans-serif' }}>"{interaction.response}"</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
