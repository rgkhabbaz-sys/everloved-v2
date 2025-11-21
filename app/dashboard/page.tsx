'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useEffect, useState } from 'react';
import { db } from '@/lib/db/service';
import { Profile } from '@/lib/db/types';

export default function DashboardPage() {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProfiles = async () => {
            try {
                const data = await db.getProfiles();
                setProfiles(data);
            } catch (error) {
                console.error('Failed to load profiles', error);
            } finally {
                setLoading(false);
            }
        };
        loadProfiles();
    }, []);

    return (
        <div>
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Profiles</h1>
                    <p className="text-[var(--muted)]">Manage your loved ones' AI companions.</p>
                </div>
                <Link href="/dashboard/profiles/create">
                    <Button>+ New Profile</Button>
                </Link>
            </header>

            <div className="grid md:grid-cols-2 gap-6">
                {loading ? (
                    <>
                        <div className="h-[120px] w-full bg-[var(--secondary)]/30 rounded-2xl animate-pulse" />
                        <div className="h-[120px] w-full bg-[var(--secondary)]/30 rounded-2xl animate-pulse" />
                    </>
                ) : profiles.length === 0 ? (
                    <div className="col-span-2 text-center py-12 bg-[var(--secondary)] rounded-2xl border border-dashed border-[var(--border)]">
                        <p className="text-[var(--muted)] mb-4">No profiles yet.</p>
                        <Link href="/dashboard/profiles/create">
                            <Button variant="outline">Create your first profile</Button>
                        </Link>
                    </div>
                ) : (
                    profiles.map(profile => (
                        <Link key={profile.id} href={`/companion?profileId=${profile.id}`}>
                            <Card className="hover:border-[var(--primary)] transition-colors cursor-pointer group h-full">
                                <div className="flex items-start gap-4">
                                    <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                                        {/* Placeholder for avatar image */}
                                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold group-hover:text-[var(--primary)] transition-colors">{profile.name}</h3>
                                        <p className="text-[var(--muted)] text-sm">{profile.relationship}</p>
                                        <p className="text-[var(--muted)] text-xs mt-2 line-clamp-2">{profile.biography}</p>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))
                )}

                {/* Always show Add New card if there are profiles */}
                {profiles.length > 0 && (
                    <Link href="/dashboard/profiles/create" className="block h-full">
                        <div className="h-full min-h-[120px] rounded-2xl border-2 border-dashed border-[var(--border)] flex flex-col items-center justify-center text-[var(--muted)] hover:border-[var(--primary)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all cursor-pointer">
                            <span className="text-4xl mb-2">+</span>
                            <span className="font-medium">Create Profile</span>
                        </div>
                    </Link>
                )}
            </div>
        </div>
    );
}
