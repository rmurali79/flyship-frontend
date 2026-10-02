import { greeting, nextTrip, tripMatches, contextLine, statTiles } from './dashboardSummary';

const today = new Date(2026, 9, 2, 19, 0); // 2 Oct 2026, 7 pm
const route = (p) => `${p.origin} → ${p.destination}`;
const plain = (s) => String(s).replace(/ /g, ' ');

test('greets by time of day with the first name', () => {
    expect(greeting('Murali the Traveller', today)).toBe('Good evening, Murali');
    expect(greeting('Sam', new Date(2026, 9, 2, 9))).toBe('Good morning, Sam');
    expect(greeting('', new Date(2026, 9, 2, 13))).toBe('Good afternoon');
});

test('next trip is the earliest one starting today or later', () => {
    const plans = [
        { id: 1, start_date: '2026-09-30' },
        { id: 2, start_date: '2026-10-20' },
        { id: 3, start_date: '2026-10-07' },
    ];
    expect(nextTrip(plans, today).id).toBe(3);
    expect(nextTrip([{ id: 1, start_date: '2026-09-30' }], today)).toBeNull();
});

test('counts open shipments on the trip route, ignoring case', () => {
    const plan = { origin: 'Berlin', destination: 'Chennai' };
    const shipments = [
        { origin: 'berlin', destination: 'Chennai', status: 'pending' },
        { origin: 'Berlin', destination: 'Chennai', status: 'accepted' },
        { origin: 'Berlin', destination: 'Tokyo', status: 'pending' },
    ];
    expect(tripMatches(plan, shipments)).toBe(1);
});

describe('context line', () => {
    const plans = [{ origin: 'Berlin', destination: 'Chennai', start_date: '2026-10-07' }];
    const browse = [
        { origin: 'Berlin', destination: 'Chennai', status: 'pending' },
        { origin: 'Berlin', destination: 'Chennai', status: 'pending' },
    ];

    test('traveler with an upcoming trip', () => {
        expect(contextLine({ role: 'traveler', plans, browseShipments: browse, ownShipments: [], route, today }))
            .toBe('Next trip Berlin → Chennai in 5 days · 2 shipments on your route');
    });

    test('traveler without trips gets a nudge', () => {
        expect(contextLine({ role: 'traveler', plans: [], browseShipments: browse, ownShipments: [], route, today }))
            .toBe('Add your next trip to see shipments on your route.');
    });

    test('shipper with listings waiting for quotes', () => {
        expect(contextLine({ role: 'shipper', plans: [], browseShipments: [], ownShipments: [{ status: 'pending' }, { status: 'accepted' }], route, today }))
            .toBe('1 shipment waiting for quotes');
    });

    test('says tomorrow and today', () => {
        expect(contextLine({ role: 'traveler', plans: [{ origin: 'A', destination: 'B', start_date: '2026-10-03' }], browseShipments: [], ownShipments: [], route, today }))
            .toBe('Next trip A → B tomorrow');
        expect(contextLine({ role: 'traveler', plans: [{ origin: 'A', destination: 'B', start_date: '2026-10-02' }], browseShipments: [], ownShipments: [], route, today }))
            .toBe('Next trip A → B today');
    });
});

describe('stat tiles', () => {
    test('traveler: earnings, active deliveries, deliveries done, rating', () => {
        const tiles = statTiles({
            role: 'traveler',
            stats: { totalEarnings: 75, tripsDone: 3, averageRating: 4.5, reviewCount: 2 },
            deliveries: [{ status: 'accepted' }, { status: 'in_transit' }, { status: 'delivered' }],
            plans: [{ start_date: '2026-10-07' }],
            today,
        });
        expect(tiles.map(t => t.label)).toEqual(['Earnings', 'Active deliveries', 'Deliveries done', 'Rating']);
        expect(plain(tiles[0].value)).toBe('USD 75');
        expect(tiles[1]).toMatchObject({ value: 2, hint: '1 in transit' });
        expect(tiles[2]).toMatchObject({ value: 3, hint: '1 trip coming up' });
        expect(tiles[3]).toMatchObject({ value: '4.5 ★', hint: '2 reviews' });
    });

    test('new users see hints instead of bare zeros', () => {
        const tiles = statTiles({ role: 'traveler', stats: {}, today });
        expect(tiles[1].hint).toBe('Accept a shipment to start');
        expect(tiles[3]).toMatchObject({ value: '—', hint: 'After your first delivery' });
    });

    test('shipper: spent, awaiting quotes, in progress, rating', () => {
        const tiles = statTiles({
            role: 'shipper',
            stats: { totalSpends: 40, itemsShipped: 5 },
            ownShipments: [{ status: 'pending' }, { status: 'pending' }, { status: 'in_transit' }],
            today,
        });
        expect(tiles.map(t => t.label)).toEqual(['Total spent', 'Awaiting quotes', 'In progress', 'Rating']);
        expect(tiles[1].value).toBe(2);
        expect(tiles[2]).toMatchObject({ value: 1, hint: '5 delivered so far' });
    });

    test('both: earnings and spending side by side', () => {
        const tiles = statTiles({ role: 'both', stats: { totalEarnings: 10, totalSpends: 20 }, today });
        expect(tiles.map(t => t.label)).toEqual(['Earnings', 'Total spent', 'Active deliveries', 'Rating']);
    });
});
