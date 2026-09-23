import React from 'react';

// Route-network overlay: pulsing hub cities connected by glowing flow lines.
// Colors fixed to the dark PeerPost palette (no light-mode variant).
const HUBS = [
    { cx: 215, cy: 195 }, { cx: 665, cy: 140 }, { cx: 760, cy: 260 },
    { cx: 960, cy: 320 }, { cx: 1090, cy: 195 }, { cx: 1195, cy: 440 },
];

const LINES = [
    "M215 195 Q440 97, 665 140",
    "M665 140 Q712.5 165, 760 260",
    "M760 260 Q860 255, 960 320",
    "M960 320 Q1025 227, 1090 195",
    "M1090 195 Q652.5 65, 215 195",
    "M1195 440 Q1077.5 355, 960 320",
    "M215 195 Q600 120, 960 320",
    "M665 140 Q877.5 90, 1090 195",
    "M760 260 Q1000 300, 1195 440",
    "M215 195 Q700 480, 1195 440",
];

const NetworkBackground = () => (
    <svg width="1440" height="640" viewBox="0 0 1440 640">
        <defs>
            <filter id="pp-lineGlow" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="2.4" result="blur" />
                <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
            <filter id="pp-hubGlow" x="-200%" y="-200%" width="500%" height="500%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="9" />
            </filter>
        </defs>
        <g fill="none" stroke="oklch(0.80 0.16 65 / 0.18)" strokeWidth="1.1" strokeLinecap="round">
            {LINES.map((d, i) => <path key={i} d={d} />)}
        </g>
        <g fill="none" stroke="oklch(0.85 0.18 62 / 0.65)" strokeWidth="2" strokeLinecap="round">
            {LINES.map((d, i) => <path key={i} pathLength="1" className="pp-network-flow-path" d={d} />)}
        </g>
        <g fill="oklch(0.78 0.19 55 / 0.25)">
            {HUBS.map((h, i) => <circle key={i} className="pp-hub-glow" cx={h.cx} cy={h.cy} r="16" />)}
        </g>
        <g fill="oklch(0.80 0.16 65 / 0.45)">
            {HUBS.map((h, i) => <circle key={i} className="pp-network-hub" cx={h.cx} cy={h.cy} r="3.2" />)}
        </g>
    </svg>
);

export default NetworkBackground;
