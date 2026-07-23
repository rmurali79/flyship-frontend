import React from 'react';

const RiskDisclosure = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
                    <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white text-center">JetRunner Risk Disclosure & Liability Waiver</h1>

                    <p className="mb-4 text-gray-600 dark:text-gray-400 font-italic text-sm text-center">Last Updated: 25th Dec 2025</p>

                    <p className="mb-6 text-gray-700 dark:text-gray-300 font-bold text-center">
                        By registering and using JetRunner, you acknowledge and agree to the following risks:
                    </p>

                    <div className="space-y-6 text-gray-700 dark:text-gray-300">
                        <section>
                            <h3 className="text-lg font-bold mb-2">1. Nature of Service</h3>
                            <p className="mb-2">JetRunner is a peer-to-peer logistics marketplace. JetRunner:</p>
                            <ul className="list-disc pl-5">
                                <li>Does not deliver items</li>
                                <li>Does not employ Travelers</li>
                                <li>Does not supervise shipments</li>
                                <li>Is not responsible for delays, damage, or loss</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="text-lg font-bold mb-2">2. Risks You Accept</h3>
                            <h4 className="font-semibold mt-2">As a Shipper, you acknowledge risks including:</h4>
                            <ul className="list-disc pl-5 mb-2">
                                <li>Damage, theft, or loss of goods</li>
                                <li>Wrongful handling by Travelers</li>
                                <li>Customs seizure or inspection</li>
                                <li>Delays due to flight cancellations or baggage issues</li>
                                <li>Travelers failing to complete delivery</li>
                            </ul>

                            <h4 className="font-semibold mt-2">As a Traveler, you acknowledge risks including:</h4>
                            <ul className="list-disc pl-5">
                                <li>Carrying misdeclared or prohibited items</li>
                                <li>Airport or airline penalties for baggage violations</li>
                                <li>Customs checks and potential liability</li>
                                <li>Delays or disruptions caused by Shippers</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="text-lg font-bold mb-2">3. Waiver of Claims Against JetRunner</h3>
                            <p className="mb-2">You expressly waive any claims against JetRunner for:</p>
                            <ul className="list-disc pl-5">
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
                            <h3 className="text-lg font-bold mb-2">4. Duty to Comply</h3>
                            <p className="mb-2">Users must comply with all:</p>
                            <ul className="list-disc pl-5">
                                <li>Airline baggage rules</li>
                                <li>Customs requirements</li>
                                <li>Aviation security laws</li>
                                <li>Export/import regulations</li>
                            </ul>
                            <p className="mt-2">JetRunner assumes no liability for violations.</p>
                        </section>

                        <section>
                            <p className="font-bold text-center mt-8 text-lg">You agree to use JetRunner at your own risk.</p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RiskDisclosure;
