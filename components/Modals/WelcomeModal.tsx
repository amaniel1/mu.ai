import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';

interface WelcomeModalProps {
    onClose: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ onClose }) => {
    const { user } = useAuth();
    const [page, setPage] = useState(0);

    const pages = [
        // Page 1: Intro
        <div className="flex flex-col items-center text-center">
            <img src="https://picsum.photos/150/150" className="rounded-full mb-4" alt="Icon" />
            <h2 className="text-3xl font-bold text-white mb-2">Welcome!</h2>
            <p className="text-secondary mb-6">Let's verify your details.</p>
            <div className="w-full max-w-sm space-y-4">
                <input type="text" disabled value={user?.name || ''} className="w-full p-3 rounded-lg bg-white/10 text-white border border-transparent" />
                <input type="text" disabled value={user?.muId || ''} className="w-full p-3 rounded-lg bg-white/10 text-white border border-transparent" />
                <p className="text-sm text-secondary">Email: {user?.email}</p>
            </div>
        </div>,
        // Page 2: Features
        <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Multimodal Power</h2>
            <p className="text-secondary mb-6">Attach files for deep analysis (up to 10MB).</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-secondary">
                <span className="p-3 bg-white/10 rounded-lg">All Departments</span>
                <span className="p-3 bg-white/10 rounded-lg">Freshmans</span>
                <span className="p-3 bg-white/10 rounded-lg">Lecturers</span>
            </div>
        </div>,
        // Page 3: Themes
        <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Personalize UI</h2>
            <p className="text-secondary mb-6">Choose from 5 distinct themes.</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-white font-medium">
                <span className="p-3 bg-blue-600 rounded-lg">MU Blue</span>
                <span className="p-3 bg-cyan-500 rounded-lg">Futuristic</span>
                <span className="p-3 bg-purple-600 rounded-lg">Vibrant</span>
            </div>
        </div>,
        // Page 4: Done
        <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold text-white mb-4">You're All Set!</h2>
            <img src="https://picsum.photos/200/200" className="rounded-full mb-6" alt="Profile" />
            <p className="text-white font-bold mb-4">
                Telegram: @Amax_v2<br/>
                Email: amanial.v2@gmail.com
            </p>
            <button onClick={onClose} className="w-full max-w-xs bg-primary text-white py-3 rounded-xl font-bold hover:opacity-90">
                Start Chatting
            </button>
        </div>
    ];

    return (
        <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4">
            <div className="glass w-full max-w-2xl h-[600px] p-8 rounded-2xl flex flex-col relative">
                <div className="flex-1 flex items-center justify-center">
                    {pages[page]}
                </div>

                {page < 3 && (
                    <div className="flex justify-between items-center mt-8">
                        <div className="flex gap-2">
                            {pages.map((_, i) => (
                                <div key={i} className={`w-3 h-3 rounded-full ${i === page ? 'bg-primary' : 'bg-white/20'}`} />
                            ))}
                        </div>
                        <div className="flex gap-4">
                            <button 
                                disabled={page === 0}
                                onClick={() => setPage(p => p - 1)}
                                className="p-2 text-secondary hover:text-white disabled:opacity-30"
                            >
                                <ChevronLeft />
                            </button>
                            <button 
                                onClick={() => setPage(p => p + 1)}
                                className="p-2 text-primary hover:text-white"
                            >
                                <ChevronRight />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
