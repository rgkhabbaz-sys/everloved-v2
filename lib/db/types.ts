export interface Profile {
    id: string;
    created_at: string;
    name: string;
    relationship: string;
    biography: string;
    avatar_url?: string;
    voice_id?: string;
}

export interface Interaction {
    id: string;
    created_at: string;
    profile_id: string;
    transcript: string;
    response: string;
}
