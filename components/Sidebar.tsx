import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Plus, Trash2, X, Settings, LogOut, Palette } from 'lucide-react';
import { ThemeModal } from './Modals/ThemeModal';
import { AboutModal } from './Modals/AboutModal';

interface SidebarProps {
    onNewChat: () => void;
    chatList: any[];
    currentChatId: string | null;
    onSelectChat: (id: string) => void;
    onDeleteChat: (id: string) => void;
    onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
    onNewChat, chatList, currentChatId, onSelectChat, onDeleteChat, onClose 
}) => {
    const { user, isPremium, logout } = useAuth();
    const [themeModalOpen, setThemeModalOpen] = useState(false);
    const [aboutModalOpen, setAboutModalOpen] = useState(false);

    return (
        <nav className="h-full w-full glass glass-sidebar p-4 flex flex-col">
            {/* User Info */}
            <div className="pb-4 border-b border-white/20 mb-4 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full border-2 border-primary overflow-hidden bg-gray-600 flex items-center justify-center">
                    <img src="https://picsum.photos/40/40" alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col overflow-hidden flex-1">
                    <span className="text-white font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
                        {user?.name || 'Guest'}
                    </span>
                    <span className={`text-xs font-medium whitespace-nowrap overflow-hidden text-ellipsis ${isPremium ? 'text-green-400' : 'text-red-400'}`}>
                        {isPremium ? 'Premium' : 'Regular'}
                    </span>
                </div>
            </div>

            <div className="flex items-center justify-between pb-4 border-b border-white/20 mb-4 md:hidden">
                <h2 className="text-2xl font-bold tracking-wider text-primary">MU Chat AI</h2>
                <button onClick={onClose} className="text-white hover:text-primary">
                    <X size={24} />
                </button>
            </div>

            {/* New Chat Button */}
            <button 
                onClick={onNewChat}
                className="w-full text-white py-2 rounded-xl mb-4 text-lg font-semibold transition duration-150 shadow-lg bg-primary hover:opacity-90 flex items-center justify-center gap-2"
            >
                <Plus size={20} /> New Chat
            </button>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
                <h3 className="text-sm font-semibold uppercase text-secondary mb-2">Past Conversations</h3>
                <ul className="space-y-1">
                    {chatList.map((chat) => (
                        <li key={chat.id}>
                            <div 
                                onClick={() => onSelectChat(chat.id)}
                                className={`
                                    p-2 rounded-lg cursor-pointer text-sm transition duration-150 flex justify-between items-center
                                    ${currentChatId === chat.id ? 'conversation-active' : 'hover:bg-white/10 text-secondary'}
                                `}
                            >
                                <span className="truncate mr-2 flex-1">{chat.title}</span>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDeleteChat(chat.id);
                                    }}
                                    className="flex-shrink-0 text-secondary hover:text-red-500 p-1 rounded-full hover:bg-red-500/10 transition duration-150"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Footer Links */}
            <div className="pt-4 border-t border-white/20 mt-4 space-y-2">
                <button 
                    onClick={() => setAboutModalOpen(true)}
                    className="w-full text-left flex items-center gap-2 p-2 rounded-lg text-sm text-secondary hover:bg-white/10 transition duration-100"
                >
                    <Settings size={16} /> My Creator
                </button>
                <button 
                    onClick={() => setThemeModalOpen(true)}
                    className="w-full text-left flex items-center gap-2 p-2 rounded-lg text-sm text-secondary hover:bg-white/10 transition duration-100"
                >
                    <Palette size={16} /> Choose Theme
                </button>
                <button 
                    onClick={logout}
                    className="w-full text-left flex items-center gap-2 p-2 rounded-lg text-sm text-red-400 hover:bg-red-900/50 transition duration-100"
                >
                    <LogOut size={16} /> Sign Out
                </button>
                <p className="text-xs text-secondary mt-2">v1.3 | Made By Amaniel Niguse</p>
            </div>

            {themeModalOpen && <ThemeModal onClose={() => setThemeModalOpen(false)} />}
            {aboutModalOpen && <AboutModal onClose={() => setAboutModalOpen(false)} />}
        </nav>
    );
};
