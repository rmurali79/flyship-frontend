import { useEffect, useRef } from 'react';

// Fades/slides an element in the first time it scrolls into view.
const useReveal = () => {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        let reduceMotion = false;
        try {
            reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        } catch (err) { /* noop */ }

        if (reduceMotion || !("IntersectionObserver" in window)) {
            el.classList.add("is-visible");
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return ref;
};

export default useReveal;
