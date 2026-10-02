import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({ theme: 'dark', toggleTheme: () => {} });

// The saved choice wins; otherwise follow the OS setting. public/index.html applies the same
// rule before React loads, so the first paint is already in the right theme.
const initialTheme = () => {
    try {
        if (localStorage.theme === 'light' || localStorage.theme === 'dark') return localStorage.theme;
    } catch (e) { /* storage unavailable */ }
    return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(initialTheme);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme(current => {
            const next = current === 'dark' ? 'light' : 'dark';
            try { localStorage.theme = next; } catch (e) { /* storage unavailable */ }
            return next;
        });
    }, []);

    return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
