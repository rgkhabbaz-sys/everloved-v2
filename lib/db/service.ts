import { Profile, Resource, WellnessMetric, Interaction } from './types';

export interface DatabaseService {
    getProfiles(): Promise<Profile[]>;
    getProfile(id: string): Promise<Profile | null>;
    createProfile(profile: Omit<Profile, 'id' | 'created_at'>): Promise<Profile>;
    getResources(): Promise<Resource[]>;
    getWellnessMetrics(): Promise<WellnessMetric[]>;
    getInteractions(profileId: string): Promise<Interaction[]>;
}

class MockDatabaseService implements DatabaseService {
    private STORAGE_KEY = 'everloved_profiles';

    private getStoredProfiles(): Profile[] {
        if (typeof window === 'undefined') return [];
        const stored = localStorage.getItem(this.STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    }

    async getInteractions(profileId: string): Promise<Interaction[]> {
        await new Promise(resolve => setTimeout(resolve, 400));
        // Return mock interactions for demo
        return [
            {
                id: '1',
                created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
                profile_id: profileId,
                transcript: "I'm feeling a bit lonely today.",
                response: "I'm here with you. Would you like to look at some photos of your garden?"
            },
            {
                id: '2',
                created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
                profile_id: profileId,
                transcript: "Who is that in the picture?",
                response: "That's your daughter, Sarah. She visited last week and brought you those flowers."
            },
            {
                id: '3',
                created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
                profile_id: profileId,
                transcript: "I want to go home.",
                response: "You are safe here. This is your room with all your favorite things. Let's listen to some calming music."
            }
        ];
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

    async getResources(): Promise<Resource[]> {
        await new Promise(resolve => setTimeout(resolve, 400));
        return [
            {
                id: '1',
                title: 'Understanding Validation Therapy',
                summary: 'Recent studies show that validating the reality of dementia patients significantly reduces anxiety and agitation episodes compared to reality orientation.',
                category: 'Therapy',
                date: '2025-11-15',
                imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=2070',
            },
            {
                id: '2',
                title: 'Music and Memory: A Neurological Link',
                summary: 'How personalized playlists can unlock deep memories and improve mood in late-stage Alzheimer’s patients.',
                category: 'Research',
                date: '2025-11-10',
                imageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&q=80&w=2070',
            },
            {
                id: '3',
                title: 'Creating a Safe Home Environment',
                summary: 'Practical tips for modifying living spaces to reduce confusion and prevent falls for loved ones with dementia.',
                category: 'Care Tips',
                date: '2025-11-05',
                imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1073',
            },
            {
                id: '4',
                title: 'The Role of Sleep in Cognitive Health',
                summary: 'New findings suggest that regulating sleep patterns can slow the progression of cognitive decline.',
                category: 'Wellness',
                date: '2025-10-28',
                imageUrl: 'https://images.unsplash.com/photo-1541781777621-af11763e6224?auto=format&fit=crop&q=80&w=2070',
            }
        ];
    }

    async getWellnessMetrics(): Promise<WellnessMetric[]> {
        await new Promise(resolve => setTimeout(resolve, 500));
        return [
            {
                id: '1',
                label: 'Mood Stability',
                value: 88,
                unit: '%',
                trend: 5,
                history: [75, 78, 80, 82, 85, 86, 88],
                color: '#4ade80' // green
            },
            {
                id: '2',
                label: 'Sleep Quality',
                value: 7.2,
                unit: 'hrs',
                trend: -2,
                history: [6.5, 7.0, 7.5, 7.2, 7.0, 6.8, 7.2],
                color: '#60a5fa' // blue
            },
            {
                id: '3',
                label: 'Social Interaction',
                value: 45,
                unit: 'min',
                trend: 12,
                history: [20, 25, 30, 30, 40, 40, 45],
                color: '#f472b6' // pink
            },
            {
                id: '4',
                label: 'Cognitive Engagement',
                value: 92,
                unit: '%',
                trend: 0,
                history: [90, 92, 91, 92, 92, 93, 92],
                color: '#c084fc' // purple
            }
        ];
    }
}

// Singleton instance
export const db = new MockDatabaseService();
