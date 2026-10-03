import React from 'react';
import LegalPage from '../components/LegalPage';

const ShipperAgreement = ({ isModal }) => {
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <LegalPage title="Shipper Service Agreement" updated={today} isModal={isModal}>
            <p className="mb-6 text-gray-700 dark:text-gray-300 font-medium text-center">
                This agreement applies to all Shippers on PeerPost.
            </p>
            <section>
                <h3>1. Obligations</h3>
                <p className="mb-2">Shippers must:</p>
                <ul>
                    <li>Accurately declare contents and value</li>
                    <li>Provide safe and lawful items</li>
                    <li>Package securely</li>
                    <li>Meet Travelers on time for handover</li>
                    <li>Provide correct recipient details</li>
                </ul>
            </section>

            <section>
                <h3>2. Prohibited Behavior</h3>
                <p className="mb-2">Shippers must not:</p>
                <ul>
                    <li>Ship illegal or dangerous goods</li>
                    <li>Misdeclare contents or value</li>
                    <li>Request Travelers to evade customs</li>
                    <li>Engage in fraud</li>
                </ul>
            </section>

            <section>
                <h3>3. Payment</h3>
                <p className="mb-2">Shippers agree to:</p>
                <ul>
                    <li>Fund accepted quotes</li>
                    <li>Pay PeerPost platform fees</li>
                    <li>Accept Stripe’s payment terms</li>
                </ul>
            </section>

            <section>
                <h3>4. Cancellations</h3>
                <p>Cancellations after a Traveler accepts may result in fees.</p>
            </section>

            <section>
                <h3>5. Liability</h3>
                <p className="mb-2">Shippers indemnify PeerPost from losses caused by:</p>
                <ul>
                    <li>Misdeclared items</li>
                    <li>Prohibited goods</li>
                    <li>Damage due to insufficient packaging</li>
                </ul>
                <p className="mt-2 text-gray-600 dark:text-gray-400 italic">There is no insurance unless explicitly purchased.</p>
            </section>
        </LegalPage>
    );
};

export default ShipperAgreement;
