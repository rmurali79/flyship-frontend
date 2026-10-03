import React from 'react';
import LegalPage from '../components/LegalPage';

const CookiePolicy = ({ isModal }) => {
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <LegalPage title="Cookie Policy" updated={today} isModal={isModal}>
            <section>
                <p className="mb-4 font-medium text-center">
                    PeerPost uses cookies for:
                </p>
                <ul>
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
        </LegalPage>
    );
};

export default CookiePolicy;
