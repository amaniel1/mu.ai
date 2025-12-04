import React from 'react';

export const PremiumModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
        <div className="glass w-full max-w-lg p-6 rounded-2xl text-white">
            <h2 className="text-3xl font-bold mb-4 text-green-400">Unlock Premium Features</h2>
            <p className="mb-4">
                To upload files and get unlimited access, a premium subscription is required (50 ETB).
            </p>
            <div className="space-y-2 mb-6 ml-4 text-secondary">
                <p>1. Transfer via:</p>
                <ul className="list-disc ml-6">
                    <li>🔰 <strong>Telebirr</strong>: +251980337790</li>
                    <li>🔰 <strong>Bank</strong>: 1000653919305</li>
                </ul>
                <p>2. Send screenshot & MU ID to Telegram:</p>
                <p className="text-green-400 font-bold ml-6">
                    <a href="https://t.me/Amax_v2" target="_blank" rel="noreferrer" className="underline">@Amax_v2</a>
                </p>
                <p>3. Wait 3-5 hours for activation.</p>
            </div>
            <button onClick={onClose} className="w-full text-white py-2 rounded-xl font-semibold bg-primary hover:opacity-90">
                Got It!
            </button>
        </div>
    </div>
);
