import React from 'react';
import LegalPage from '../components/LegalPage';

const PaymentTerms = ({ isModal }) => {
    return (
        <LegalPage title="Payment Terms" updated="25th Dec 2025" isModal={isModal}>
            <section>
                <p className="mb-4 font-medium text-center">
                    By using PeerPost, you agree to Stripe’s:
                </p>
                <ul>
                    <li>Terms of Service</li>
                    <li>Privacy Policy</li>
                    <li>Global payment rules</li>
                </ul>
            </section>

            <section>
                <h3>PeerPost never stores:</h3>
                <ul>
                    <li>Credit card numbers</li>
                    <li>Bank account details</li>
                </ul>
            </section>

            <section>
                <h3>Fees</h3>
                <ul>
                    <li>PeerPost collects a service fee for each shipment.</li>
                    <li>Fees are deducted automatically.</li>
                </ul>
            </section>

            <section>
                <h3>Payouts</h3>
                <ul>
                    <li>Travelers must onboard to Stripe Connect.</li>
                    <li>Payout timing depends on Stripe and country regulations.</li>
                </ul>
            </section>

            <section>
                <h3>Tax Responsibility</h3>
                <p className="mb-2">Users acknowledge:</p>
                <ul>
                    <li>PeerPost does not calculate or remit taxes on their behalf.</li>
                    <li>Users must follow local tax requirements.</li>
                </ul>
            </section>
        </LegalPage>
    );
};

export default PaymentTerms;
