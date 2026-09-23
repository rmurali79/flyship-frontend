import React, { useEffect, useState } from 'react';

// Airport split-flap departure-board ticker: cycles through a handful of
// example routes, plus a static "PEER-TO-PEER" tag spelled out on mount.
const ROUTES = [
    ["SFO", "NRT"], ["LHR", "DXB"], ["SIN", "SYD"],
    ["JFK", "CDG"], ["GRU", "LAX"], ["HKG", "AMS"],
];

const PEER_LETTERS = ["P", "E", "E", "R", "-", "T", "O", "-", "P", "E", "E", "R"];

const valueAt = (m, group, idx) => {
    if (m <= 0) return "";
    const route = ROUTES[(m - 1) % ROUTES.length];
    return route[group][idx];
};

const buildGroup = (n, group) => {
    const items = [];
    for (let idx = 0; idx < 3; idx++) {
        const faceA = n % 2 === 0 ? valueAt(n, group, idx) : valueAt(n + 1, group, idx);
        const faceB = n % 2 === 1 ? valueAt(n, group, idx) : valueAt(n + 1, group, idx);
        items.push({
            faceA,
            faceB,
            rotation: (180 * n) + "deg",
            delay: ((group * 3 + idx) * 45) + "ms",
            isGap: idx === 2,
        });
    }
    return items;
};

const FlapTicker = () => {
    const [flipN, setFlipN] = useState(0);

    useEffect(() => {
        let reduceMotion = false;
        try {
            reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        } catch (err) { /* noop */ }
        if (reduceMotion) {
            setFlipN(1);
            return;
        }
        const timeout = setTimeout(() => {
            setFlipN((n) => n + 1);
        }, 550);
        let interval;
        const intervalTimeout = setTimeout(() => {
            interval = setInterval(() => setFlipN((n) => n + 1), 2800);
        }, 550);
        return () => {
            clearTimeout(timeout);
            clearTimeout(intervalTimeout);
            if (interval) clearInterval(interval);
        };
    }, []);

    const group0 = buildGroup(flipN, 0);
    const group1 = buildGroup(flipN, 1);

    return (
        <div className="pp-entrance-1" style={{ display: 'inline-flex', alignItems: 'center', padding: '6px 13px', border: '1px solid oklch(1 0 0 / 0.12)', borderRadius: '100px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
                {group0.map((item, i) => (
                    <div key={`g0-${i}`} className={"pp-flap-tile" + (item.isGap ? " pp-flap-gap" : "")}>
                        <div className="pp-flap-tile-inner-dyn" style={{ transform: `rotateX(${item.rotation})`, transitionDelay: item.delay }}>
                            <div className="pp-flap-face pp-flap-front">{item.faceA}</div>
                            <div className="pp-flap-face pp-flap-back">{item.faceB}</div>
                        </div>
                    </div>
                ))}

                <div className="pp-flap-tile pp-flap-gap">
                    <div className="pp-flap-tile-inner" style={{ animationDelay: '220ms' }}>
                        <div className="pp-flap-face pp-flap-front"></div>
                        <div className="pp-flap-face pp-flap-back">→</div>
                    </div>
                </div>

                {group1.map((item, i) => (
                    <div key={`g1-${i}`} className={"pp-flap-tile" + (item.isGap ? " pp-flap-gap" : "")}>
                        <div className="pp-flap-tile-inner-dyn" style={{ transform: `rotateX(${item.rotation})`, transitionDelay: item.delay }}>
                            <div className="pp-flap-face pp-flap-front">{item.faceA}</div>
                            <div className="pp-flap-face pp-flap-back">{item.faceB}</div>
                        </div>
                    </div>
                ))}

                <div className="pp-flap-tile pp-flap-gap">
                    <div className="pp-flap-tile-inner" style={{ animationDelay: '280ms' }}>
                        <div className="pp-flap-face pp-flap-front"></div>
                        <div className="pp-flap-face pp-flap-back">·</div>
                    </div>
                </div>

                {PEER_LETTERS.map((c, i) => (
                    <div key={`peer-${i}`} className="pp-flap-tile">
                        <div className="pp-flap-tile-inner" style={{ animationDelay: `${320 + i * 22}ms` }}>
                            <div className="pp-flap-face pp-flap-front"></div>
                            <div className="pp-flap-face pp-flap-back">{c}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FlapTicker;
