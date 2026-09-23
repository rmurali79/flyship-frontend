import { useEffect, useRef } from 'react';

// Subtle mouse-parallax on the hero background layers: the map drifts a
// little, the network overlay drifts a bit more, both eased toward the
// pointer position.
const useParallax = () => {
    const mapRef = useRef(null);
    const networkRef = useRef(null);
    const target = useRef({ x: 0, y: 0 });
    const current = useRef({ x: 0, y: 0 });
    const raf = useRef(null);

    useEffect(() => {
        let reduceMotion = false;
        try {
            reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        } catch (err) { /* noop */ }
        if (reduceMotion) return;

        const tick = () => {
            current.current.x += (target.current.x - current.current.x) * 0.06;
            current.current.y += (target.current.y - current.current.y) * 0.06;
            if (mapRef.current) {
                mapRef.current.style.transform = `translate3d(${(current.current.x * 9).toFixed(2)}px, ${(current.current.y * 6).toFixed(2)}px, 0)`;
            }
            if (networkRef.current) {
                networkRef.current.style.transform = `translate3d(${(current.current.x * 18).toFixed(2)}px, ${(current.current.y * 12).toFixed(2)}px, 0)`;
            }
            raf.current = requestAnimationFrame(tick);
        };
        raf.current = requestAnimationFrame(tick);
        return () => {
            if (raf.current) cancelAnimationFrame(raf.current);
        };
    }, []);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        target.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        target.current.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    };
    const handleMouseLeave = () => {
        target.current.x = 0;
        target.current.y = 0;
    };

    return { mapRef, networkRef, handleMouseMove, handleMouseLeave };
};

export default useParallax;
