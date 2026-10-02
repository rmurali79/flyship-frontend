import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import Dashboard from './Dashboard';

jest.mock('axios');

jest.mock('../context/AuthContext', () => ({
    useAuth: () => ({ user: { id: 99, role: 'shipper', name: 'Test Shipper' } }),
}));

jest.mock('../context/SnackbarContext', () => ({
    useSnackbar: () => ({ success: jest.fn(), error: jest.fn(), warn: jest.fn(), info: jest.fn() }),
}));

// One shipment per interesting boundary value:
// - Item-Epsilon sits exactly on the amount threshold (100) used by the "gt"/"lt" tests,
//   to prove those operators are strict (>/<) rather than inclusive (>=/<=).
const SHIPMENTS = [
    { id: 1, origin: 'Hong Kong', destination: 'Sydney', item_description: 'Item-Alpha', weight: 4.75, max_budget: 86.63, status: 'pending' },
    { id: 2, origin: 'Sydney', destination: 'Mumbai', item_description: 'Item-Beta', weight: 1.04, max_budget: 207.30, status: 'pending' },
    { id: 3, origin: 'Mumbai', destination: 'Singapore', item_description: 'Item-Gamma', weight: 1.90, max_budget: 72.14, status: 'pending' },
    { id: 4, origin: 'Hong Kong', destination: 'Tokyo', item_description: 'Item-Delta', weight: 8.53, max_budget: 151.35, status: 'pending' },
    { id: 5, origin: 'New York', destination: 'London', item_description: 'Item-Epsilon', weight: 0.55, max_budget: 100, status: 'pending' },
];

beforeEach(() => {
    axios.get.mockImplementation((url) => {
        if (url.includes('/api/shipments/my-shipments')) {
            return Promise.resolve({ data: SHIPMENTS });
        }
        const detail = url.match(/\/api\/shipments\/(\d+)$/);
        if (detail) {
            return Promise.resolve({ data: { ...SHIPMENTS.find(s => s.id === Number(detail[1])), shipperId: 99 } });
        }
        return Promise.resolve({ data: [] });
    });
});

afterEach(() => {
    jest.clearAllMocks();
});

const renderDashboard = async (initialEntries = ['/dashboard']) => {
    render(
        <MemoryRouter initialEntries={initialEntries}>
            <Dashboard />
        </MemoryRouter>
    );
    await screen.findByText('Item-Alpha');
};

test('shows all shipments when no filters are applied', async () => {
    await renderDashboard();
    for (const s of SHIPMENTS) {
        expect(screen.getByText(s.item_description)).toBeInTheDocument();
    }
});

test('city filter does a case-insensitive partial match on origin', async () => {
    await renderDashboard();
    fireEvent.change(screen.getByLabelText('City filter'), { target: { value: 'hong' } });

    expect(screen.getByText('Item-Alpha')).toBeInTheDocument();
    expect(screen.getByText('Item-Delta')).toBeInTheDocument();
    expect(screen.queryByText('Item-Beta')).not.toBeInTheDocument();
    expect(screen.queryByText('Item-Gamma')).not.toBeInTheDocument();
    expect(screen.queryByText('Item-Epsilon')).not.toBeInTheDocument();
});

test('city filter also matches destination, not just origin', async () => {
    await renderDashboard();
    fireEvent.change(screen.getByLabelText('City filter'), { target: { value: 'tokyo' } });

    expect(screen.getByText('Item-Delta')).toBeInTheDocument();
    expect(screen.queryByText('Item-Alpha')).not.toBeInTheDocument();
    expect(screen.queryByText('Item-Beta')).not.toBeInTheDocument();
});

test('amount "greater than" is a strict comparison (excludes an exact match)', async () => {
    await renderDashboard();
    fireEvent.change(screen.getByLabelText('Amount operator'), { target: { value: 'gt' } });
    fireEvent.change(screen.getByLabelText('Amount value'), { target: { value: '100' } });

    expect(screen.queryByText('Item-Alpha')).not.toBeInTheDocument();   // 86.63
    expect(screen.getByText('Item-Beta')).toBeInTheDocument();          // 207.30
    expect(screen.queryByText('Item-Gamma')).not.toBeInTheDocument();   // 72.14
    expect(screen.getByText('Item-Delta')).toBeInTheDocument();         // 151.35
    expect(screen.queryByText('Item-Epsilon')).not.toBeInTheDocument(); // 100 is not > 100
});

test('amount "less than" is a strict comparison (excludes an exact match)', async () => {
    await renderDashboard();
    // default operator is "lt"
    fireEvent.change(screen.getByLabelText('Amount value'), { target: { value: '100' } });

    expect(screen.getByText('Item-Alpha')).toBeInTheDocument();         // 86.63
    expect(screen.queryByText('Item-Beta')).not.toBeInTheDocument();    // 207.30
    expect(screen.getByText('Item-Gamma')).toBeInTheDocument();         // 72.14
    expect(screen.queryByText('Item-Delta')).not.toBeInTheDocument();   // 151.35
    expect(screen.queryByText('Item-Epsilon')).not.toBeInTheDocument(); // 100 is not < 100
});

test('weight filter narrows results by parcel weight', async () => {
    await renderDashboard();
    fireEvent.change(screen.getByLabelText('Weight operator'), { target: { value: 'gt' } });
    fireEvent.change(screen.getByLabelText('Weight value'), { target: { value: '5' } });

    expect(screen.getByText('Item-Delta')).toBeInTheDocument();         // 8.53 kg
    expect(screen.queryByText('Item-Alpha')).not.toBeInTheDocument();   // 4.75 kg
    expect(screen.queryByText('Item-Beta')).not.toBeInTheDocument();    // 1.04 kg
    expect(screen.queryByText('Item-Gamma')).not.toBeInTheDocument();   // 1.90 kg
    expect(screen.queryByText('Item-Epsilon')).not.toBeInTheDocument(); // 0.55 kg
});

test('city, amount, and weight filters combine with AND semantics', async () => {
    await renderDashboard();
    fireEvent.change(screen.getByLabelText('City filter'), { target: { value: 'hong' } });
    fireEvent.change(screen.getByLabelText('Amount operator'), { target: { value: 'gt' } });
    fireEvent.change(screen.getByLabelText('Amount value'), { target: { value: '100' } });

    // Item-Alpha has origin Hong Kong but fails the amount filter (86.63 is not > 100).
    // Item-Delta has origin Hong Kong AND passes the amount filter (151.35 > 100).
    expect(screen.getByText('Item-Delta')).toBeInTheDocument();
    expect(screen.queryByText('Item-Alpha')).not.toBeInTheDocument();
});

test('shows an empty-state message when no shipment matches the filters', async () => {
    await renderDashboard();
    fireEvent.change(screen.getByLabelText('City filter'), { target: { value: 'nonexistent-city' } });

    expect(screen.getByText('No shipments match your filters.')).toBeInTheDocument();
    for (const s of SHIPMENTS) {
        expect(screen.queryByText(s.item_description)).not.toBeInTheDocument();
    }
});

test('"Clear filters" resets every filter and restores the full list', async () => {
    await renderDashboard();
    fireEvent.change(screen.getByLabelText('City filter'), { target: { value: 'hong' } });
    fireEvent.change(screen.getByLabelText('Amount value'), { target: { value: '50' } });
    expect(screen.queryByText('Item-Beta')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Clear filters'));

    for (const s of SHIPMENTS) {
        expect(screen.getByText(s.item_description)).toBeInTheDocument();
    }
    expect(screen.getByLabelText('City filter')).toHaveValue('');
    expect(screen.getByLabelText('Amount value')).toHaveValue(null);
});

describe('list view', () => {
    test('has no connector column between origin and destination', async () => {
        await renderDashboard();
        fireEvent.click(screen.getByLabelText('List view'));

        const headers = within(screen.getByRole('table')).getAllByRole('columnheader').map(th => th.textContent);
        expect(headers.slice(0, 2)).toEqual(['Origin', 'Destination']);
        const firstRowCells = within(screen.getAllByRole('row')[1]).getAllByRole('cell');
        expect(firstRowCells).toHaveLength(headers.length);
    });
});

describe('shipment side panel', () => {
    test('clicking a list row opens the details in a side panel over the listing', async () => {
        await renderDashboard();
        fireEvent.click(screen.getByLabelText('List view'));
        fireEvent.click(screen.getAllByRole('row').find(row => within(row).queryByText('Item-Beta')));

        const panel = await screen.findByRole('dialog', { name: 'Shipment details' });
        expect(await within(panel).findByText('Item Details')).toBeInTheDocument();
        expect(within(panel).getByText('Item-Beta')).toBeInTheDocument();
        // The listing is still rendered behind the panel.
        expect(screen.getByText('Item-Alpha')).toBeInTheDocument();
    });

    test('clicking a grid card opens the side panel', async () => {
        await renderDashboard();
        fireEvent.click(screen.getByText('Item-Gamma'));

        const panel = await screen.findByRole('dialog', { name: 'Shipment details' });
        expect(await within(panel).findByText('Item Details')).toBeInTheDocument();
    });

    test('closes with the close button, Escape, or a backdrop click', async () => {
        await renderDashboard();
        fireEvent.click(screen.getByText('Item-Gamma'));
        const panel = await screen.findByRole('dialog');
        fireEvent.click(await within(panel).findByLabelText('Close and return to listing'));
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

        fireEvent.click(screen.getByText('Item-Gamma'));
        await screen.findByRole('dialog');
        fireEvent.keyDown(document, { key: 'Escape' });
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

        fireEvent.click(screen.getByText('Item-Gamma'));
        await screen.findByRole('dialog');
        fireEvent.click(screen.getByTestId('drawer-backdrop'));
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    test('a shared ?shipment= link opens the panel directly', async () => {
        await renderDashboard(['/dashboard?shipment=4']);
        const panel = await screen.findByRole('dialog');
        expect(await within(panel).findByText('Item Details')).toBeInTheDocument();
        expect(within(panel).getByText('Item-Delta')).toBeInTheDocument();

        fireEvent.keyDown(document, { key: 'Escape' });
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
});

test('shipments without their own photo show a labelled illustrative image', async () => {
    await renderDashboard();
    expect(screen.getAllByText('Illustrative image')).toHaveLength(SHIPMENTS.length);
});

test('falls back to the item-matched image, then to a placeholder, when images fail to load', async () => {
    axios.get.mockImplementation((url) => Promise.resolve({
        data: url.includes('/api/shipments/my-shipments')
            ? [{ ...SHIPMENTS[0], photo_url: 'http://localhost:3000/photos/gone.jpg', item_image_url: '/item-images/laptop.jpg' }]
            : [],
    }));
    await renderDashboard();

    const img = () => screen.getByRole('img', { name: 'Item-Alpha' });
    expect(img()).toHaveAttribute('src', 'http://localhost:3000/photos/gone.jpg');
    expect(screen.queryByText('Illustrative image')).not.toBeInTheDocument();

    fireEvent.error(img());
    expect(img().getAttribute('src')).toMatch(/\/item-images\/laptop\.jpg$/);
    expect(screen.getByText('Illustrative image')).toBeInTheDocument();

    fireEvent.error(img());
    expect(img().getAttribute('src')).toMatch(/\/item-images\/parcel\.jpg$/);

    fireEvent.error(img());
    expect(img()).not.toHaveAttribute('src');
    expect(screen.queryByText('Illustrative image')).not.toBeInTheDocument();
});
