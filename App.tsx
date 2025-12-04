import React, { useEffect, useState, useRef } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Layout } from './components/Layout';
import { ChatArea } from './components/ChatArea';
import { InputArea } from './components/InputArea';
import { AuthModal } from './components/Modals/AuthModal';
import { WelcomeModal } from './components/Modals/WelcomeModal';
import { PremiumModal } from './components/Modals/PremiumModal';
import { PremiumWelcomeModal } from './components/Modals/PremiumWelcomeModal';
import { streamGeminiResponse, detectMode } from './services/geminiService';
import { Content, Part } from '@google/genai';
import { Conversation, FileAttachment, ModelMode } from './types';

const CHAT_STORAGE_KEY = 'mu_ai_chats';
const ONBOARDING_KEY = 'mu_ai_onboarding_viewed';
const PREMIUM_WELCOME_SHOWN_KEY = 'mu_premium_welcome_shown';

const AppContent: React.FC = () => {
    const { user, loading } = useAuth();
    
    const [conversations, setConversations] = useState<Conversation[]>(() => {
        const saved = localStorage.getItem(CHAT_STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                return Object.values(parsed).sort((a: any, b: any) => b.createdAt - a.createdAt) as Conversation[];
            } catch (e) {
                console.error("Failed to parse chats", e);
                return [];
            }
        }
        return [];
    });

    const [currentChatId, setCurrentChatId] = useState<string | null>(() => {
        if (conversations.length > 0) {
            return conversations[0].id;
        }
        return null;
    });

    const [streamingText, setStreamingText] = useState<string | null>(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [showPremiumModal, setShowPremiumModal] = useState(false);
    const [showPremiumWelcome, setShowPremiumWelcome] = useState(false);
    
    // Track the mode used for the current stream locally for UI display
    const [activeStreamMode, setActiveStreamMode] = useState<ModelMode>('search');

    const prevIsPremiumRef = useRef<boolean>(false);

    useEffect(() => {
        if (conversations.length > 0) {
            const map = conversations.reduce((acc, chat) => ({ ...acc, [chat.id]: chat }), {});
            localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(map));
        }
    }, [conversations]);

    useEffect(() => {
        if (!loading && user) {
            if (!localStorage.getItem(ONBOARDING_KEY)) {
                setShowOnboarding(true);
            }

            const wasPremium = prevIsPremiumRef.current;
            const isPremium = user.isPremium;
            const hasSeenWelcome = localStorage.getItem(PREMIUM_WELCOME_SHOWN_KEY);

            if (isPremium && !wasPremium && !hasSeenWelcome) {
                setShowPremiumWelcome(true);
            }
            
            prevIsPremiumRef.current = isPremium;
        }
    }, [user, loading]);

    const getCurrentChat = () => conversations.find(c => c.id === currentChatId);

    const startNewChat = () => {
        const newId = Date.now().toString();
        const newChat: Conversation = { id: newId, title: 'New Chat', history: [], createdAt: Date.now() };
        setConversations(prev => [newChat, ...prev]);
        setCurrentChatId(newId);
        setStreamingText(null);
    };

    const deleteChat = (id: string) => {
        if (!confirm("Are you sure you want to delete this chat?")) return;
        setConversations(prev => {
            const updated = prev.filter(c => c.id !== id);
            if (updated.length === 0) {
                localStorage.removeItem(CHAT_STORAGE_KEY);
            }
            return updated;
        });
        if (currentChatId === id) {
            const remaining = conversations.filter(c => c.id !== id);
            if (remaining.length > 0) setCurrentChatId(remaining[0].id);
            else {
                setCurrentChatId(null);
                setStreamingText(null);
            }
        }
    };

    const handleSend = async (text: string, file: FileAttachment | null) => {
        if (!user) return; 

        // Auto-detect mode based on the text
        const detectedMode = detectMode(text);
        setActiveStreamMode(detectedMode);

        let activeChatId = currentChatId;
        if (!activeChatId) {
            activeChatId = Date.now().toString();
            const newChat: Conversation = { 
                id: activeChatId, 
                title: text.slice(0, 30) || "New Chat", 
                history: [], 
                createdAt: Date.now(),
                mode: detectedMode
            };
            setConversations(prev => [newChat, ...prev]);
            setCurrentChatId(activeChatId);
        }

        const userParts: Part[] = [];
        if (file) {
            userParts.push({
                inlineData: { mimeType: file.mimeType, data: file.base64 }
            });
            userParts.push({ text: text || "Analyze this file." });
        } else {
            userParts.push({ text });
        }

        const userMsg: Content = { role: 'user', parts: userParts };

        setConversations(prev => prev.map(c => c.id === activeChatId 
            ? { 
                ...c, 
                history: [...c.history, userMsg],
                title: c.history.length === 0 ? (text.slice(0, 30) || "File Analysis") : c.title,
                mode: detectedMode // Update last used mode
              } 
            : c
        ));

        setIsStreaming(true);
        setStreamingText('');

        try {
            const currentChat = conversations.find(c => c.id === activeChatId) || { history: [] };
            const apiHistory = [...currentChat.history, userMsg];

            let accumulatedText = "";

            await streamGeminiResponse(apiHistory, (chunk) => {
                accumulatedText += chunk;
                setStreamingText(accumulatedText);
            }, detectedMode);

            const modelMsg: Content = { role: 'model', parts: [{ text: accumulatedText }] };
            setConversations(prev => prev.map(c => c.id === activeChatId 
                ? { ...c, history: [...c.history, modelMsg] } 
                : c
            ));

        } catch (error) {
            console.error(error);
            const errorMsg: Content = { role: 'model', parts: [{ text: "**Error:** Failed to get response. Please try again." }] };
            setConversations(prev => prev.map(c => c.id === activeChatId 
                ? { ...c, history: [...c.history, errorMsg] } 
                : c
            ));
        } finally {
            setIsStreaming(false);
            setStreamingText(null);
        }
    };

    return (
        <Layout 
            onNewChat={startNewChat}
            chatList={conversations}
            currentChatId={currentChatId}
            onSelectChat={setCurrentChatId}
            onDeleteChat={deleteChat}
        >
            {!user && !loading && <AuthModal />}
            {showOnboarding && <WelcomeModal onClose={() => { setShowOnboarding(false); localStorage.setItem(ONBOARDING_KEY, 'true'); }} />}
            {showPremiumModal && <PremiumModal onClose={() => setShowPremiumModal(false)} />}
            {showPremiumWelcome && <PremiumWelcomeModal onClose={() => { setShowPremiumWelcome(false); localStorage.setItem(PREMIUM_WELCOME_SHOWN_KEY, 'true'); }} />}
            
            <ChatArea 
                history={getCurrentChat()?.history || []} 
                streamingText={streamingText}
                isStreaming={isStreaming}
                currentMode={activeStreamMode}
                authLoading={loading}
            />
            
            <InputArea 
                onSend={handleSend} 
                isLoading={isStreaming}
                onShowPremium={() => setShowPremiumModal(true)}
            />
        </Layout>
    );
};

export default function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </ThemeProvider>
    );
}