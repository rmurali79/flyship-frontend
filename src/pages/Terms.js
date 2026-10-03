import React from 'react';
import LegalPage from '../components/LegalPage';

const Terms = ({ isModal }) => {
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <LegalPage title="Terms of Service" subtitle="PeerPost – peer-to-peer air logistics platform" updated={today} isModal={isModal}>
            <section>
                <p className="mb-4">
                    Welcome to PeerPost (“PeerPost”, “we”, “us”, “our”). These Terms of Service govern your access to and use of the PeerPost platform, mobile application, and related services (collectively, the “Service”).
                </p>
                <p className="font-bold">By registering, accessing, or using PeerPost, you agree to be bound by these Terms. If you do not agree, do not use the Service.</p>
            </section>

            <section>
                <p className="mb-2">PeerPost operates globally and allows:</p>
                <ul>
                    <li>Senders (“Shippers”) to request delivery of goods (“Shipments”),</li>
                    <li>Travelers (“Couriers”) to carry goods during their personal air travel,</li>
                    <li>PeerPost to facilitate matching, quoting, payments, and communication.</li>
                </ul>
                <p>PeerPost is not a courier company. PeerPost does not own, control, or manage transportation services. All deliveries are performed by Users acting in their personal capacity.</p>
            </section>

            <section>
                <h3>1. Eligibility</h3>
                <p className="mb-2">To use PeerPost, you must:</p>
                <ul>
                    <li>Be at least 18 years old.</li>
                    <li>Have full legal capacity to enter into contracts.</li>
                    <li>Comply with all applicable aviation, customs, import/export, and security laws.</li>
                    <li>Provide accurate information when registering.</li>
                    <li>Not have been previously suspended or removed from the Service.</li>
                </ul>
                <p className="mt-2">PeerPost may request identity verification, including passport or government ID.</p>
            </section>

            <section>
                <h3>2. Description of the Service</h3>
                <p className="mb-2">PeerPost provides a digital platform enabling:</p>
                <ul>
                    <li>Shippers to create shipment requests and propose a delivery date and fee (“Shipper Quote”).</li>
                    <li>Travelers to respond with counter-offers (“Traveler Quote”).</li>
                    <li>Shippers to select a Traveler and confirm the delivery.</li>
                    <li>Travelers to deliver the items during their scheduled air travel.</li>
                    <li>Secure payments through third-party providers such as Stripe.</li>
                    <li>Platform fees applied as a percentage of the accepted quote.</li>
                </ul>
                <p className="mt-2 font-semibold">PeerPost does not:</p>
                <ul>
                    <li>Transport items,</li>
                    <li>Act as an agent for Shippers or Travelers,</li>
                    <li>Guarantee delivery timing or outcomes,</li>
                    <li>Provide insurance unless explicitly stated.</li>
                </ul>
            </section>

            <section>
                <h3>3. User Responsibilities</h3>
                <h4 className="font-semibold mt-2">3.1 Shippers</h4>
                <p className="mb-2">Shippers must:</p>
                <ul>
                    <li>Accurately describe the Shipment contents and value.</li>
                    <li>Ensure items are legal, permitted, and compliant with airline policies.</li>
                    <li>Ensure packaging is secure and safe.</li>
                    <li>Not include prohibited items such as weapons, drugs, hazardous materials, or counterfeit goods.</li>
                    <li>Comply with customs and import regulations of all relevant countries.</li>
                </ul>

                <h4 className="font-semibold mt-4">3.2 Travelers</h4>
                <p className="mb-2">Travelers must:</p>
                <ul>
                    <li>Comply with airline baggage rules and customs requirements.</li>
                    <li>Inspect the contents of shipments or request full disclosure.</li>
                    <li>Not transport illegal, restricted, or unsafe items.</li>
                    <li>Deliver the goods directly to the Shipper’s designated recipient.</li>
                    <li>Notify PeerPost and the Shipper immediately of delays or issues.</li>
                </ul>
            </section>

            <section>
                <h3>4. Payments & Fees</h3>
                <p>PeerPost uses a third-party provider (e.g., Stripe) to process all payments.</p>

                <h4 className="font-semibold mt-2">4.1 For Shippers</h4>
                <ul>
                    <li>You must fund the shipment upon confirming a Traveler.</li>
                    <li>The full amount is authorized but may only be captured upon delivery.</li>
                    <li>PeerPost charges a Platform Fee, disclosed at checkout.</li>
                </ul>

                <h4 className="font-semibold mt-2">4.2 For Travelers</h4>
                <ul>
                    <li>Travelers receive the net amount minus PeerPost’s Platform Fee.</li>
                    <li>Payouts occur via Stripe or other supported mechanisms.</li>
                    <li>Travelers are responsible for any taxes or reporting obligations.</li>
                </ul>

                <h4 className="font-semibold mt-2">4.3 Chargebacks & Disputes</h4>
                <ul>
                    <li>You agree that PeerPost is not responsible for payment reversals.</li>
                    <li>Chargebacks may result in account suspension.</li>
                    <li>Disputes between Users must be resolved between the parties; PeerPost may mediate but has no obligation to do so.</li>
                </ul>
            </section>

            <section>
                <h3>5. User Verification & Security</h3>
                <p>PeerPost may, at its discretion:</p>
                <ul>
                    <li>Require identity verification.</li>
                    <li>Request travel itineraries or boarding passes.</li>
                    <li>Require proof of shipment handover or delivery.</li>
                </ul>
                <p className="mt-2">PeerPost is not responsible for verifying the identity of Users but may restrict accounts suspected of fraud.</p>
            </section>

            <section>
                <h3>6. Prohibited Items</h3>
                <p>The following are strictly prohibited:</p>
                <ul className="list-disc pl-5 grid grid-cols-1 md:grid-cols-2 gap-2">
                    <li>Illegal drugs or controlled substances</li>
                    <li>Weapons, ammunition, explosives</li>
                    <li>Hazardous materials, flammables</li>
                    <li>Counterfeit goods or stolen property</li>
                    <li>Perishables requiring temperature control</li>
                    <li>Items prohibited by airlines or airport authorities</li>
                    <li>Items prohibited by customs regulations</li>
                </ul>
                <p className="mt-2 text-red-600 font-semibold">PeerPost may suspend or terminate accounts for violations.</p>
            </section>

            <section>
                <h3>7. PeerPost Is Not a Carrier</h3>
                <p>PeerPost:</p>
                <ul>
                    <li>Does not employ Travelers.</li>
                    <li>Is not responsible for loss, theft, damage, or delays.</li>
                    <li>Does not supervise Users’ activities.</li>
                    <li>Operates only as a marketplace platform.</li>
                </ul>
                <p className="mt-2 font-semibold">Travelers and Shippers enter into a separate independent contract between themselves.</p>
            </section>

            <section>
                <h3>8. Indemnity</h3>
                <p>You agree to indemnify, defend, and hold harmless PeerPost, its affiliates, employees, and partners from all claims, damages, penalties, fines, losses, liabilities, and expenses arising out of:</p>
                <ul>
                    <li>Your use of the Service</li>
                    <li>Your violation of these Terms</li>
                    <li>Your breach of customs, aviation, or security laws</li>
                    <li>Misrepresentation of shipment contents</li>
                    <li>Transportation of illegal or prohibited items</li>
                    <li>Loss, damage, or delay caused by you</li>
                    <li>Your interactions or disputes with other Users</li>
                    <li>Chargebacks, payment disputes, or fraud</li>
                    <li>Third-party claims by airlines, airports, customs, or law enforcement</li>
                </ul>
                <p className="mt-2">This includes legal fees and regulatory penalties.</p>
            </section>

            <section>
                <h3>9. Limitation of Liability</h3>
                <p>To the fullest extent permitted by law:</p>
                <ul>
                    <li>PeerPost is not liable for any indirect, incidental, punitive, or consequential damages.</li>
                    <li>PeerPost does not guarantee delivery success or safety.</li>
                    <li>Maximum liability of PeerPost under any claim is the Platform Fee paid for the transaction (or USD 100, whichever is less).</li>
                </ul>
                <p className="mt-2">Some jurisdictions do not allow limitation of liability; in those cases, PeerPost’s liability is limited to the maximum extent allowed by law.</p>
            </section>

            <section>
                <h3>10. No Insurance Provided</h3>
                <p>Unless explicitly offered, PeerPost does not provide:</p>
                <ul>
                    <li>Shipping insurance</li>
                    <li>Liability insurance</li>
                    <li>Traveler or Shipper coverage</li>
                </ul>
                <p className="mt-2">Users may procure third-party insurance at their own expense.</p>
            </section>

            <section>
                <h3>11. Dispute Resolution</h3>
                <h4 className="font-semibold">11.1 Between Users</h4>
                <p>Shippers and Travelers must attempt to resolve disputes between themselves. PeerPost may assist but has no obligation to mediate.</p>

                <h4 className="font-semibold mt-2">11.2 Between User and PeerPost</h4>
                <p>Disputes shall be resolved through:</p>
                <ul>
                    <li>Arbitration (if permitted by applicable law),</li>
                    <li>Or courts of competent jurisdiction in the governing region (see Section 15).</li>
                </ul>
            </section>

            <section>
                <h3>12. Termination</h3>
                <p>PeerPost may suspend or terminate your account immediately if:</p>
                <ul>
                    <li>You violate these Terms</li>
                    <li>You engage in fraud or suspicious behavior</li>
                    <li>You misuse the platform</li>
                    <li>You transport prohibited items</li>
                    <li>You endanger other Users or the platform</li>
                </ul>
                <p className="mt-2">You may terminate your account at any time.</p>
            </section>

            <section>
                <h3>13. Intellectual Property</h3>
                <p>PeerPost owns all trademarks, logos, branding, source code, design elements, software, content, and architecture. You may not copy, reproduce, or adapt PeerPost’s platform without written permission.</p>
            </section>

            <section>
                <h3>14. Privacy Policy</h3>
                <p>Your use of PeerPost is subject to our Privacy Policy, which explains how data is collected, used, stored, and shared globally. PeerPost complies with applicable privacy regulations such as GDPR, CCPA, PDPA, and other regional privacy laws.</p>
            </section>

            <section>
                <h3>15. Governing Law</h3>
                <p>As PeerPost operates globally, governing law is designated as:</p>
                <ul>
                    <li>Singapore law, or</li>
                    <li>your local jurisdiction if required by mandatory regulations.</li>
                </ul>
                <p className="mt-2">Arbitration venue (if applicable): Singapore International Arbitration Centre (SIAC).</p>
            </section>

            <section>
                <h3>16. Modifications</h3>
                <p>PeerPost may update these Terms from time to time. Continued use after changes constitutes acceptance.</p>
            </section>

            <section>
                <h3>17. Contact Information</h3>
                <p>PeerPost Support</p>
                <p>Email: support@peerpost.online</p>
                <p>Website: https://peerpost.online</p>
            </section>
        </LegalPage>
    );
};

export default Terms;
