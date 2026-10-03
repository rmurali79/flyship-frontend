import React from 'react';
import LegalPage from '../components/LegalPage';

const RiskDisclosure = ({ isModal }) => {
    return (
        <LegalPage title="Risk Disclosure & Liability Waiver" updated="25th Dec 2025" isModal={isModal}>
            <p className="mb-6 text-gray-700 dark:text-gray-300 font-bold text-center">
                By registering and using PeerPost, you acknowledge and agree to the following risks:
            </p>
            <section>
                <h3>1. Nature of Service</h3>
                <p className="mb-2">PeerPost is a peer-to-peer logistics marketplace. PeerPost:</p>
                <ul>
                    <li>Does not deliver items</li>
                    <li>Does not employ Travelers</li>
                    <li>Does not supervise shipments</li>
                    <li>Is not responsible for delays, damage, or loss</li>
                </ul>
            </section>

            <section>
                <h3>2. Risks You Accept</h3>
                <h4 className="font-semibold mt-2">As a Shipper, you acknowledge risks including:</h4>
                <ul>
                    <li>Damage, theft, or loss of goods</li>
                    <li>Wrongful handling by Travelers</li>
                    <li>Customs seizure or inspection</li>
                    <li>Delays due to flight cancellations or baggage issues</li>
                    <li>Travelers failing to complete delivery</li>
                </ul>

                <h4 className="font-semibold mt-2">As a Traveler, you acknowledge risks including:</h4>
                <ul>
                    <li>Carrying misdeclared or prohibited items</li>
                    <li>Airport or airline penalties for baggage violations</li>
                    <li>Customs checks and potential liability</li>
                    <li>Delays or disruptions caused by Shippers</li>
                </ul>
            </section>

            <section>
                <h3>3. Waiver of Claims Against PeerPost</h3>
                <p className="mb-2">You expressly waive any claims against PeerPost for:</p>
                <ul>
                    <li>Lost shipments</li>
                    <li>Misdelivery</li>
                    <li>Flight interruptions</li>
                    <li>Airport authority actions</li>
                    <li>Traveler or Shipper behavior</li>
                    <li>Delays, indirect damages, or consequential losses</li>
                </ul>
                <p className="mt-2">Maximum liability remains limited as outlined in the Terms of Service.</p>
            </section>

            <section>
                <h3>4. Duty to Comply</h3>
                <p className="mb-2">Users must comply with all:</p>
                <ul>
                    <li>Airline baggage rules</li>
                    <li>Customs requirements</li>
                    <li>Aviation security laws</li>
                    <li>Export/import regulations</li>
                </ul>
                <p className="mt-2">PeerPost assumes no liability for violations.</p>
            </section>

            <section>
                <p className="font-bold text-center mt-8 text-lg">You agree to use PeerPost at your own risk.</p>
            </section>
        </LegalPage>
    );
};

export default RiskDisclosure;
