import React from 'react';

const PaymentTerms = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
                    <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white text-center">Payment Terms</h1>

                    <p className="mb-4 text-gray-600 dark:text-gray-400 font-italic text-sm text-center">Last Updated: 25th Dec 2025</p>

                    <div className="space-y-6 text-gray-700 dark:text-gray-300">
                        <section>
                            <p className="mb-4 font-medium text-center">
                                By using JetRunner, you agree to Stripe’s:
                            </p>
                            <ul className="list-disc pl-5">
                                <li>Terms of Service</li>
                                <li>Privacy Policy</li>
                                <li>Global payment rules</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="text-lg font-bold mb-2">JetRunner never stores:</h3>
                            <ul className="list-disc pl-5">
                                <li>Credit card numbers</li>
                                <li>Bank account details</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="text-lg font-bold mb-2">Fees</h3>
                            <ul className="list-disc pl-5">
                                <li>JetRunner collects a service fee for each shipment.</li>
                                <li>Fees are deducted automatically.</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="text-lg font-bold mb-2">Payouts</h3>
                            <ul className="list-disc pl-5">
                                <li>Travelers must onboard to Stripe Connect.</li>
                                <li>Payout timing depends on Stripe and country regulations.</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="text-lg font-bold mb-2">Tax Responsibility</h3>
                            <p className="mb-2">Users acknowledge:</p>
                            <ul className="list-disc pl-5">
                                <li>JetRunner does not calculate or remit taxes on their behalf.</li>
                                <li>Users must follow local tax requirements.</li>
                            </ul>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentTerms;
