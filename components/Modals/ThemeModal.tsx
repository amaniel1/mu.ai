import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Theme } from '../../types';

export const ThemeModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { setTheme } = useTheme();

    const themes = [
        { id: Theme.Mekelle, name: 'Mekelle University', desc: 'Official Blue/Green/White', color: 'text-green-400' },
        { id: Theme.Futuristic, name: 'Futuristic', desc: 'Neon glow & minimalist', color: 'text-cyan-300' },
        { id: Theme.NeoDark, name: 'NeoDark', desc: 'High blur, soft dark gradients', color: 'text-blue-500' },
        { id: Theme.NeoLight, name: 'Neomorphic', desc: 'Soft, light gradients', color: 'text-violet-700' },
        { id: Theme.Vibrant, name: 'Vibrant', desc: 'Cool purples and blues', color: 'text-blue-300' },
    ];

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="glass w-full max-w-lg p-6 rounded-2xl text-secondary">
                <h2 className="text-3xl font-bold mb-4 text-primary">Choose a Theme</h2>
                <div className="space-y-3">
                    {themes.map((t) => (
                        <button 
                            key={t.id}
                            onClick={() => { setTheme(t.id); onClose(); }}
                            className={`w-full text-left p-4 rounded-xl transition border-2 border-transparent bg-white/10 hover:border-current ${t.color}`}
                        >
                            <h4 className="font-bold text-xl">{t.name}</h4>
                            <p className="text-sm text-gray-400">{t.desc}</p>
                        </button>
                    ))}
                </div>
                <button onClick={onClose} className="mt-6 w-full text-white py-2 rounded-xl font-semibold bg-primary hover:opacity-90">
                    Close
                </button>
            </div>
        </div>
    );
};
