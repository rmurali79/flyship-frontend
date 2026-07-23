import React from 'react';

const Privacy = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
                    <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white text-center">JetRunner Privacy Policy</h1>

                    <p className="mb-4 text-gray-600 dark:text-gray-400 font-italic text-sm text-center">Last Updated: 25th Dec 2025</p>

                    <div className="space-y-6 text-gray-700 dark:text-gray-300">
                        <section>
                            <p className="mb-4">
                                This Privacy Policy describes how JetRunner (“JetRunner”, “we”, “us”, “our”) collects, uses, discloses, and protects your personal information when you access or use our platform, mobile application, website, and services (collectively, the “Services”).
                            </p>
                            <p className="font-bold">By using JetRunner, you agree to the practices described in this Privacy Policy.</p>
                        </section>

                        <section>
                            <h3 className="text-lg font-bold mb-2">1. Information We Collect</h3>
                            <h4 className="font-semibold mt-2">1.1 Information You Provide</h4>
                            <ul className="list-disc pl-5">
                                <li>Full name</li>
                                <li>Email address</li>
                                <li>Phone number</li>
                                <li>Date of birth</li>
                                <li>Identity documents (passport, national ID, etc.)</li>
                                <li>Travel itinerary (for Travelers)</li>
                                <li>Shipment details (for Shippers)</li>
                                <li>Payment information (processed by Stripe; we do not store credit card numbers)</li>
                                <li>Communication messages between Users</li>
                            </ul>

                            <h4 className="font-semibold mt-2">1.2 Automatically Collected Information</h4>
                            <ul className="list-disc pl-5">
                                <li>IP address</li>
                                <li>Device identifiers</li>
                                <li>Browser type</li>
                                <li>Geolocation (when permitted)</li>
                                <li>Usage analytics</li>
                                <li>Log files</li>
                            </ul>

                            <h4 className="font-semibold mt-2">1.3 Data from Third Parties</h4>
                            <ul className="list-disc pl-5">
                                <li>Stripe payment metadata</li>
                                <li>Identity verification vendors</li>
                                <li>Airline API data (if integrated)</li>
                                <li>Fraud-prevention sources</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="text-lg font-bold mb-2">2. How We Use Your Information</h3>
                            <p className="mb-2">We use your data to:</p>
                            <ul className="list-disc pl-5">
                                <li>Operate and improve the JetRunner platform</li>
                                <li>Facilitate matching between Shippers and Travelers</li>
                                <li>Process payments through Stripe</li>
                                <li>Enable identity verification and fraud prevention</li>
                                <li>Provide customer support</li>
                                <li>Notify you about service updates</li>
                                <li>Comply with legal obligations</li>
                                <li>Enforce our Terms of Service</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="text-lg font-bold mb-2">3. Legal Basis for Processing (GDPR)</h3>
                            <p className="mb-2">We process personal data under:</p>
                            <ul className="list-disc pl-5">
                                <li><strong>Contract performance</strong> – to provide the JetRunner service</li>
                                <li><strong>Legitimate interest</strong> – fraud prevention and service improvement</li>
                                <li><strong>Consent</strong> – marketing, location data</li>
                                <li><strong>Legal obligation</strong> – compliance with regulations</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="text-lg font-bold mb-2">4. How We Share Information</h3>
                            <p className="mb-2">We may share information with:</p>
                            <ul className="list-disc pl-5">
                                <li>Travelers and Shippers, as needed for delivery</li>
                                <li>Stripe, for payment processing</li>
                                <li>Identity verification providers</li>
                                <li>Airline or airport authorities, if required legally</li>
                                <li>Law enforcement or regulatory agencies</li>
                                <li>Cloud service providers (AWS, GCP, or others)</li>
                            </ul>
                            <p className="mt-2 text-gray-600 dark:text-gray-400 italic">We do not sell personal information.</p>
                        </section>

                        <section>
                            <h3 className="text-lg font-bold mb-2">5. International Data Transfers</h3>
                            <p className="mb-2">Your data may be stored or processed in:</p>
                            <ul className="list-disc pl-5 mb-2">
                                <li>Singapore</li>
                                <li>United States</li>
                                <li>European Union</li>
                                <li>Any region where JetRunner operates</li>
                            </ul>
                            <p>All transfers comply with GDPR mechanisms such as Standard Contractual Clauses (SCC).</p>
                        </section>

                        <section>
                            <h3 className="text-lg font-bold mb-2">6. Data Retention</h3>
                            <p className="mb-2">We retain data:</p>
                            <ul className="list-disc pl-5">
                                <li>As long as your account is active</li>
                                <li>Longer if required by law (e.g., anti-fraud, tax rules)</li>
                                <li>Up to 7 years for regulatory obligations</li>
                            </ul>
                            <p className="mt-2">You may request deletion anytime.</p>
                        </section>

                        <section>
                            <h3 className="text-lg font-bold mb-2">7. Your Rights</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-semibold">GDPR Rights:</h4>
                                    <ul className="list-disc pl-5">
                                        <li>Access</li>
                                        <li>Rectification</li>
                                        <li>Erasure</li>
                                        <li>Data portability</li>
                                        <li>Restriction of processing</li>
                                        <li>Objection</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold">CCPA Rights (California):</h4>
                                    <ul className="list-disc pl-5">
                                        <li>Right to know</li>
                                        <li>Right to delete</li>
                                        <li>Right to opt-out of sale</li>
                                        <li>Right to non-discrimination</li>
                                    </ul>
                                </div>
                            </div>
                            <p className="mt-4 font-semibold">To exercise rights: email <a href="mailto:privacy@jetrunner.com" className="text-blue-600 hover:underline">privacy@jetrunner.com</a></p>
                        </section>

                        <section>
                            <h3 className="text-lg font-bold mb-2">8. Cookies</h3>
                            <p>JetRunner uses cookies for:</p>
                            <ul className="list-disc pl-5">
                                <li>Authentication</li>
                                <li>Analytics</li>
                                <li>Preferences</li>
                                <li>Security</li>
                            </ul>
                            <p className="mt-2">See the Cookie Policy for more details.</p>
                        </section>

                        <section>
                            <h3 className="text-lg font-bold mb-2">9. Security</h3>
                            <p className="mb-2">We implement:</p>
                            <ul className="list-disc pl-5">
                                <li>Encryption in transit and at rest</li>
                                <li>Access controls</li>
                                <li>Monitoring and intrusion detection</li>
                                <li>Regular security audits</li>
                            </ul>
                            <p className="mt-2 text-gray-600 dark:text-gray-400 italic">However, no system is 100% secure.</p>
                        </section>

                        <section>
                            <h3 className="text-lg font-bold mb-2">10. Children’s Privacy</h3>
                            <p>JetRunner is not intended for users under age 18.</p>
                        </section>

                        <section>
                            <h3 className="text-lg font-bold mb-2">11. Changes to This Policy</h3>
                            <p>We may update this Privacy Policy periodically.</p>
                        </section>

                        <section>
                            <h3 className="text-lg font-bold mb-2">12. Contact</h3>
                            <p>Email: <a href="mailto:privacy@jetrunner.com" className="text-blue-600 hover:underline">privacy@jetrunner.com</a></p>
                            <p>Website: <a href="https://www.jetrunner.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://www.jetrunner.com</a></p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
