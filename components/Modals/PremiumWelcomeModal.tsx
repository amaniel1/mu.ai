import React from 'react';

export const PremiumWelcomeModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4">
            <div className="glass w-full max-w-lg p-8 rounded-2xl text-center text-white border-4 border-green-500 shadow-2xl relative">
                <img src="logo.png" onError={(e) => e.currentTarget.src = "https://upload.wikimedia.org/wikipedia/en/thumb/e/e6/Mekelle_University_logo.png/220px-Mekelle_University_logo.png"} className="w-24 h-24 mx-auto mb-4 rounded-full border-2 border-green-400 object-contain bg-white"/>
                <h2 className="text-4xl font-extrabold mb-3 text-green-400 animate-pulse">PREMIUM UNLOCKED!</h2>
                <p className="text-xl mb-6 text-white">
                    Thank you for becoming a <strong>Mekelle University AI Premium User</strong>!
                </p>
                <p className="text-lg text-secondary mb-8">
                    You now have unlimited access to <strong>File/Document Upload</strong> and support the continued development of this assistant. Happy chatting!
                </p>
                <button 
                    onClick={onClose}
                    className="w-full max-w-xs text-white py-3 rounded-xl text-lg font-semibold transition bg-green-600 hover:bg-green-700 mx-auto block"
                >
                    Start Using Premium Features
                </button>
            </div>
        </div>
    );
};