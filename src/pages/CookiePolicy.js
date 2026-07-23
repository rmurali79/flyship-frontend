import React from 'react';

const CookiePolicy = () => {
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
                    <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white text-center">Cookie Policy</h1>

                    <p className="mb-4 text-gray-600 dark:text-gray-400 font-italic text-sm text-center">Last Updated: {today}</p>

                    <div className="space-y-6 text-gray-700 dark:text-gray-300">
                        <section>
                            <p className="mb-4 font-medium text-center">
                                JetRunner uses cookies for:
                            </p>
                            <ul className="list-disc pl-5">
                                <li>Authentication (session cookies)</li>
                                <li>Analytics (e.g., Google Analytics)</li>
                                <li>Security</li>
                                <li>User preferences (theme mode)</li>
                            </ul>
                        </section>

                        <section>
                            <p className="font-medium text-center mt-8">
                                You may disable cookies, but functionality may be affected.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CookiePolicy;
