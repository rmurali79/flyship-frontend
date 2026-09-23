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

import '../styles/landing.css';
import worldMapDots from '../assets/world-map-dots.svg';
import FlapTicker from '../components/landing/FlapTicker';
import NetworkBackground from '../components/landing/NetworkBackground';
import GlassCard from '../components/landing/GlassCard';
import useReveal from '../components/landing/useReveal';
import useParallax from '../components/landing/useParallax';

const IconArrow = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="oklch(0.80 0.15 85)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 3 3 10.5l7.5 3L13.5 21 21 3Z" /><path d="M10.5 13.5 21 3" /></svg>
);
const IconReceipt = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="oklch(0.78 0.16 145)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M3 10h18" /><circle cx="16" cy="14" r="1.1" fill="oklch(0.78 0.16 145)" stroke="none" /></svg>
);
const IconShieldCheck = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="oklch(0.75 0.14 250)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" /><path d="M9 12l2 2 4-4" /></svg>
);
const IconId = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="oklch(0.75 0.14 250)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="8" r="3.2" /><path d="M3.5 20c0-3.6 2.9-6 5.5-6s5.5 2.4 5.5 6" /><path d="M16 12l2 2 3.5-3.5" /></svg>
);
const IconEscrow = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="oklch(0.78 0.16 145)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V7.5a4 4 0 0 1 8 0V11" /></svg>
);
const IconStar = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="oklch(0.80 0.15 85)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.8 6.8 19.6l1-5.8L3.5 9.7l5.9-.9L12 3.5Z" /></svg>
);
const IconVerified = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="oklch(0.80 0.15 170)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="9" /></svg>
);
const IconLock = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="oklch(0.80 0.15 170)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="10" width="16" height="9" rx="2" /><path d="M7.5 10V7a4.5 4.5 0 0 1 9 0v3" /></svg>
);
const IconClock = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="oklch(0.80 0.15 170)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></svg>
);

const SectionEyebrow = ({ color, children }) => (
    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11.5px', fontWeight: 600, letterSpacing: '1.4px', color, marginBottom: '14px' }}>{children}</div>
);

const StepRow = ({ n, accent, title, children }) => (
    <div style={{ display: 'flex', gap: '16px' }}>
        <div style={{ flex: 'none', width: '30px', height: '30px', borderRadius: '7px', background: 'oklch(0.17 0.03 255)', border: '1px solid oklch(1 0 0 / 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', color: accent }}>{n}</div>
        <div>
            <div style={{ fontSize: '14.5px', fontWeight: 700, color: 'oklch(0.97 0.01 95)', marginBottom: '3px' }}>{title}</div>
            <div style={{ fontSize: '13px', lineHeight: 1.55, color: 'oklch(0.58 0.02 255)' }}>{children}</div>
        </div>
    </div>
);

const Home = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [modalTitle, setModalTitle] = useState('');

    const { mapRef, networkRef, handleMouseMove, handleMouseLeave } = useParallax();
    const whyRef = useReveal();
    const whyCardsRef = useReveal();
    const howRef = useReveal();
    const howCardsRef = useReveal();
    const trustRef = useReveal();
    const trustCardsRef = useReveal();

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
        <div className="flex flex-col min-h-screen bg-peerpost-ink font-body">
            {/* Hero */}
            <div style={{ position: 'relative', overflow: 'hidden' }} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
                <div ref={mapRef} className="pp-bg-map-layer">
                    <img src={worldMapDots} alt="" />
                </div>
                <div ref={networkRef} className="pp-bg-network-layer">
                    <NetworkBackground />
                </div>

                <div className="relative flex flex-col items-center text-center gap-6 px-8 py-20 max-w-3xl mx-auto">
                    <FlapTicker />

                    <h1 className="pp-entrance-2 font-display font-semibold text-4xl md:text-[46px] leading-tight text-peerpost-heading m-0">
                        <div className="pp-entrance-2">Ship anywhere.</div>
                        <div className="pp-entrance-3">Carried by someone</div>
                        <div className="pp-entrance-4">already headed there.</div>
                    </h1>

                    <p className="pp-entrance-sub text-base leading-relaxed text-peerpost-muted max-w-md m-0">
                        PeerPost matches your package with a verified traveler already on your route.
                    </p>

                    <div className="pp-entrance-cta flex gap-3 mt-1">
                        <Link to="/register" className="peerpost-btn peerpost-btn-primary text-sm font-semibold text-peerpost-goldInk bg-peerpost-gold px-6 py-3 rounded-lg">Ship a package</Link>
                        <Link to="/register" className="peerpost-btn peerpost-btn-ghost text-sm font-semibold text-peerpost-heading bg-transparent border border-peerpost-borderStrong px-6 py-3 rounded-lg">Earn as a traveler</Link>
                    </div>

                    <div className="flex gap-7 mt-1 flex-wrap justify-center">
                        <div className="pp-entrance-chip-1 flex items-center gap-1.5 font-mono text-[11.5px] text-peerpost-muted"><IconVerified /> VERIFIED</div>
                        <div className="pp-entrance-chip-2 flex items-center gap-1.5 font-mono text-[11.5px] text-peerpost-muted"><IconLock /> SECURE PAYMENT</div>
                        <div className="pp-entrance-chip-3 flex items-center gap-1.5 font-mono text-[11.5px] text-peerpost-muted"><IconClock /> LIVE TRACKING</div>
                    </div>
                </div>
            </div>

            {/* Why PeerPost */}
            <div className="relative overflow-hidden px-8 py-24 max-w-6xl mx-auto w-full">
                <div ref={whyRef} className="pp-reveal-group relative z-10 text-center max-w-xl mx-auto mb-12">
                    <SectionEyebrow color="oklch(0.80 0.15 85)">WHY PEERPOST</SectionEyebrow>
                    <h2 className="font-display font-semibold text-3xl text-peerpost-heading m-0 leading-snug">The future of air logistics is already flying</h2>
                </div>
                <div ref={whyCardsRef} className="pp-reveal-cards relative z-10 grid md:grid-cols-3 gap-6">
                    <GlassCard icon={<IconArrow />} badge="FAST" badgeColor="oklch(0.80 0.15 85)" badgeBg="oklch(0.80 0.15 85 / 0.16)" title="Faster than freight">
                        Your package moves at the speed of a traveler's flight, not a cargo hold's schedule. It arrives the day they land.
                    </GlassCard>
                    <GlassCard icon={<IconReceipt />} badge="SAVE" badgeColor="oklch(0.78 0.16 145)" badgeBg="oklch(0.78 0.16 145 / 0.16)" title="Priced for real people">
                        Shippers pay less than traditional couriers. Travelers offset the cost of a trip they were already taking.
                    </GlassCard>
                    <GlassCard icon={<IconShieldCheck />} badge="SECURE" badgeColor="oklch(0.75 0.14 250)" badgeBg="oklch(0.75 0.14 250 / 0.18)" title="Built on verification">
                        Every traveler is identity-verified and rated. Every shipment is tracked door to door.
                    </GlassCard>
                </div>
            </div>

            {/* How it works */}
            <div className="bg-peerpost-surface px-8 py-24">
                <div ref={howRef} className="pp-reveal-group text-center max-w-xl mx-auto mb-14">
                    <SectionEyebrow color="oklch(0.80 0.15 85)">HOW IT WORKS</SectionEyebrow>
                    <h2 className="font-display font-semibold text-3xl text-peerpost-heading m-0 leading-snug">One network, two ways to win</h2>
                </div>
                <div ref={howCardsRef} className="pp-reveal-cards grid md:grid-cols-2 gap-16 max-w-6xl mx-auto">
                    <div>
                        <div className="font-mono text-[11.5px] font-semibold tracking-wide text-peerpost-muted mb-[22px]">FOR SHIPPERS</div>
                        <div className="flex flex-col gap-[22px]">
                            <StepRow n={1} accent="oklch(0.80 0.15 85)" title="Post your package">Tell us what you're sending and where it needs to go.</StepRow>
                            <StepRow n={2} accent="oklch(0.80 0.15 85)" title="Match with a traveler">Browse verified travelers already flying your route.</StepRow>
                            <StepRow n={3} accent="oklch(0.80 0.15 85)" title="Track to delivery">Follow your package in real time until it's handed over.</StepRow>
                        </div>
                    </div>
                    <div>
                        <div className="font-mono text-[11.5px] font-semibold tracking-wide text-peerpost-muted mb-[22px]">FOR TRAVELERS</div>
                        <div className="flex flex-col gap-[22px]">
                            <StepRow n={1} accent="oklch(0.80 0.15 170)" title="Share your itinerary">Add your upcoming flights and available space.</StepRow>
                            <StepRow n={2} accent="oklch(0.80 0.15 170)" title="Accept a shipment">Choose packages that fit your route and schedule.</StepRow>
                            <StepRow n={3} accent="oklch(0.80 0.15 170)" title="Get paid">Funds are released the moment delivery is confirmed.</StepRow>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trust & Safety */}
            <div className="relative overflow-hidden px-8 py-24 max-w-6xl mx-auto w-full">
                <div ref={trustRef} className="pp-reveal-group relative z-10 text-center max-w-xl mx-auto mb-12">
                    <SectionEyebrow color="oklch(0.80 0.15 170)">TRUST &amp; SAFETY</SectionEyebrow>
                    <h2 className="font-display font-semibold text-3xl text-peerpost-heading m-0 mb-3 leading-snug">Trust, built into every handoff</h2>
                    <p className="text-[13.5px] leading-relaxed text-peerpost-muted m-0">Handing a package to a stranger only works when the platform has done the hard part first.</p>
                </div>
                <div ref={trustCardsRef} className="pp-reveal-cards relative z-10 grid md:grid-cols-3 gap-6">
                    <GlassCard icon={<IconId />} badge="ID" badgeColor="oklch(0.75 0.14 250)" badgeBg="oklch(0.75 0.14 250 / 0.18)" title="Identity verification">
                        Government ID and a selfie check are required before any traveler can accept a shipment.
                    </GlassCard>
                    <GlassCard icon={<IconEscrow />} badge="ESCROW" badgeColor="oklch(0.78 0.16 145)" badgeBg="oklch(0.78 0.16 145 / 0.16)" title="Escrow-style payments">
                        Funds are held securely and only released to the traveler once delivery is confirmed.
                    </GlassCard>
                    <GlassCard icon={<IconStar />} badge="RATED" badgeColor="oklch(0.80 0.15 85)" badgeBg="oklch(0.80 0.15 85 / 0.16)" title="Ratings on both sides">
                        Shippers and travelers rate each other after every delivery, building a track record you can trust.
                    </GlassCard>
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-auto border-t border-peerpost-border px-8 py-6 flex items-center justify-between flex-wrap gap-3.5">
                <span className="font-mono text-[11px] text-peerpost-muted">&copy; {new Date().getFullYear()} PeerPost</span>
                <div className="flex flex-wrap gap-4">
                    <button onClick={() => openModal('Terms of Service', <Terms isModal />)} className="font-mono text-[11px] text-peerpost-muted hover:text-peerpost-body transition cursor-pointer bg-transparent border-0">Terms of Service</button>
                    <button onClick={() => openModal('Privacy Policy', <Privacy isModal />)} className="font-mono text-[11px] text-peerpost-muted hover:text-peerpost-body transition cursor-pointer bg-transparent border-0">Privacy Policy</button>
                    <button onClick={() => openModal('Risk Disclosure', <RiskDisclosure isModal />)} className="font-mono text-[11px] text-peerpost-muted hover:text-peerpost-body transition cursor-pointer bg-transparent border-0">Risk Disclosure</button>
                    <button onClick={() => openModal('Shipper Agreement', <ShipperAgreement isModal />)} className="font-mono text-[11px] text-peerpost-muted hover:text-peerpost-body transition cursor-pointer bg-transparent border-0">Shipper Agreement</button>
                    <button onClick={() => openModal('Traveler Agreement', <TravelerAgreement isModal />)} className="font-mono text-[11px] text-peerpost-muted hover:text-peerpost-body transition cursor-pointer bg-transparent border-0">Traveler Agreement</button>
                    <button onClick={() => openModal('Refund Policy', <RefundPolicy isModal />)} className="font-mono text-[11px] text-peerpost-muted hover:text-peerpost-body transition cursor-pointer bg-transparent border-0">Refund Policy</button>
                    <button onClick={() => openModal('Payment Terms', <PaymentTerms isModal />)} className="font-mono text-[11px] text-peerpost-muted hover:text-peerpost-body transition cursor-pointer bg-transparent border-0">Payment Terms</button>
                    <button onClick={() => openModal('Cookie Policy', <CookiePolicy isModal />)} className="font-mono text-[11px] text-peerpost-muted hover:text-peerpost-body transition cursor-pointer bg-transparent border-0">Cookie Policy</button>
                </div>
            </footer>

            <Modal isOpen={modalOpen} onClose={closeModal} title={modalTitle}>
                {modalContent}
            </Modal>
        </div>
    );
};

export default Home;
