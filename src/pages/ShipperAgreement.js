import React from 'react';

const ShipperAgreement = () => {
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
                    <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white text-center">Shipper Service Agreement</h1>

                    <p className="mb-4 text-gray-600 dark:text-gray-400 font-italic text-sm text-center">Last Updated: {today}</p>

                    <p className="mb-6 text-gray-700 dark:text-gray-300 font-medium text-center">
                        This agreement applies to all Shippers on JetRunner.
                    </p>

                    <div className="space-y-6 text-gray-700 dark:text-gray-300">
                        <section>
                            <h3 className="text-lg font-bold mb-2">1. Obligations</h3>
                            <p className="mb-2">Shippers must:</p>
                            <ul className="list-disc pl-5">
                                <li>Accurately declare contents and value</li>
                                <li>Provide safe and lawful items</li>
                                <li>Package securely</li>
                                <li>Meet Travelers on time for handover</li>
                                <li>Provide correct recipient details</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="text-lg font-bold mb-2">2. Prohibited Behavior</h3>
                            <p className="mb-2">Shippers must not:</p>
                            <ul className="list-disc pl-5">
                                <li>Ship illegal or dangerous goods</li>
                                <li>Misdeclare contents or value</li>
                                <li>Request Travelers to evade customs</li>
                                <li>Engage in fraud</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="text-lg font-bold mb-2">3. Payment</h3>
                            <p className="mb-2">Shippers agree to:</p>
                            <ul className="list-disc pl-5">
                                <li>Fund accepted quotes</li>
                                <li>Pay JetRunner platform fees</li>
                                <li>Accept Stripe’s payment terms</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="text-lg font-bold mb-2">4. Cancellations</h3>
                            <p>Cancellations after a Traveler accepts may result in fees.</p>
                        </section>

                        <section>
                            <h3 className="text-lg font-bold mb-2">5. Liability</h3>
                            <p className="mb-2">Shippers indemnify JetRunner from losses caused by:</p>
                            <ul className="list-disc pl-5">
                                <li>Misdeclared items</li>
                                <li>Prohibited goods</li>
                                <li>Damage due to insufficient packaging</li>
                            </ul>
                            <p className="mt-2 text-gray-600 dark:text-gray-400 italic">There is no insurance unless explicitly purchased.</p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShipperAgreement;
