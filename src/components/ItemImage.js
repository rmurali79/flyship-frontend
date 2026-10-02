import React, { useState } from 'react';
import { Package } from 'lucide-react';
import API_BASE from '../config/api';

const GENERIC_IMAGE = '/item-images/parcel.jpg';

const resolve = (url) => (url && !url.startsWith('http') ? API_BASE + url : url);

// The shipper's own photo when there is a usable one; otherwise (or if it fails to load) the
// backend's stock photo matched to the item (item_image_url). Stock photos are labelled so
// nobody mistakes them for the actual item; `compact` thumbnails are too small for the label,
// so it moves to the tooltip.
const ItemImage = ({ shipment, className = '', compact = false }) => {
    const ownPhoto = shipment.photo_url && !shipment.photo_url.startsWith('/item-images/') ? shipment.photo_url : null;
    const candidates = [ownPhoto, shipment.item_image_url, GENERIC_IMAGE].filter(Boolean);
    const [attempt, setAttempt] = useState(0);
    const src = candidates[attempt];
    const illustrative = src !== ownPhoto;

    // Every candidate failed to load (e.g. a backend without /item-images): a neutral tile
    // rather than the browser's broken-image icon.
    if (!src) {
        return (
            <div
                role="img"
                aria-label={shipment.item_description || 'Shipment item'}
                className={`flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 ${className}`}
            >
                <Package size={compact ? 22 : 36} strokeWidth={1.5} />
            </div>
        );
    }

    return (
        <div
            className={`relative overflow-hidden bg-gray-100 dark:bg-gray-700 ${className}`}
            title={illustrative && compact ? 'Illustrative image' : undefined}
        >
            <img
                src={resolve(src)}
                alt={shipment.item_description || 'Shipment item'}
                className="w-full h-full object-cover"
                onError={() => setAttempt(a => a + 1)}
            />
            {illustrative && !compact && (
                <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/55 text-white text-[10px] leading-tight">
                    Illustrative image
                </span>
            )}
        </div>
    );
};

export default ItemImage;
