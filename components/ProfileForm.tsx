"use client";

import { useState } from "react";
import { Profile } from "@/lib/db/types";

interface ProfileFormProps {
    onSubmit: (profile: Omit<Profile, "id" | "created_at">) => Promise<void>;
    onCancel: () => void;
}

export function ProfileForm({ onSubmit, onCancel }: ProfileFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        relationship: "",
        lifeStory: "",
        biography: "",
        gender: "female" as "male" | "female",
        voice_id: "21m00Tcm4TlvDq8ikWAM", // Default Rachel
        photos: [] as { id: string; url: string; caption: string }[],
        safetySettings: {
            restrictedTopics: [] as string[],
            emergencyContact: "",
        },
        // Temporary state for new photo input
        newPhotoUrl: "",
        newPhotoCaption: "",
        // Temporary state for restricted topics input
        restrictedTopicsInput: "",
    });

    const handleAddPhoto = () => {
        if (formData.newPhotoUrl) {
            setFormData({
                ...formData,
                photos: [
                    ...formData.photos,
                    {
                        id: crypto.randomUUID(),
                        url: formData.newPhotoUrl,
                        caption: formData.newPhotoCaption || "Memory"
                    }
                ],
                newPhotoUrl: "",
                newPhotoCaption: ""
            });
        }
    };

    const removePhoto = (id: string) => {
        setFormData({
            ...formData,
            photos: formData.photos.filter(p => p.id !== id)
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await onSubmit(formData);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-md">
            <h3 className="text-2xl font-bold text-white" style={{ fontFamily: 'Avenir, sans-serif' }}>Create New Profile</h3>

            <div className="space-y-2">
                <label className="text-sm font-bold text-white/60" style={{ fontFamily: 'Avenir, sans-serif' }}>Name</label>
                <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-4 rounded-xl bg-white/5 border border-white/10 focus:border-[#89CFF0] text-white outline-none transition-colors placeholder:text-white/20"
                    placeholder="e.g. Sarah"
                    style={{ fontFamily: 'Avenir, sans-serif' }}
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-white/60" style={{ fontFamily: 'Avenir, sans-serif' }}>Relationship</label>
                <input
                    required
                    type="text"
                    value={formData.relationship}
                    onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                    className="w-full p-4 rounded-xl bg-white/5 border border-white/10 focus:border-[#89CFF0] text-white outline-none transition-colors placeholder:text-white/20"
                    placeholder="e.g. Daughter"
                    style={{ fontFamily: 'Avenir, sans-serif' }}
                />
            </div>

            {/* Deep Context / Life Story Section */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-white/60" style={{ fontFamily: 'Avenir, sans-serif' }}>Deep Context / Life Story</label>
                    <label className="cursor-pointer text-xs font-bold text-[#89CFF0] hover:underline flex items-center gap-2" style={{ fontFamily: 'Avenir, sans-serif' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                        Upload Text File (.txt)
                        <input
                            type="file"
                            accept=".txt"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                        const text = event.target?.result as string;
                                        setFormData(prev => ({ ...prev, lifeStory: (prev.lifeStory ? prev.lifeStory + "\n\n" : "") + text }));
                                    };
                                    reader.readAsText(file);
                                }
                            }}
                        />
                    </label>
                </div>
                <textarea
                    value={formData.lifeStory}
                    onChange={(e) => setFormData({ ...formData, lifeStory: e.target.value })}
                    className="w-full p-4 rounded-xl bg-white/5 border border-white/10 focus:border-[#89CFF0] text-white outline-none transition-colors min-h-[200px] placeholder:text-white/20 leading-relaxed font-light"
                    placeholder="Paste a biography, key memories, childhood stories, or important life events here..."
                    style={{ fontFamily: 'Avenir, sans-serif' }}
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-white/60" style={{ fontFamily: 'Avenir, sans-serif' }}>Context & Memories</label>
                <textarea
                    required
                    value={formData.biography}
                    onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
                    className="w-full p-4 rounded-xl bg-white/5 border border-white/10 focus:border-[#89CFF0] text-white outline-none transition-colors min-h-[120px] placeholder:text-white/20"
                    placeholder="Share key memories or topics to discuss. e.g. 'Remember our trip to Cape Cod? You love gardening.'"
                    style={{ fontFamily: 'Avenir, sans-serif' }}
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-white/60" style={{ fontFamily: 'Avenir, sans-serif' }}>Voice ID (ElevenLabs)</label>
                <input
                    type="text"
                    value={formData.voice_id}
                    onChange={(e) => setFormData({ ...formData, voice_id: e.target.value })}
                    className="w-full p-4 rounded-xl bg-white/5 border border-white/10 focus:border-[#89CFF0] text-white outline-none transition-colors placeholder:text-white/20"
                    placeholder="Voice ID"
                    style={{ fontFamily: 'Avenir, sans-serif' }}
                />
                <p className="text-xs text-white/40" style={{ fontFamily: 'Avenir, sans-serif' }}>Default: Rachel (21m00Tcm4TlvDq8ikWAM)</p>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-white/60" style={{ fontFamily: 'Avenir, sans-serif' }}>Voice Gender</label>
                <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as "male" | "female" })}
                    className="w-full p-4 rounded-xl bg-white/5 border border-white/10 focus:border-[#89CFF0] text-white outline-none transition-colors"
                    style={{ fontFamily: 'Avenir, sans-serif' }}
                >
                    <option value="female" className="bg-gray-900">Female (Warm)</option>
                    <option value="male" className="bg-gray-900">Male (Deep)</option>
                </select>
            </div>

            {/* Photos Section */}
            <div className="space-y-4 border-t border-white/10 pt-6">
                <h4 className="font-bold text-white" style={{ fontFamily: 'Avenir, sans-serif' }}>Photo Memories</h4>
                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="text"
                        value={formData.newPhotoUrl}
                        onChange={(e) => setFormData({ ...formData, newPhotoUrl: e.target.value })}
                        className="p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:border-[#89CFF0] outline-none"
                        placeholder="Image URL"
                        style={{ fontFamily: 'Avenir, sans-serif' }}
                    />
                    <input
                        type="text"
                        value={formData.newPhotoCaption}
                        onChange={(e) => setFormData({ ...formData, newPhotoCaption: e.target.value })}
                        className="p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:border-[#89CFF0] outline-none"
                        placeholder="Caption"
                        style={{ fontFamily: 'Avenir, sans-serif' }}
                    />
                </div>
                <button
                    type="button"
                    onClick={handleAddPhoto}
                    className="text-sm font-bold hover:underline"
                    style={{ color: '#89CFF0', fontFamily: 'Avenir, sans-serif' }}
                >
                    + Add Photo
                </button>

                <div className="grid grid-cols-3 gap-4 mt-4">
                    {formData.photos.map(photo => (
                        <div key={photo.id} className="relative group aspect-square bg-white/5 rounded-xl overflow-hidden border border-white/10">
                            <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={() => removePhoto(photo.id)}
                                    className="text-white text-xs bg-red-500/80 hover:bg-red-500 px-3 py-1.5 rounded-full backdrop-blur-sm transition-colors"
                                    style={{ fontFamily: 'Avenir, sans-serif' }}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Safety Section */}
            <div className="space-y-4 border-t border-white/10 pt-6">
                <h4 className="font-bold text-white" style={{ fontFamily: 'Avenir, sans-serif' }}>Safety & Restrictions</h4>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-white/60" style={{ fontFamily: 'Avenir, sans-serif' }}>Restricted Topics (comma separated)</label>
                    <input
                        type="text"
                        value={formData.restrictedTopicsInput}
                        onChange={(e) => setFormData({
                            ...formData,
                            restrictedTopicsInput: e.target.value,
                            safetySettings: {
                                ...formData.safetySettings,
                                restrictedTopics: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                            }
                        })}
                        className="w-full p-4 rounded-xl bg-white/5 border border-white/10 focus:border-[#89CFF0] text-white outline-none transition-colors placeholder:text-white/20"
                        placeholder="e.g. Politics, Money, The Accident"
                        style={{ fontFamily: 'Avenir, sans-serif' }}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-white/60" style={{ fontFamily: 'Avenir, sans-serif' }}>Emergency Contact</label>
                    <input
                        type="text"
                        value={formData.safetySettings.emergencyContact}
                        onChange={(e) => setFormData({
                            ...formData,
                            safetySettings: {
                                ...formData.safetySettings,
                                emergencyContact: e.target.value
                            }
                        })}
                        className="w-full p-4 rounded-xl bg-white/5 border border-white/10 focus:border-[#89CFF0] text-white outline-none transition-colors placeholder:text-white/20"
                        placeholder="Phone number or Email"
                        style={{ fontFamily: 'Avenir, sans-serif' }}
                    />
                </div>
            </div>

            <div className="flex gap-4 pt-6">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isLoading}
                    className="flex-1 py-4 px-6 rounded-full border border-white/10 hover:bg-white/5 text-white transition-colors font-bold"
                    style={{ fontFamily: 'Avenir, sans-serif' }}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-4 px-6 rounded-full text-black font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 shadow-lg"
                    style={{
                        backgroundColor: '#89CFF0',
                        fontFamily: 'Avenir, sans-serif'
                    }}
                >
                    {isLoading ? "Creating..." : "Create Profile"}
                </button>
            </div>
        </form>
    );
}
