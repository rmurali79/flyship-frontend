import React, { createContext, useState, useContext, useCallback } from 'react';

const SnackbarContext = createContext();

export const useSnackbar = () => useContext(SnackbarContext);

export const SnackbarProvider = ({ children }) => {
    const [snackbar, setSnackbar] = useState(null);

    const showSnackbar = useCallback((message, type = 'info', duration = 4000) => {
        setSnackbar({ message, type, id: Date.now() });
        setTimeout(() => setSnackbar(null), duration);
    }, []);

    const success = useCallback((msg) => showSnackbar(msg, 'success'), [showSnackbar]);
    const error = useCallback((msg) => showSnackbar(msg, 'error', 5000), [showSnackbar]);
    const warn = useCallback((msg) => showSnackbar(msg, 'warn'), [showSnackbar]);
    const info = useCallback((msg) => showSnackbar(msg, 'info'), [showSnackbar]);

    const bgColor = {
        success: 'bg-green-600',
        error: 'bg-red-600',
        warn: 'bg-yellow-500',
        info: 'bg-blue-600',
    };

    return (
        <SnackbarContext.Provider value={{ showSnackbar, success, error, warn, info }}>
            {children}
            {snackbar && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
                    <div className={`${bgColor[snackbar.type]} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] max-w-[500px]`}>
                        <span className="flex-1">{snackbar.message}</span>
                        <button onClick={() => setSnackbar(null)} className="text-white/80 hover:text-white font-bold text-lg leading-none">&times;</button>
                    </div>
                </div>
            )}
        </SnackbarContext.Provider>
    );
};
