import { Profile } from './types';

export interface DatabaseService {
    getProfiles(): Promise<Profile[]>;
    getProfile(id: string): Promise<Profile | null>;
    createProfile(profile: Omit<Profile, 'id' | 'created_at'>): Promise<Profile>;
}

class MockDatabaseService implements DatabaseService {
    private STORAGE_KEY = 'everloved_profiles';

    private getStoredProfiles(): Profile[] {
        if (typeof window === 'undefined') return [];
        const stored = localStorage.getItem(this.STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    }

    async getProfiles(): Promise<Profile[]> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return this.getStoredProfiles();
    }

    async getProfile(id: string): Promise<Profile | null> {
        await new Promise(resolve => setTimeout(resolve, 300));
        const profiles = this.getStoredProfiles();
        return profiles.find(p => p.id === id) || null;
    }

    async createProfile(data: Omit<Profile, 'id' | 'created_at'>): Promise<Profile> {
        await new Promise(resolve => setTimeout(resolve, 800));
        const newProfile: Profile = {
            ...data,
            id: crypto.randomUUID(),
            created_at: new Date().toISOString(),
        };

        const profiles = this.getStoredProfiles();
        profiles.push(newProfile);

        if (typeof window !== 'undefined') {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(profiles));
        }

        return newProfile;
    }
}

// Singleton instance
export const db = new MockDatabaseService();
