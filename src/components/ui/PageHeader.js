import React from 'react';

// Page title with an optional subtitle and actions (buttons, toggles) on the right.
// `titleAs` lets a section below the page's own h1 reuse the layout with an h2.
const PageHeader = ({ title, subtitle, actions, className = '', titleAs: Title = 'h1' }) => (
    <div className={`flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-6 ${className}`}>
        <div>
            <Title className="page-title">{title}</Title>
            {subtitle && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
    </div>
);

export default PageHeader;
