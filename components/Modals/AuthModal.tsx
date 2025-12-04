import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { Loader2 } from 'lucide-react';

export const AuthModal: React.FC = () => {
    // Default to 'signup' as requested
    const [mode, setMode] = useState<'signin' | 'signup'>('signup');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form Fields
    const [emailOrId, setEmailOrId] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [muId, setMuId] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (mode === 'signup') {
                const email = `${muId}@mu.edu.et`;
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                
                await updateProfile(userCredential.user, { displayName: name });
                
                await setDoc(doc(db, 'users', userCredential.user.uid), {
                    name,
                    muId,
                    email,
                    isPremium: false,
                    createdAt: new Date()
                });
            } else {
                let finalEmail = emailOrId;
                if (!finalEmail.includes('@')) {
                    finalEmail = `${finalEmail}@mu.edu.et`;
                }
                await signInWithEmailAndPassword(auth, finalEmail, password);
            }
        } catch (err: any) {
            setError(err.message.replace('Firebase: ', ''));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="glass w-full max-w-lg p-6 rounded-2xl text-secondary">
                <h2 className="text-3xl font-bold mb-4 text-primary text-center">
                    {mode === 'signin' ? 'Sign In' : 'Create Account'}
                </h2>
                
                {error && (
                    <div className="bg-red-500/20 border border-red-500 text-red-100 p-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === 'signin' ? (
                        <input 
                            type="text" 
                            placeholder="UGR or ID with no /" 
                            value={emailOrId}
                            onChange={(e) => setEmailOrId(e.target.value)}
                            required
                            className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-secondary focus:ring-2 focus:ring-primary outline-none"
                        />
                    ) : (
                        <>
                            <input 
                                type="text" 
                                placeholder="Name" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-secondary focus:ring-2 focus:ring-primary outline-none"
                            />
                            <input 
                                type="text" 
                                placeholder="Mekelle University ID (e.g. Your UGR)" 
                                value={muId}
                                onChange={(e) => setMuId(e.target.value)}
                                required
                                className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-secondary focus:ring-2 focus:ring-primary outline-none"
                            />
                        </>
                    )}

                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-secondary focus:ring-2 focus:ring-primary outline-none"
                    />

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full text-white py-3 rounded-xl text-xl font-semibold transition bg-primary hover:opacity-90 flex items-center justify-center"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : (mode === 'signin' ? 'Sign In' : 'Sign Up')}
                    </button>
                </form>

                <p className="text-center mt-4 text-sm">
                    {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
                    <button 
                        onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                        className="text-primary hover:underline font-semibold"
                    >
                        {mode === 'signin' ? 'Sign Up' : 'Sign In'}
                    </button>
                </p>
            </div>
        </div>
    );
};