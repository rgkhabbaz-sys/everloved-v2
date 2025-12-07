export interface Profile {
    id: string;
    created_at: string;
    name: string;
    relationship: string;
    biography: string;
    lifeStory?: string; // Deep context injection
    gender: 'male' | 'female';
    avatar_url?: string;
    voice_id?: string;
    photos?: {
        id: string;
        url: string;
        caption: string;
    }[];
    safetySettings?: {
        restrictedTopics: string[];
        emergencyContact: string;
    };
}

export interface Interaction {
    id: string;
    created_at: string;
    profile_id: string;
    transcript: string;
    response: string;
}

export interface Resource {
    id: string;
    title: string;
    summary: string;
    category: "Research" | "Therapy" | "Care Tips" | "Wellness";
    date: string;
    imageUrl?: string;
    url?: string;
}

export interface WellnessMetric {
    id: string;
    label: string;
    value: number;
    unit: string;
    trend: number; // Percentage change
    history: number[]; // Last 7 days
    color: string;
}
