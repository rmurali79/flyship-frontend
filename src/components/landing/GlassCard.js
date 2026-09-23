import React from 'react';

// Frosted-glass feature card with an animated gradient-sweep border on hover.
const GlassCard = ({ icon, badge, badgeColor, badgeBg, title, children }) => (
    <div
        className="pp-glass-card"
        style={{
            background: 'oklch(1 0 0 / 0.055)',
            border: '1px solid oklch(1 0 0 / 0.16)',
            borderRadius: '18px',
            padding: '26px',
            boxShadow: '0 8px 32px oklch(0 0 0 / 0.35)',
            backdropFilter: 'blur(20px) saturate(160%)',
            WebkitBackdropFilter: 'blur(20px) saturate(160%)',
            '--pp-acc': 'oklch(0.80 0.15 85)',
            '--pp-acc-glow': 'oklch(0.80 0.15 85 / 0.16)',
        }}
    >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: badgeBg, border: '1px solid oklch(1 0 0 / 0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {icon}
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 600, letterSpacing: '0.6px', color: badgeColor, background: badgeBg, border: '1px solid oklch(1 0 0 / 0.16)', borderRadius: '999px', padding: '4px 10px' }}>
                {badge}
            </div>
        </div>
        <div style={{ fontSize: '15.5px', fontWeight: 700, color: 'oklch(0.97 0.01 95)', marginBottom: '8px' }}>{title}</div>
        <div style={{ fontSize: '13.5px', lineHeight: 1.6, color: 'oklch(0.58 0.02 255)' }}>{children}</div>
    </div>
);

export default GlassCard;
