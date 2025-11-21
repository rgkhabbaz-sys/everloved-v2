'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/db/service';
import { useToast } from '@/components/ui/Toast';

export default function CreateProfilePage() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        relationship: '',
        biography: '',
    });

    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();
    const { showToast } = useToast();

    const handleNext = () => {
        if (step === 1 && (!formData.name || !formData.relationship)) {
            showToast('Please fill in the required fields', 'error');
            return;
        }
        setStep(step + 1);
    };
    const handleBack = () => setStep(step - 1);

    const handleComplete = async () => {
        setIsSaving(true);
        try {
            await db.createProfile({
                name: formData.name,
                relationship: formData.relationship,
                biography: formData.biography,
                // In a real app, we would upload the file/voice and get URLs here
                avatar_url: undefined,
                voice_id: undefined,
            });
            showToast('Profile created successfully!', 'success');
            router.push('/dashboard');
        } catch (error) {
            console.error('Failed to create profile', error);
            showToast('Failed to create profile. Please try again.', 'error');
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <Link href="/dashboard" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">
                    ← Back to Dashboard
                </Link>
                <h1 className="text-3xl font-bold mt-2">Create New Profile</h1>
                <div className="flex gap-2 mt-4">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className={`h-2 flex-1 rounded-full ${step >= i ? 'bg-[var(--primary)]' : 'bg-[var(--border)]'}`}
                        />
                    ))}
                </div>
            </div>

            <Card>
                {step === 1 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold">Basic Information</h2>
                        <div>
                            <label className="block text-sm font-medium mb-2">Full Name</label>
                            <input
                                type="text"
                                className="w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--background)]"
                                placeholder="e.g. Martha Smith"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Relationship</label>
                            <select
                                className="w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--background)]"
                                value={formData.relationship}
                                onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                            >
                                <option value="">Select relationship...</option>
                                <option value="parent">Parent</option>
                                <option value="spouse">Spouse</option>
                                <option value="grandparent">Grandparent</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Biography & Key Memories</label>
                            <textarea
                                className="w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--background)] min-h-[120px]"
                                placeholder="Tell us about them. What are their favorite stories? What calms them down?"
                                value={formData.biography}
                                onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
                            />
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold">Appearance</h2>
                        <p className="text-[var(--muted)]">Upload a clear, front-facing photo. This will be used to generate the avatar.</p>

                        <div className="border-2 border-dashed border-[var(--border)] rounded-xl p-12 text-center hover:bg-[var(--secondary)] transition-colors cursor-pointer">
                            <div className="w-12 h-12 mx-auto bg-[var(--primary)]/10 rounded-full flex items-center justify-center text-[var(--primary)] mb-4">
                                📷
                            </div>
                            <p className="font-medium">Click to upload or drag and drop</p>
                            <p className="text-sm text-[var(--muted)]">JPG or PNG, max 5MB</p>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold">Voice Cloning</h2>
                        <p className="text-[var(--muted)]">Upload a 1-2 minute audio recording of their voice to create a realistic model.</p>

                        <div className="border-2 border-dashed border-[var(--border)] rounded-xl p-12 text-center hover:bg-[var(--secondary)] transition-colors cursor-pointer">
                            <div className="w-12 h-12 mx-auto bg-[var(--primary)]/10 rounded-full flex items-center justify-center text-[var(--primary)] mb-4">
                                🎙️
                            </div>
                            <p className="font-medium">Upload Audio File</p>
                            <p className="text-sm text-[var(--muted)]">MP3 or WAV</p>
                        </div>

                        <div className="relative flex py-4 items-center">
                            <div className="flex-grow border-t border-[var(--border)]"></div>
                            <span className="flex-shrink-0 mx-4 text-[var(--muted)] text-sm">OR</span>
                            <div className="flex-grow border-t border-[var(--border)]"></div>
                        </div>

                        <Button variant="outline" className="w-full">Record Voice Directly</Button>
                    </div>
                )}

                <div className="flex justify-between mt-8 pt-6 border-t border-[var(--border)]">
                    {step > 1 ? (
                        <Button variant="ghost" onClick={handleBack} disabled={isSaving}>Back</Button>
                    ) : (
                        <div></div>
                    )}

                    {step < 3 ? (
                        <Button onClick={handleNext}>Next Step</Button>
                    ) : (
                        <Button onClick={handleComplete} disabled={isSaving}>
                            {isSaving ? 'Creating...' : 'Complete Profile'}
                        </Button>
                    )}
                </div>
            </Card>
        </div>
    );
}
