import React, { useEffect, useRef } from 'react';
import ShipmentDetails from '../pages/ShipmentDetails';

// Slide-over panel showing the full shipment details page, so the dashboard listing stays in
// place behind it. Closes on Esc, on a backdrop click, or from the panel's own close button.
const ShipmentDrawer = ({ shipmentId, onClose, onChanged }) => {
    const panelRef = useRef(null);

    useEffect(() => {
        const onKeyDown = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', onKeyDown);
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        panelRef.current?.focus();
        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = previousOverflow;
        };
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-40 flex justify-end">
            <div className="absolute inset-0 bg-black/40" data-testid="drawer-backdrop" onClick={onClose} />
            <aside
                ref={panelRef}
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                aria-label="Shipment details"
                className="relative h-full w-full sm:max-w-3xl overflow-y-auto bg-gray-100 dark:bg-gray-900 shadow-2xl outline-none animate-drawer-in"
            >
                <ShipmentDetails key={shipmentId} shipmentId={shipmentId} onClose={onClose} onChanged={onChanged} />
            </aside>
        </div>
    );
};

export default ShipmentDrawer;
