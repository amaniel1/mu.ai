import React, { createContext, useContext, useEffect, useState } from 'react';
import { Theme } from '../types';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(() => {
        return (localStorage.getItem('mu_ai_theme') as Theme) || Theme.Mekelle;
    });

    useEffect(() => {
        document.body.className = `antialiased theme-${theme} flex h-screen`;
        localStorage.setItem('mu_ai_theme', theme);
        
        // Dynamic CSS variable for opaque input background
        const opaqueInputBgMap: Record<Theme, string> = {
            [Theme.Mekelle]: '#007FFF',
            [Theme.Futuristic]: '#00F0FF',
            [Theme.NeoDark]: '#1c1c1e',
            [Theme.NeoLight]: '#E91E63',
            [Theme.Vibrant]: '#6C5CE7'
        };
        document.documentElement.style.setProperty('--input-opaque-bg-color', opaqueInputBgMap[theme] || '#007FFF');

    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useTheme must be used within ThemeProvider");
    return context;
};
