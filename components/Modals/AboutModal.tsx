import React from 'react';

export const AboutModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4">
        <div className="glass w-full max-w-lg p-8 rounded-2xl text-center text-white border-2 border-white/20 shadow-2xl relative overflow-y-auto max-h-[90vh]">
            <img 
                src="myImage.png" 
                onError={(e) => e.currentTarget.src = "https://picsum.photos/200/200"} 
                className="w-24 h-24 mx-auto mb-4 rounded-full border-2 border-primary object-cover bg-white"
                alt="Creator"
            />
            <h2 className="text-3xl font-extrabold mb-2 text-primary">About the Assistant</h2>
            <p className="text-secondary mb-6 text-sm">v1.4 | Designed for Mekelle University</p>
            
            <div className="text-left space-y-4 bg-white/5 p-4 rounded-xl mb-6 text-sm text-gray-200">
                <p>
                    🎓 This AI assistant is an educational tool created by <strong>Amaniel Niguse</strong> (Dept. of Economics) to support the academic journey of MU students.
                </p>
                <p>
                    🚀 It features advanced multimodal capabilities, document analysis, and now utilizes Google's latest <strong>Gemini 3 Pro</strong> reasoning and <strong>Search Grounding</strong> models.
                </p>
            </div>

            <div className="space-y-2 mb-8 text-left border-t border-white/10 pt-4">
                <h3 className="font-bold text-white mb-2">Contact Developer:</h3>
                <div className="flex flex-col gap-1 text-sm text-secondary">
                    <p>👤 Amaniel Niguse</p>
                    <p>🗨 Telegram: <a href="https://t.me/Amax_v2" target="_blank" className="text-primary hover:underline">@Amax_v2</a></p>
                    <p>📧 Email: amanial.v2@gmail.com</p>
                    <p>☎️ Phone: +251980337790</p>
                </div>
            </div>

            <button 
                onClick={onClose}
                className="w-full text-white py-3 rounded-xl text-lg font-semibold transition bg-primary hover:opacity-90"
            >
                Close
            </button>
        </div>
    </div>
);
