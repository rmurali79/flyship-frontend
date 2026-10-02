import React from 'react';

// Frosted-glass feature card with an animated gradient-sweep border on hover.
const GlassCard = ({ icon, badge, badgeColor, badgeBg, title, children }) => (
    <div
        className="pp-glass-card"
        style={{
            background: 'var(--pp-glass-bg)',
            border: '1px solid var(--pp-glass-border)',
            borderRadius: '18px',
            padding: '26px',
            boxShadow: 'var(--pp-glass-shadow)',
            backdropFilter: 'blur(20px) saturate(160%)',
            WebkitBackdropFilter: 'blur(20px) saturate(160%)',
            '--pp-acc': 'oklch(var(--pp-gold))',
            '--pp-acc-glow': 'oklch(var(--pp-gold) / 0.16)',
        }}
    >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: badgeBg, border: '1px solid var(--pp-glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {icon}
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 600, letterSpacing: '0.6px', color: badgeColor, background: badgeBg, border: '1px solid var(--pp-glass-border)', borderRadius: '999px', padding: '4px 10px' }}>
                {badge}
            </div>
        </div>
        <div style={{ fontSize: '15.5px', fontWeight: 700, color: 'oklch(var(--pp-heading))', marginBottom: '8px' }}>{title}</div>
        <div style={{ fontSize: '13.5px', lineHeight: 1.6, color: 'oklch(var(--pp-faint))' }}>{children}</div>
    </div>
);

export default GlassCard;
