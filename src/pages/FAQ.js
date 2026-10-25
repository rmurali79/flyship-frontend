import React from 'react';
import PageHeader from '../components/ui/PageHeader';

// Draft answers drawn from how the app works today; product will refine the wording.
export const FAQ_SECTIONS = [
    {
        title: 'Getting started',
        items: [
            {
                q: 'What is PeerPost?',
                a: 'PeerPost connects people who need to send a package (shippers) with travelers who are already flying that route. Travelers carry the package in their spare luggage space and earn money for a trip they were taking anyway.',
            },
            {
                q: 'Can I be both a shipper and a traveler?',
                a: 'Yes. When you register you can choose to ship, travel, or both, and you can switch between sending packages and carrying them from the same account.',
            },
            {
                q: 'Why do I need to verify my email with a code?',
                a: 'After registering we send a one-time code (OTP) to your email address. Entering it confirms the address is yours, which keeps accounts and notifications secure. If it does not arrive, you can request a new code from the verification screen.',
            },
        ],
    },
    {
        title: 'Sending a package',
        items: [
            {
                q: 'How do I send a package?',
                a: 'From your dashboard, create a shipment with the origin, destination, item details, the latest date it needs to arrive, and your maximum budget. Travelers flying that route can then send you quotes.',
            },
            {
                q: 'How do I choose a traveler?',
                a: 'Open your shipment to see the quotes you have received, including each traveler\'s price and delivery date. Quotes can never exceed your budget or arrive later than your deadline. Accept the one that suits you best and the other quotes are released.',
            },
            {
                q: 'Can I cancel a shipment?',
                a: 'Yes. Before you accept a quote, cancelling releases your full budget back to your wallet. After a traveler has been accepted, a cancellation penalty applies: part of the held budget compensates the traveler and part is kept as a fee, and the rest is returned to you.',
            },
            {
                q: 'How do I track my shipment?',
                a: 'Every shipment has a status timeline that moves from pending to accepted, in transit, and delivered. You get an email and an in-app notification each time the traveler updates the status.',
            },
        ],
    },
    {
        title: 'Traveling and earning',
        items: [
            {
                q: 'How do I earn as a traveler?',
                a: 'Add a travel plan with your route and dates. PeerPost shows you open shipments on that route, and you can send a quote with your price and delivery date. Once a shipper accepts, you carry the package and get paid when it is delivered.',
            },
            {
                q: 'Why are funds held in my wallet when I send a quote?',
                a: 'When you quote, an amount equal to your quote is locked in your wallet as collateral. It shows as "Locked" on your wallet page. If your quote is not accepted, or the shipment is cancelled, the collateral is released back to your available balance.',
            },
            {
                q: 'What happens if I cancel a trip after being accepted?',
                a: 'Cancelling a travel plan with an accepted shipment applies a cancellation penalty to your collateral, part of which compensates the shipper. Please only quote on trips you are confident you will take.',
            },
            {
                q: 'How do I update a shipment\'s status?',
                a: 'Only the accepted traveler can update the status. Mark the shipment in transit once you have picked it up, and delivered once it has been handed over.',
            },
        ],
    },
    {
        title: 'Payments and wallet',
        items: [
            {
                q: 'How does the wallet work?',
                a: 'Your wallet holds balances in USD, EUR, SGD, and GBP. You can deposit and withdraw funds from the Wallet page. Your available balance is what you can spend or withdraw, and your locked balance is money held for active shipments or quotes.',
            },
            {
                q: 'Why is part of my balance locked?',
                a: 'PeerPost uses escrow-style payments. A shipper\'s budget is held when they post a shipment, and a traveler\'s collateral is held when they quote. Locked funds are released or settled automatically as the shipment progresses, is delivered, or is cancelled.',
            },
            {
                q: 'Does PeerPost charge fees?',
                a: 'PeerPost collects a service fee for each shipment, deducted automatically. See the Payment Terms and Refund Policy for details.',
            },
        ],
    },
    {
        title: 'Trust and safety',
        items: [
            {
                q: 'How do I know I can trust the other person?',
                a: 'Travelers are identity-verified before they can accept a shipment, and shippers and travelers rate each other after every delivery, so everyone builds a visible track record.',
            },
            {
                q: 'What if something goes wrong with my shipment?',
                a: 'You can raise a dispute from the shipment page, for example if an item is damaged, lost, not as described, late, or the other person did not show up. Add a description and photo evidence, and the other party can respond before the dispute is resolved.',
            },
            {
                q: 'What can I not send?',
                a: 'Illegal, dangerous, or restricted items are never allowed, and travelers can decline anything they are not comfortable carrying. See the Shipper Agreement and Risk Disclosure for the full rules.',
            },
        ],
    },
];

const FAQ = () => (
    <div className="max-w-3xl mx-auto my-6">
        <PageHeader title="Frequently asked questions" subtitle="Answers to common questions about shipping and traveling with PeerPost." />
        <div className="space-y-8">
            {FAQ_SECTIONS.map(section => (
                <section key={section.title}>
                    <h2 className="mb-3 font-display text-lg font-semibold text-gray-900 dark:text-white">{section.title}</h2>
                    <div className="card divide-y divide-gray-200 dark:divide-gray-700">
                        {section.items.map(item => (
                            <details key={item.q} className="group px-5 py-4">
                                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-gray-900 dark:text-white">
                                    {item.q}
                                    <span aria-hidden="true" className="inline-block text-gray-400 transition group-open:rotate-45">+</span>
                                </summary>
                                <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{item.a}</p>
                            </details>
                        ))}
                    </div>
                </section>
            ))}
        </div>
    </div>
);

export default FAQ;
