import React from 'react';

const RefundPolicy = () => {
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
                    <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white text-center">Refund & Cancellation Policy</h1>

                    <p className="mb-4 text-gray-600 dark:text-gray-400 font-italic text-sm text-center">Last Updated: {today}</p>

                    <div className="space-y-6 text-gray-700 dark:text-gray-300">
                        <section>
                            <h3 className="text-lg font-bold mb-2">1. Shipper-Initiated Cancellations</h3>
                            <ul className="list-disc pl-5">
                                <li>Before Traveler acceptance → Full refund</li>
                                <li>After Traveler acceptance → Platform fee non-refundable</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="text-lg font-bold mb-2">2. Traveler-Initiated Cancellations</h3>
                            <p className="mb-2">If a Traveler cancels:</p>
                            <ul className="list-disc pl-5">
                                <li>The Shipper receives a full refund</li>
                                <li>JetRunner may penalize or suspend the Traveler</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="text-lg font-bold mb-2">3. Delivery Failure</h3>
                            <p className="mb-2">Refund outcomes depend on:</p>
                            <ul className="list-disc pl-5">
                                <li>Circumstances</li>
                                <li>Proof of compliance</li>
                                <li>Evidence submitted</li>
                            </ul>
                            <p className="mt-2 text-gray-600 dark:text-gray-400 italic">JetRunner may mediate but does not guarantee refunds.</p>
                        </section>

                        <section>
                            <h3 className="text-lg font-bold mb-2">4. Chargebacks</h3>
                            <p className="mb-2">Unauthorized chargebacks may:</p>
                            <ul className="list-disc pl-5">
                                <li>Suspend the user</li>
                                <li>Trigger indemnity obligations</li>
                            </ul>
                        </section>

                        <section>
                            <p className="font-medium text-center mt-8">All refunds are processed via Stripe and follow Stripe’s timelines.</p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RefundPolicy;
