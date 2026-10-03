import React from 'react';
import LegalPage from '../components/LegalPage';

const RefundPolicy = ({ isModal }) => {
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <LegalPage title="Refund & Cancellation Policy" updated={today} isModal={isModal}>
            <section>
                <h3>1. Shipper-Initiated Cancellations</h3>
                <ul>
                    <li>Before Traveler acceptance → Full refund</li>
                    <li>After Traveler acceptance → Platform fee non-refundable</li>
                </ul>
            </section>

            <section>
                <h3>2. Traveler-Initiated Cancellations</h3>
                <p className="mb-2">If a Traveler cancels:</p>
                <ul>
                    <li>The Shipper receives a full refund</li>
                    <li>PeerPost may penalize or suspend the Traveler</li>
                </ul>
            </section>

            <section>
                <h3>3. Delivery Failure</h3>
                <p className="mb-2">Refund outcomes depend on:</p>
                <ul>
                    <li>Circumstances</li>
                    <li>Proof of compliance</li>
                    <li>Evidence submitted</li>
                </ul>
                <p className="mt-2 text-gray-600 dark:text-gray-400 italic">PeerPost may mediate but does not guarantee refunds.</p>
            </section>

            <section>
                <h3>4. Chargebacks</h3>
                <p className="mb-2">Unauthorized chargebacks may:</p>
                <ul>
                    <li>Suspend the user</li>
                    <li>Trigger indemnity obligations</li>
                </ul>
            </section>

            <section>
                <p className="font-medium text-center mt-8">All refunds are processed via Stripe and follow Stripe’s timelines.</p>
            </section>
        </LegalPage>
    );
};

export default RefundPolicy;
