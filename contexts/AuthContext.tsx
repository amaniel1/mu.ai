import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { UserProfile } from '../types';

interface AuthContextType {
    user: UserProfile | null;
    loading: boolean;
    isPremium: boolean;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUserProfile = async (firebaseUser: User) => {
        try {
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            const snapshot = await getDoc(userDocRef);
            if (snapshot.exists()) {
                const data = snapshot.data();
                setUser({
                    uid: firebaseUser.uid,
                    name: data.name || firebaseUser.displayName || 'MU User',
                    muId: data.muId || 'N/A',
                    email: data.email || firebaseUser.email || 'N/A',
                    isPremium: !!data.isPremium,
                });
                
                // Save to local storage for offline logic if needed
                localStorage.setItem('mu_user_name', data.name || 'MU User');
                localStorage.setItem('mu_user_type', data.isPremium ? 'Premium' : 'Regular');
            } else {
                console.warn("User document not found");
                setUser(null);
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                await fetchUserProfile(firebaseUser);
            } else {
                setUser(null);
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    const logout = async () => {
        await firebaseSignOut(auth);
        setUser(null);
        localStorage.removeItem('mu_ai_chats');
        localStorage.removeItem('mu_user_name');
        localStorage.removeItem('mu_user_type');
    };

    const refreshUser = async () => {
        if (auth.currentUser) {
            await fetchUserProfile(auth.currentUser);
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            loading, 
            isPremium: user?.isPremium || false,
            logout,
            refreshUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};
