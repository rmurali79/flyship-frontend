import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Modal from '../components/Modal';
import Terms from './Terms';
import Privacy from './Privacy';
import RiskDisclosure from './RiskDisclosure';
import ShipperAgreement from './ShipperAgreement';
import TravelerAgreement from './TravelerAgreement';
import RefundPolicy from './RefundPolicy';
import PaymentTerms from './PaymentTerms';
import CookiePolicy from './CookiePolicy';

const Home = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [modalTitle, setModalTitle] = useState('');

    const openModal = (title, content) => {
        setModalTitle(title);
        setModalContent(content);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setModalContent(null);
        setModalTitle('');
    };
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <div className="relative bg-peerpost-ink text-peerpost-heading overflow-hidden">
                <div className="absolute inset-0">
                    <img src="/hero_world_travel.png" alt="World Travel" className="w-full h-full object-cover opacity-30" />
                    <div className="absolute inset-0 bg-gradient-to-r from-peerpost-ink via-peerpost-ink/90 to-peerpost-ink/60"></div>
                </div>
                <div className="relative max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
                    <h1 className="font-heading font-medium text-5xl md:text-6xl tracking-tight mb-6">
                        Shipping Made <span className="text-peerpost-gold">Global</span>
                    </h1>
                    <p className="mt-4 max-w-2xl text-xl font-body text-peerpost-body mb-10">
                        Connect with travelers to ship your packages faster, cheaper, and more securely than ever before. Join the peer-to-peer logistics revolution.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link to="/register" className="px-8 py-4 bg-peerpost-gold text-peerpost-goldInk font-body font-bold rounded-full hover:bg-peerpost-goldHover md:py-4 md:text-xl md:px-10 shadow-lg transform transition hover:scale-105 border-0">
                            Get Started
                        </Link>
                        <Link to="/login" className="px-8 py-4 bg-transparent border-2 border-peerpost-borderStrong text-peerpost-heading font-body font-bold rounded-full hover:bg-white/10 md:py-4 md:text-xl md:px-10 shadow-lg transform transition hover:scale-105">
                            Login
                        </Link>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-20 bg-gray-50 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-base text-amber-600 dark:text-peerpost-gold font-body font-semibold tracking-wide uppercase">Why PeerPost?</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                            The Future of Air Logistics
                        </p>
                    </div>

                    <div className="mt-10">
                        <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
                            <div className="relative group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-blue-600"></div>
                                <div className="mt-8 text-center relative z-10">
                                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                                        <span className="text-3xl">✈️</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Fast Delivery</h3>
                                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                                        Leverage the speed of air travel. Your package arrives as soon as the traveler lands.
                                    </p>
                                    <img src="/feature_plane_cargo.png" alt="Fast Delivery" className="rounded-lg w-full h-48 object-cover shadow-md transform group-hover:scale-105 transition-transform duration-500" />
                                </div>
                            </div>

                            <div className="relative group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-green-600"></div>
                                <div className="mt-8 text-center relative z-10">
                                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mb-4">
                                        <span className="text-3xl">💰</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Earn Money</h3>
                                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                                        Travelers can offset their travel costs by carrying packages for others.
                                    </p>
                                    <img src="/feature_traveler_airport.png" alt="Earn Money" className="rounded-lg w-full h-48 object-cover shadow-md transform group-hover:scale-105 transition-transform duration-500" />
                                </div>
                            </div>

                            <div className="relative group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-400 to-purple-600"></div>
                                <div className="mt-8 text-center relative z-10">
                                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 text-purple-600 mb-4">
                                        <span className="text-3xl">🛡️</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Secure Tracking</h3>
                                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                                        Real-time updates and vetted travelers ensure your items are always in safe hands.
                                    </p>
                                    <div className="bg-gradient-to-br from-purple-500 to-indigo-600 h-48 rounded-lg w-full flex items-center justify-center text-white shadow-md">
                                        <span className="text-5xl">🔒</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <section className="py-20 bg-peerpost-ink text-peerpost-heading text-center">
                <div className="container mx-auto px-4">
                    <h2 className="font-heading font-medium text-3xl md:text-4xl mb-6">Ready to ship smarter?</h2>
                    <p className="text-xl mb-8 font-body text-peerpost-body">Join thousands of users changing the way the world ships.</p>
                    <Link to="/register" className="px-10 py-4 bg-peerpost-gold text-peerpost-goldInk font-body font-bold rounded-full hover:bg-peerpost-goldHover transition shadow-lg text-lg">
                        Join Now
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-peerpost-ink border-t border-peerpost-border text-peerpost-muted py-8 text-center font-body">
                <p className="mb-2">&copy; {new Date().getFullYear()} PeerPost. All rights reserved.</p>
                <div className="space-x-4 flex justify-center flex-wrap gap-y-2">
                    <button onClick={() => openModal('Terms of Service', <Terms isModal />)} className="hover:text-white transition cursor-pointer bg-transparent border-0 underline text-gray-400">Terms of Service</button>
                    <span className="text-gray-600 hidden sm:inline">|</span>
                    <button onClick={() => openModal('Privacy Policy', <Privacy isModal />)} className="hover:text-white transition cursor-pointer bg-transparent border-0 underline text-gray-400">Privacy Policy</button>
                    <span className="text-gray-600 hidden sm:inline">|</span>
                    <button onClick={() => openModal('Risk Disclosure', <RiskDisclosure isModal />)} className="hover:text-white transition cursor-pointer bg-transparent border-0 underline text-gray-400">Risk Disclosure</button>
                    <span className="text-gray-600 hidden sm:inline">|</span>
                    <button onClick={() => openModal('Shipper Agreement', <ShipperAgreement isModal />)} className="hover:text-white transition cursor-pointer bg-transparent border-0 underline text-gray-400">Shipper Agreement</button>
                    <span className="text-gray-600 hidden sm:inline">|</span>
                    <button onClick={() => openModal('Traveler Agreement', <TravelerAgreement isModal />)} className="hover:text-white transition cursor-pointer bg-transparent border-0 underline text-gray-400">Traveler Agreement</button>
                    <span className="text-gray-600 hidden sm:inline">|</span>
                    <button onClick={() => openModal('Refund Policy', <RefundPolicy isModal />)} className="hover:text-white transition cursor-pointer bg-transparent border-0 underline text-gray-400">Refund Policy</button>
                    <span className="text-gray-600 hidden sm:inline">|</span>
                    <button onClick={() => openModal('Payment Terms', <PaymentTerms isModal />)} className="hover:text-white transition cursor-pointer bg-transparent border-0 underline text-gray-400">Payment Terms</button>
                    <span className="text-gray-600 hidden sm:inline">|</span>
                    <button onClick={() => openModal('Cookie Policy', <CookiePolicy isModal />)} className="hover:text-white transition cursor-pointer bg-transparent border-0 underline text-gray-400">Cookie Policy</button>
                </div>
            </footer>

            <Modal isOpen={modalOpen} onClose={closeModal} title={modalTitle}>
                {modalContent}
            </Modal>
        </div>
    );
};

export default Home;
