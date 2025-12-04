import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Menu, Info } from 'lucide-react';
import { AboutModal } from './Modals/AboutModal';

interface LayoutProps {
    children: React.ReactNode;
    onNewChat: () => void;
    onDeleteChat: (id: string) => void;
    chatList: any[];
    currentChatId: string | null;
    onSelectChat: (id: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
    children, 
    onNewChat, 
    chatList, 
    currentChatId, 
    onSelectChat, 
    onDeleteChat 
}) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [aboutModalOpen, setAboutModalOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <div className="flex w-full h-full relative overflow-hidden">
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div 
                    className="absolute inset-0 bg-black/50 z-30 md:hidden" 
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300
                md:relative md:translate-x-0
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <Sidebar 
                    onNewChat={() => {
                        onNewChat();
                        if (window.innerWidth <= 768) setSidebarOpen(false);
                    }}
                    chatList={chatList}
                    currentChatId={currentChatId}
                    onSelectChat={(id) => {
                        onSelectChat(id);
                        if (window.innerWidth <= 768) setSidebarOpen(false);
                    }}
                    onDeleteChat={onDeleteChat}
                    onClose={() => setSidebarOpen(false)}
                />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full relative w-full">
                {/* Mobile Header */}
                <header className="glass sticky top-0 z-10 p-4 border-b border-white/20 shadow-lg md:hidden flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <button onClick={toggleSidebar} className="text-white">
                            <Menu size={24} />
                        </button>
                        <h1 className="text-xl font-bold text-white">MU Chat AI</h1>
                    </div>
                    <button 
                        className="p-1 text-white hover:text-primary"
                        onClick={() => setAboutModalOpen(true)}
                    >
                        <Info size={24} />
                    </button>
                </header>

                <main className="flex-1 overflow-hidden flex flex-col relative w-full">
                    {children}
                </main>
            </div>
            
            {aboutModalOpen && <AboutModal onClose={() => setAboutModalOpen(false)} />}
        </div>
    );
};
