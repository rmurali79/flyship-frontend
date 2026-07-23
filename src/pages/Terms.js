const Terms = ({ isModal }) => {
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const content = (
        <>
            {!isModal && (
                <>
                    <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white text-center">TERMS OF SERVICE (TOS)</h1>
                    <h2 className="text-xl font-semibold mb-8 text-gray-700 dark:text-gray-300 text-center">JetRunner – Peer-to-Peer Air Logistics Platform</h2>
                </>
            )}

            <p className="mb-4 text-gray-600 dark:text-gray-400 font-italic text-sm text-center">Last Updated: {today}</p>

            <div className="space-y-6 text-gray-700 dark:text-gray-300">
                <section>
                    <p className="mb-4">
                        Welcome to JetRunner (“JetRunner”, “we”, “us”, “our”). These Terms of Service govern your access to and use of the JetRunner platform, mobile application, and related services (collectively, the “Service”).
                    </p>
                    <p className="font-bold">By registering, accessing, or using JetRunner, you agree to be bound by these Terms. If you do not agree, do not use the Service.</p>
                </section>

                <section>
                    <p className="mb-2">JetRunner operates globally and allows:</p>
                    <ul className="list-disc pl-5 mb-2">
                        <li>Senders (“Shippers”) to request delivery of goods (“Shipments”),</li>
                        <li>Travelers (“Couriers”) to carry goods during their personal air travel,</li>
                        <li>JetRunner to facilitate matching, quoting, payments, and communication.</li>
                    </ul>
                    <p>JetRunner is not a courier company. JetRunner does not own, control, or manage transportation services. All deliveries are performed by Users acting in their personal capacity.</p>
                </section>

                <section>
                    <h3 className="text-lg font-bold mb-2">1. Eligibility</h3>
                    <p className="mb-2">To use JetRunner, you must:</p>
                    <ul className="list-disc pl-5">
                        <li>Be at least 18 years old.</li>
                        <li>Have full legal capacity to enter into contracts.</li>
                        <li>Comply with all applicable aviation, customs, import/export, and security laws.</li>
                        <li>Provide accurate information when registering.</li>
                        <li>Not have been previously suspended or removed from the Service.</li>
                    </ul>
                    <p className="mt-2">JetRunner may request identity verification, including passport or government ID.</p>
                </section>

                <section>
                    <h3 className="text-lg font-bold mb-2">2. Description of the Service</h3>
                    <p className="mb-2">JetRunner provides a digital platform enabling:</p>
                    <ul className="list-disc pl-5">
                        <li>Shippers to create shipment requests and propose a delivery date and fee (“Shipper Quote”).</li>
                        <li>Travelers to respond with counter-offers (“Traveler Quote”).</li>
                        <li>Shippers to select a Traveler and confirm the delivery.</li>
                        <li>Travelers to deliver the items during their scheduled air travel.</li>
                        <li>Secure payments through third-party providers such as Stripe.</li>
                        <li>Platform fees applied as a percentage of the accepted quote.</li>
                    </ul>
                    <p className="mt-2 font-semibold">JetRunner does not:</p>
                    <ul className="list-disc pl-5">
                        <li>Transport items,</li>
                        <li>Act as an agent for Shippers or Travelers,</li>
                        <li>Guarantee delivery timing or outcomes,</li>
                        <li>Provide insurance unless explicitly stated.</li>
                    </ul>
                </section>

                <section>
                    <h3 className="text-lg font-bold mb-2">3. User Responsibilities</h3>
                    <h4 className="font-semibold mt-2">3.1 Shippers</h4>
                    <p className="mb-2">Shippers must:</p>
                    <ul className="list-disc pl-5">
                        <li>Accurately describe the Shipment contents and value.</li>
                        <li>Ensure items are legal, permitted, and compliant with airline policies.</li>
                        <li>Ensure packaging is secure and safe.</li>
                        <li>Not include prohibited items such as weapons, drugs, hazardous materials, or counterfeit goods.</li>
                        <li>Comply with customs and import regulations of all relevant countries.</li>
                    </ul>

                    <h4 className="font-semibold mt-4">3.2 Travelers</h4>
                    <p className="mb-2">Travelers must:</p>
                    <ul className="list-disc pl-5">
                        <li>Comply with airline baggage rules and customs requirements.</li>
                        <li>Inspect the contents of shipments or request full disclosure.</li>
                        <li>Not transport illegal, restricted, or unsafe items.</li>
                        <li>Deliver the goods directly to the Shipper’s designated recipient.</li>
                        <li>Notify JetRunner and the Shipper immediately of delays or issues.</li>
                    </ul>
                </section>

                <section>
                    <h3 className="text-lg font-bold mb-2">4. Payments & Fees</h3>
                    <p>JetRunner uses a third-party provider (e.g., Stripe) to process all payments.</p>

                    <h4 className="font-semibold mt-2">4.1 For Shippers</h4>
                    <ul className="list-disc pl-5">
                        <li>You must fund the shipment upon confirming a Traveler.</li>
                        <li>The full amount is authorized but may only be captured upon delivery.</li>
                        <li>JetRunner charges a Platform Fee, disclosed at checkout.</li>
                    </ul>

                    <h4 className="font-semibold mt-2">4.2 For Travelers</h4>
                    <ul className="list-disc pl-5">
                        <li>Travelers receive the net amount minus JetRunner’s Platform Fee.</li>
                        <li>Payouts occur via Stripe or other supported mechanisms.</li>
                        <li>Travelers are responsible for any taxes or reporting obligations.</li>
                    </ul>

                    <h4 className="font-semibold mt-2">4.3 Chargebacks & Disputes</h4>
                    <ul className="list-disc pl-5">
                        <li>You agree that JetRunner is not responsible for payment reversals.</li>
                        <li>Chargebacks may result in account suspension.</li>
                        <li>Disputes between Users must be resolved between the parties; JetRunner may mediate but has no obligation to do so.</li>
                    </ul>
                </section>

                <section>
                    <h3 className="text-lg font-bold mb-2">5. User Verification & Security</h3>
                    <p>JetRunner may, at its discretion:</p>
                    <ul className="list-disc pl-5">
                        <li>Require identity verification.</li>
                        <li>Request travel itineraries or boarding passes.</li>
                        <li>Require proof of shipment handover or delivery.</li>
                    </ul>
                    <p className="mt-2">JetRunner is not responsible for verifying the identity of Users but may restrict accounts suspected of fraud.</p>
                </section>

                <section>
                    <h3 className="text-lg font-bold mb-2">6. Prohibited Items</h3>
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
                    <p className="mt-2 text-red-600 font-semibold">JetRunner may suspend or terminate accounts for violations.</p>
                </section>

                <section>
                    <h3 className="text-lg font-bold mb-2">7. JetRunner Is Not a Carrier</h3>
                    <p>JetRunner:</p>
                    <ul className="list-disc pl-5">
                        <li>Does not employ Travelers.</li>
                        <li>Is not responsible for loss, theft, damage, or delays.</li>
                        <li>Does not supervise Users’ activities.</li>
                        <li>Operates only as a marketplace platform.</li>
                    </ul>
                    <p className="mt-2 font-semibold">Travelers and Shippers enter into a separate independent contract between themselves.</p>
                </section>

                <section>
                    <h3 className="text-lg font-bold mb-2">8. Indemnity</h3>
                    <p>You agree to indemnify, defend, and hold harmless JetRunner, its affiliates, employees, and partners from all claims, damages, penalties, fines, losses, liabilities, and expenses arising out of:</p>
                    <ul className="list-disc pl-5">
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
                    <h3 className="text-lg font-bold mb-2">9. Limitation of Liability</h3>
                    <p>To the fullest extent permitted by law:</p>
                    <ul className="list-disc pl-5">
                        <li>JetRunner is not liable for any indirect, incidental, punitive, or consequential damages.</li>
                        <li>JetRunner does not guarantee delivery success or safety.</li>
                        <li>Maximum liability of JetRunner under any claim is the Platform Fee paid for the transaction (or USD 100, whichever is less).</li>
                    </ul>
                    <p className="mt-2">Some jurisdictions do not allow limitation of liability; in those cases, JetRunner’s liability is limited to the maximum extent allowed by law.</p>
                </section>

                <section>
                    <h3 className="text-lg font-bold mb-2">10. No Insurance Provided</h3>
                    <p>Unless explicitly offered, JetRunner does not provide:</p>
                    <ul className="list-disc pl-5">
                        <li>Shipping insurance</li>
                        <li>Liability insurance</li>
                        <li>Traveler or Shipper coverage</li>
                    </ul>
                    <p className="mt-2">Users may procure third-party insurance at their own expense.</p>
                </section>

                <section>
                    <h3 className="text-lg font-bold mb-2">11. Dispute Resolution</h3>
                    <h4 className="font-semibold">11.1 Between Users</h4>
                    <p>Shippers and Travelers must attempt to resolve disputes between themselves. JetRunner may assist but has no obligation to mediate.</p>

                    <h4 className="font-semibold mt-2">11.2 Between User and JetRunner</h4>
                    <p>Disputes shall be resolved through:</p>
                    <ul className="list-disc pl-5">
                        <li>Arbitration (if permitted by applicable law),</li>
                        <li>Or courts of competent jurisdiction in the governing region (see Section 15).</li>
                    </ul>
                </section>

                <section>
                    <h3 className="text-lg font-bold mb-2">12. Termination</h3>
                    <p>JetRunner may suspend or terminate your account immediately if:</p>
                    <ul className="list-disc pl-5">
                        <li>You violate these Terms</li>
                        <li>You engage in fraud or suspicious behavior</li>
                        <li>You misuse the platform</li>
                        <li>You transport prohibited items</li>
                        <li>You endanger other Users or the platform</li>
                    </ul>
                    <p className="mt-2">You may terminate your account at any time.</p>
                </section>

                <section>
                    <h3 className="text-lg font-bold mb-2">13. Intellectual Property</h3>
                    <p>JetRunner owns all trademarks, logos, branding, source code, design elements, software, content, and architecture. You may not copy, reproduce, or adapt JetRunner’s platform without written permission.</p>
                </section>

                <section>
                    <h3 className="text-lg font-bold mb-2">14. Privacy Policy</h3>
                    <p>Your use of JetRunner is subject to our Privacy Policy, which explains how data is collected, used, stored, and shared globally. JetRunner complies with applicable privacy regulations such as GDPR, CCPA, PDPA, and other regional privacy laws.</p>
                </section>

                <section>
                    <h3 className="text-lg font-bold mb-2">15. Governing Law</h3>
                    <p>As JetRunner operates globally, governing law is designated as:</p>
                    <ul className="list-disc pl-5">
                        <li>Singapore law, or</li>
                        <li>your local jurisdiction if required by mandatory regulations.</li>
                    </ul>
                    <p className="mt-2">Arbitration venue (if applicable): Singapore International Arbitration Centre (SIAC).</p>
                </section>

                <section>
                    <h3 className="text-lg font-bold mb-2">16. Modifications</h3>
                    <p>JetRunner may update these Terms from time to time. Continued use after changes constitutes acceptance.</p>
                </section>

                <section>
                    <h3 className="text-lg font-bold mb-2">17. Contact Information</h3>
                    <p>JetRunner Support</p>
                    <p>Email: support@jetrunner.com</p>
                    <p>Website: https://www.jetrunner.com</p>
                </section>
            </div>
        </>
    );

    if (isModal) {
        return content;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
                    {content}
                </div>
            </div>
        </div>
    );
};

export default Terms;
