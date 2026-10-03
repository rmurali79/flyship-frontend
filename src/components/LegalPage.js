import React from 'react';

// Shared layout for the legal pages. On their own route they render as a card with the title;
// inside the landing page's modal (`isModal`) the modal already shows the title, so only the
// body is rendered. Body typography comes from the .legal class in index.css.
const LegalPage = ({ title, subtitle, updated, isModal, children }) => {
    const body = (
        <div className="legal">
            {updated && <p className="legal-updated">Last updated: {updated}</p>}
            {children}
        </div>
    );
    if (isModal) return body;
    return (
        <div className="max-w-3xl mx-auto my-6 card p-6 sm:p-10">
            <h1 className="page-title">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
            <div className="mt-6">{body}</div>
        </div>
    );
};

export const legalToday = () => new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

export default LegalPage;
