import React, { useEffect } from 'react';
import { X } from 'lucide-react';

// Centered dialog in the app's card style. Closes on Esc, a backdrop click, ✕ or Close.
const Modal = ({ isOpen, onClose, title, children }) => {
    useEffect(() => {
        if (!isOpen) return undefined;
        const onKeyDown = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div role="dialog" aria-modal="true" aria-label={title} className="relative card shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="section-title">{title}</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="p-1.5 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="px-6 py-5 overflow-y-auto">
                    {children}
                </div>
                <div className="flex justify-end px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                    <button type="button" onClick={onClose} className="btn btn-secondary">Close</button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
