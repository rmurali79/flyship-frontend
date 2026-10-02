// Pure helpers behind the dashboard's greeting, context line and stat tiles.
import { formatMoney } from './money';

const DAY_MS = 24 * 60 * 60 * 1000;

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

const parseDay = (dateString) => {
    const [y, m, d] = String(dateString || '').slice(0, 10).split('-').map(Number);
    return y && m && d ? new Date(y, m - 1, d) : null;
};

export const greeting = (name, now = new Date()) => {
    const hour = now.getHours();
    const part = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
    const first = (name || '').trim().split(/\s+/)[0];
    return first ? `Good ${part}, ${first}` : `Good ${part}`;
};

// The earliest trip starting today or later.
export const nextTrip = (plans = [], today = new Date()) => {
    const t0 = startOfDay(today);
    return plans
        .map(p => ({ plan: p, start: parseDay(p.start_date) }))
        .filter(x => x.start && x.start >= t0)
        .sort((a, b) => a.start - b.start)[0]?.plan || null;
};

export const daysUntil = (dateString, today = new Date()) => {
    const d = parseDay(dateString);
    return d ? Math.round((d - startOfDay(today)) / DAY_MS) : null;
};

const inDays = (n) => (n === 0 ? 'today' : n === 1 ? 'tomorrow' : `in ${n} days`);

const sameCity = (a, b) => (a || '').trim().toLowerCase() === (b || '').trim().toLowerCase();

// Open shipments on the trip's route.
export const tripMatches = (plan, shipments = []) =>
    shipments.filter(s => s.status === 'pending' && sameCity(s.origin, plan.origin) && sameCity(s.destination, plan.destination)).length;

const plural = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

/**
 * One line of context under the greeting. Travelers hear about their next trip, shippers about
 * listings waiting for quotes; each falls back to a nudge when there's nothing to report.
 * `route` formats a plan's origin/destination for display (e.g. "BER → CHE").
 */
export const contextLine = ({ role, plans, browseShipments, ownShipments, route, today = new Date() }) => {
    const isTraveler = role === 'traveler' || role === 'both';
    const isShipper = role === 'shipper' || role === 'both';
    const trip = isTraveler ? nextTrip(plans, today) : null;
    if (trip) {
        const matches = tripMatches(trip, browseShipments);
        return `Next trip ${route(trip)} ${inDays(daysUntil(trip.start_date, today))}`
            + (matches ? ` · ${plural(matches, 'shipment')} on your route` : '');
    }
    const waiting = isShipper ? ownShipments.filter(s => s.status === 'pending').length : 0;
    if (waiting) return `${plural(waiting, 'shipment')} waiting for quotes`;
    if (isTraveler) return 'Add your next trip to see shipments on your route.';
    return 'Post a shipment and travelers on that route can quote for it.';
};

const ratingTile = (stats) => ({
    label: 'Rating',
    value: stats.reviewCount ? `${Number(stats.averageRating).toFixed(1)} ★` : '—',
    hint: stats.reviewCount ? plural(stats.reviewCount, 'review') : 'After your first delivery',
});

/** Four tiles per role, each with a hint so that zeros still say something. */
export const statTiles = ({ role, stats = {}, deliveries = [], ownShipments = [], plans = [], today = new Date() }) => {
    const active = deliveries.filter(s => s.status === 'accepted' || s.status === 'in_transit');
    const carrying = active.filter(s => s.status === 'in_transit').length;
    const awaiting = ownShipments.filter(s => s.status === 'pending').length;
    const inProgress = ownShipments.filter(s => s.status === 'accepted' || s.status === 'in_transit');
    const upcoming = plans.filter(p => (daysUntil(p.start_date, today) ?? -1) >= 0).length;

    const earnings = { label: 'Earnings', value: formatMoney(stats.totalEarnings || 0), hint: 'Paid on delivery' };
    const spent = { label: 'Total spent', value: formatMoney(stats.totalSpends || 0), hint: 'Completed payments' };
    const activeTile = {
        label: 'Active deliveries',
        value: active.length,
        hint: active.length ? `${carrying} in transit` : 'Accept a shipment to start',
    };

    if (role === 'shipper') {
        return [
            spent,
            { label: 'Awaiting quotes', value: awaiting, hint: awaiting ? 'Open listings' : 'No open listings' },
            { label: 'In progress', value: inProgress.length, hint: `${stats.itemsShipped || 0} delivered so far` },
            ratingTile(stats),
        ];
    }
    if (role === 'both') {
        return [earnings, spent, { ...activeTile, value: active.length + inProgress.length, hint: 'Carrying and sending' }, ratingTile(stats)];
    }
    return [
        earnings,
        activeTile,
        { label: 'Deliveries done', value: stats.tripsDone || 0, hint: upcoming ? `${plural(upcoming, 'trip')} coming up` : 'No upcoming trips' },
        ratingTile(stats),
    ];
};
