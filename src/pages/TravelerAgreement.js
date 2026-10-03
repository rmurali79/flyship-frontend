import React from 'react';
import LegalPage from '../components/LegalPage';

const TravelerAgreement = ({ isModal }) => {
    return (
        <LegalPage title="Traveler (Courier) Agreement" updated="25th Dec 2025" isModal={isModal}>
            <p className="mb-6 text-gray-700 dark:text-gray-300 font-medium text-center">
                Travelers act as independent contractors, not employees of PeerPost.
            </p>
            <section>
                <h3>1. Duties</h3>
                <p className="mb-2">Travelers must:</p>
                <ul>
                    <li>Comply with all aviation rules</li>
                    <li>Verify shipments received</li>
                    <li>Deliver goods in a timely manner</li>
                    <li>Notify Shippers of delays</li>
                    <li>Avoid transporting prohibited items</li>
                </ul>
            </section>

            <section>
                <h3>2. Compensation</h3>
                <p className="mb-2">Travelers receive:</p>
                <ul>
                    <li>The agreed quote minus PeerPost fees</li>
                    <li>Payouts through Stripe or supported services</li>
                </ul>
                <p className="mt-2 text-gray-600 dark:text-gray-400 italic">Travelers are responsible for income reporting.</p>
            </section>

            <section>
                <h3>3. Prohibited Conduct</h3>
                <p className="mb-2">Travelers must not:</p>
                <ul>
                    <li>Carry items they suspect are illegal</li>
                    <li>Tamper with shipments</li>
                    <li>Misrepresent travel plans</li>
                    <li>Demand extra compensation outside the platform</li>
                </ul>
            </section>

            <section>
                <h3>4. Liability</h3>
                <p className="mb-2">Travelers indemnify PeerPost against:</p>
                <ul>
                    <li>Customs penalties</li>
                    <li>Airline baggage violations</li>
                    <li>Legal consequences of illegal items</li>
                </ul>
                <p className="mt-2 text-gray-600 dark:text-gray-400 italic">PeerPost does not guarantee any income.</p>
            </section>
        </LegalPage>
    );
};

export default TravelerAgreement;
