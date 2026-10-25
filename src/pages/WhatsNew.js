import React from 'react';
import { Link } from 'react-router-dom';
import { Wallet as WalletIcon } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';

// Newest first. Each entry is a release note shown on the What's New page.
export const RELEASES = [
    {
        id: 'wallet-support',
        title: 'Wallet Support',
        date: 'October 2026',
        icon: WalletIcon,
        summary: 'PeerPost now has a built-in, multi-currency wallet that powers escrow-style payments between shippers and travelers.',
        highlights: [
            'Hold balances in USD, EUR, SGD, and GBP, side by side.',
            'Deposit and withdraw funds from the Wallet page.',
            'See your available and locked balances at a glance, with your headline balance always visible in the top bar.',
            'A shipper\'s budget is held when a shipment is posted and released or settled automatically as it progresses.',
            'Travelers\' quotes are backed by collateral, which is returned if the quote is not accepted.',
            'Fair cancellation handling: if an accepted shipment or trip is cancelled, part of the held funds compensates the other party.',
        ],
        cta: { to: '/wallet', label: 'Open your wallet' },
    },
];

const WhatsNew = () => (
    <div className="max-w-3xl mx-auto my-6">
        <PageHeader title="What's New" subtitle="The latest features and improvements to PeerPost." />
        <div className="space-y-6">
            {RELEASES.map(({ id, title, date, icon: Icon, summary, highlights, cta }) => (
                <article key={id} id={id} className="card p-6 sm:p-8">
                    <div className="flex items-start gap-3">
                        {Icon && <Icon className="mt-0.5 h-6 w-6 shrink-0 text-peerpost-gold" aria-hidden="true" />}
                        <div>
                            <p className="text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500">{date}</p>
                            <h2 className="font-display text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
                        </div>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{summary}</p>
                    <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-gray-600 dark:text-gray-300">
                        {highlights.map(h => <li key={h}>{h}</li>)}
                    </ul>
                    {cta && <Link to={cta.to} className="btn btn-primary mt-6 inline-flex">{cta.label}</Link>}
                </article>
            ))}
        </div>
    </div>
);

export default WhatsNew;
