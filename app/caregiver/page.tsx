"use client";

import Image from "next/image";

import { useEffect, useState } from "react";
import { db } from "@/lib/db/service";
import { Profile } from "@/lib/db/types";
import { ProfileForm } from "@/components/ProfileForm";
import { PatientDataView } from "@/components/PatientDataView";

export default function CaregiverPage() {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [viewingProfile, setViewingProfile] = useState<Profile | null>(null);

    useEffect(() => {
        loadProfiles();
    }, []);

    const loadProfiles = async () => {
        const data = await db.getProfiles();
        setProfiles(data);
        setIsLoading(false);
    };

    const handleCreateProfile = async (data: Omit<Profile, "id" | "created_at">) => {
        const newProfile = await db.createProfile(data);
        // Phase 1: Save to localStorage for Persona Context
        const personaProfile = {
            imageUrl: newProfile.avatar_url || "",
            name: newProfile.name,
            relation: newProfile.relationship,
            lifeStory: newProfile.lifeStory || "",
            gender: newProfile.gender,
            boundaries: newProfile.safetySettings?.restrictedTopics.join(", ") || ""
        };
        localStorage.setItem("everloved_active_profile", JSON.stringify(personaProfile));

        await loadProfiles();
        setIsCreating(false);
    };

    return (
        <main className="min-h-screen pt-24 px-4 bg-[var(--background)] relative overflow-hidden">
            {/* Immersive Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)]/80 to-[var(--background)]/95 z-10" />
                <Image
                    src="/assets/user-photos/photo2.jpg"
                    alt="Caregiver Background"
                    fill
                    className="object-cover object-center opacity-40"
                    priority
                />
            </div>
            <div className="relative z-10 container mx-auto max-w-4xl" style={{ position: 'relative', zIndex: 100 }}>
                <header className="mb-12 flex justify-between items-end">
                    <div>
                        <p className="text-xl text-white/60 font-light" style={{ fontFamily: 'Avenir, sans-serif' }}>
                            Manage companion profiles and settings.
                        </p>
                    </div>
                    {!isCreating && (
                        <button
                            onClick={() => setIsCreating(true)}
                            className="px-6 py-2 rounded-full text-sm font-bold hover:scale-105 transition-transform shadow-lg"
                            style={{
                                backgroundColor: '#89CFF0',
                                color: '#000',
                                fontFamily: 'Avenir, sans-serif'
                            }}
                        >
                            + New Profile
                        </button>
                    )}
                </header>

                {isCreating ? (
                    <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
                        <ProfileForm
                            onSubmit={handleCreateProfile}
                            onCancel={() => setIsCreating(false)}
                        />
                    </div>
                ) : null}

                {isLoading ? (
                    <div className="grid md:grid-cols-2 gap-6">
                        {[1, 2].map(i => (
                            <div key={i} className="h-48 bg-white/5 rounded-3xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                        {profiles.length === 0 && !isCreating ? (
                            <div className="col-span-2 text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                                <p className="text-white/60 mb-4" style={{ fontFamily: 'Avenir, sans-serif' }}>No profiles created yet.</p>
                                <button
                                    onClick={() => setIsCreating(true)}
                                    className="text-[#89CFF0] font-bold hover:underline"
                                    style={{ fontFamily: 'Avenir, sans-serif' }}
                                >
                                    Create your first companion profile
                                </button>
                            </div>
                        ) : (
                            profiles.map(profile => (
                                <div key={profile.id} className="p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-[#89CFF0]/30 shadow-lg hover:shadow-xl transition-all group relative backdrop-blur-sm">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-2xl font-bold text-white" style={{ fontFamily: 'Avenir, sans-serif' }}>{profile.name}</h3>
                                            <p className="text-sm text-white/60" style={{ fontFamily: 'Avenir, sans-serif' }}>{profile.relationship}</p>
                                        </div>
                                        <span className="px-2 py-1 bg-white/10 rounded text-xs font-mono text-white/40">
                                            {profile.voice_id?.slice(0, 6)}...
                                        </span>
                                    </div>
                                    <p className="text-white/70 text-sm line-clamp-3 mb-4 font-light leading-relaxed" style={{ fontFamily: 'Avenir, sans-serif' }}>
                                        {profile.biography}
                                    </p>
                                    <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                                        <span className="text-xs text-white/40" style={{ fontFamily: 'Avenir, sans-serif' }}>
                                            Created {new Date(profile.created_at).toLocaleDateString()}
                                        </span>
                                        <div className="flex gap-4">
                                            <button
                                                onClick={() => setViewingProfile(profile)}
                                                className="text-sm font-bold hover:underline"
                                                style={{ color: '#89CFF0', fontFamily: 'Avenir, sans-serif' }}
                                            >
                                                Patient Data
                                            </button>
                                            <button
                                                className="text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity hover:underline"
                                                style={{ color: '#89CFF0', fontFamily: 'Avenir, sans-serif' }}
                                            >
                                                Edit
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {viewingProfile && (
                <PatientDataView
                    profile={viewingProfile}
                    onClose={() => setViewingProfile(null)}
                />
            )}
        </main>
    );
}
