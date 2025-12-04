import { Content } from "@google/genai";

export interface UserProfile {
    uid: string;
    name: string;
    muId: string;
    email: string;
    isPremium: boolean;
    createdAt?: any;
}

export interface Conversation {
    id: string;
    title: string;
    history: Content[];
    createdAt: number;
    mode?: ModelMode; // Track which mode was used
}

export interface AuthState {
    user: UserProfile | null;
    loading: boolean;
}

export enum Theme {
    Mekelle = 'mekelle',
    Futuristic = 'futuristic',
    NeoDark = 'neodark',
    NeoLight = 'neolight',
    Vibrant = 'vibrant'
}

export interface FileAttachment {
    base64: string;
    mimeType: string;
    name: string;
}

export type ModelMode = 'search' | 'reasoning';
