import React from 'react';

const TravelerAgreement = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
                    <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white text-center">Traveler (Courier) Agreement</h1>

                    <p className="mb-4 text-gray-600 dark:text-gray-400 font-italic text-sm text-center">Last Updated: 25th Dec 2025</p>

                    <p className="mb-6 text-gray-700 dark:text-gray-300 font-medium text-center">
                        Travelers act as independent contractors, not employees of JetRunner.
                    </p>

                    <div className="space-y-6 text-gray-700 dark:text-gray-300">
                        <section>
                            <h3 className="text-lg font-bold mb-2">1. Duties</h3>
                            <p className="mb-2">Travelers must:</p>
                            <ul className="list-disc pl-5">
                                <li>Comply with all aviation rules</li>
                                <li>Verify shipments received</li>
                                <li>Deliver goods in a timely manner</li>
                                <li>Notify Shippers of delays</li>
                                <li>Avoid transporting prohibited items</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="text-lg font-bold mb-2">2. Compensation</h3>
                            <p className="mb-2">Travelers receive:</p>
                            <ul className="list-disc pl-5">
                                <li>The agreed quote minus JetRunner fees</li>
                                <li>Payouts through Stripe or supported services</li>
                            </ul>
                            <p className="mt-2 text-gray-600 dark:text-gray-400 italic">Travelers are responsible for income reporting.</p>
                        </section>

                        <section>
                            <h3 className="text-lg font-bold mb-2">3. Prohibited Conduct</h3>
                            <p className="mb-2">Travelers must not:</p>
                            <ul className="list-disc pl-5">
                                <li>Carry items they suspect are illegal</li>
                                <li>Tamper with shipments</li>
                                <li>Misrepresent travel plans</li>
                                <li>Demand extra compensation outside the platform</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="text-lg font-bold mb-2">4. Liability</h3>
                            <p className="mb-2">Travelers indemnify JetRunner against:</p>
                            <ul className="list-disc pl-5">
                                <li>Customs penalties</li>
                                <li>Airline baggage violations</li>
                                <li>Legal consequences of illegal items</li>
                            </ul>
                            <p className="mt-2 text-gray-600 dark:text-gray-400 italic">JetRunner does not guarantee any income.</p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TravelerAgreement;
