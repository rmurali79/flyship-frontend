import React from 'react';
import { useTheme } from '../context/ThemeContext';

// Theme switch from the PeerPost reference design (reference/Index-html/Motion.dc.html):
// a pill track whose thumb slides right for light mode, showing a moon (dark) or sun (light).
const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <button
            type="button"
            role="switch"
            aria-checked={isDark}
            aria-label="Dark mode"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={toggleTheme}
            className="pp-theme-toggle relative flex-none w-[52px] h-7 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-peerpost-gold/60"
            style={{ background: 'var(--pp-toggle-track)' }}
        >
            <span
                className="absolute top-[3px] left-[3px] w-[22px] h-[22px] rounded-full flex items-center justify-center shadow-sm"
                style={{
                    background: 'var(--pp-toggle-thumb)',
                    transform: `translateX(${isDark ? 0 : 24}px)`,
                    transition: 'transform 180ms cubic-bezier(0.77, 0, 0.175, 1)',
                }}
            >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: 'oklch(var(--pp-gold))' }} aria-hidden="true">
                    {isDark ? (
                        <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />
                    ) : (
                        <>
                            <circle cx="12" cy="12" r="4.5" />
                            <path d="M12 2.5v3M12 18.5v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2.5 12h3M18.5 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
                        </>
                    )}
                </svg>
            </span>
        </button>
    );
};

export default ThemeToggle;
