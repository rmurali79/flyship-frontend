import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import ShipmentDetails from './ShipmentDetails';

jest.mock('axios');

let mockUser = { id: 1, role: 'shipper', name: 'Sam Shipper' };
jest.mock('../context/AuthContext', () => ({
    useAuth: () => ({ user: mockUser }),
}));

const mockWarn = jest.fn();
jest.mock('../context/SnackbarContext', () => ({
    useSnackbar: () => ({ success: jest.fn(), error: jest.fn(), warn: mockWarn, info: jest.fn() }),
}));

const SHIPMENT = {
    id: 10, shipperId: 1, origin: 'NYC', destination: 'LON', status: 'accepted',
    item_description: 'A box', max_budget: 100, escrow_amount: 0,
};

const ACCEPTED_QUOTE = { id: 200, shipment_id: 10, traveler_id: 3, amount: 50, currency: 'USD', status: 'accepted', Traveler: { name: 'Tom Traveler' } };

const mockGet = (overrides = {}) => {
    axios.get.mockImplementation((url) => {
        if (url.includes('/api/shipments/10')) return Promise.resolve({ data: overrides.shipment || SHIPMENT });
        if (url.includes('/api/quotes/shipment/10')) return Promise.resolve({ data: overrides.quotes || [ACCEPTED_QUOTE] });
        if (url.includes('/api/reviews/shipment/10')) return Promise.resolve({ data: [] });
        if (url.includes('/api/disputes')) return Promise.resolve({ data: overrides.disputes || [] });
        return Promise.resolve({ data: [] });
    });
};

const renderPage = async () => {
    render(
        <MemoryRouter initialEntries={['/shipments/10']}>
            <Routes>
                <Route path="/shipments/:id" element={<ShipmentDetails />} />
            </Routes>
        </MemoryRouter>
    );
    await screen.findByText('A box');
};

beforeEach(() => {
    mockGet();
    axios.post.mockResolvedValue({ data: {} });
});

afterEach(() => {
    jest.clearAllMocks();
    mockUser = { id: 1, role: 'shipper', name: 'Sam Shipper' };
});

describe('deleting a shipment', () => {
    beforeEach(() => { mockUser = { id: 1, role: 'shipper', name: 'Sam Shipper' }; });

    test('requires a reason category before confirming', async () => {
        await renderPage();
        fireEvent.click(screen.getByText('Delete Shipment'));
        fireEvent.click(screen.getByText('Confirm Delete'));

        expect(mockWarn).toHaveBeenCalledWith('Please select a reason');
        expect(axios.post).not.toHaveBeenCalledWith(expect.stringContaining('/delete'), expect.anything());
    });

    test('sends the selected category and optional detail', async () => {
        await renderPage();
        fireEvent.click(screen.getByText('Delete Shipment'));
        fireEvent.change(screen.getByDisplayValue('Select a reason...'), { target: { value: 'item_lost' } });
        fireEvent.change(screen.getByPlaceholderText('Additional details (optional)...'), { target: { value: 'Missing at depot' } });
        fireEvent.click(screen.getByText('Confirm Delete'));
        fireEvent.click(screen.getByText('Delete'));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(
                expect.stringContaining('/api/shipments/10/delete'),
                { reason_category: 'item_lost', reason: 'Missing at depot' }
            );
        });
    });
});

describe('withdrawing a quote', () => {
    beforeEach(() => { mockUser = { id: 3, role: 'traveler', name: 'Tom Traveler' }; });

    test('requires a reason category before confirming', async () => {
        mockGet({ quotes: [{ ...ACCEPTED_QUOTE, status: 'pending' }] });
        await renderPage();
        fireEvent.click(screen.getByText('Withdraw'));
        fireEvent.click(screen.getByText('Confirm Withdraw'));

        expect(mockWarn).toHaveBeenCalledWith('Please select a reason');
    });

    test('sends the selected category and optional detail', async () => {
        mockGet({ quotes: [{ ...ACCEPTED_QUOTE, status: 'pending' }] });
        await renderPage();
        fireEvent.click(screen.getByText('Withdraw'));
        fireEvent.change(screen.getByDisplayValue('Select a reason...'), { target: { value: 'found_alternative' } });
        fireEvent.click(screen.getByText('Confirm Withdraw'));
        // ConfirmDialog is mounted earlier in the tree than the trigger button, so it's element [0].
        fireEvent.click(screen.getAllByText('Withdraw')[0]);

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(
                expect.stringContaining('/api/quotes/200/withdraw'),
                { reason_category: 'found_alternative', reason: '' }
            );
        });
    });
});

describe('filing a dispute', () => {
    beforeEach(() => { mockUser = { id: 1, role: 'shipper', name: 'Sam Shipper' }; });

    test('is only offered once there is an accepted counterparty', async () => {
        mockGet({ quotes: [] });
        await renderPage();
        expect(screen.queryByText('File a Dispute')).not.toBeInTheDocument();
    });

    test('requires a reason category, and submits description plus evidence', async () => {
        await renderPage();
        fireEvent.click(screen.getByText('File a Dispute'));
        fireEvent.click(screen.getByText('Submit Dispute'));
        expect(mockWarn).toHaveBeenCalledWith('Please select a reason');

        fireEvent.change(screen.getByDisplayValue('Select a reason...'), { target: { value: 'item_damaged' } });
        fireEvent.change(screen.getByPlaceholderText('Describe what happened (optional)...'), { target: { value: 'Box was crushed' } });
        fireEvent.click(screen.getByText('Submit Dispute'));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(
                expect.stringContaining('/api/disputes'),
                { subject_type: 'shipment', subject_id: '10', reason_category: 'item_damaged', description: 'Box was crushed', evidence_photo_urls: [] }
            );
        });
    });
});

describe('resolving a dispute', () => {
    const OPEN_DISPUTE = {
        id: 500, subject_type: 'shipment', subject_id: 10, filed_by_user_id: 1, respondent_user_id: 3,
        reason_category: 'item_damaged', description: 'Box was crushed', status: 'open', evidence: [],
    };

    test('the respondent can accept a dispute', async () => {
        mockUser = { id: 3, role: 'traveler', name: 'Tom Traveler' };
        mockGet({ disputes: [OPEN_DISPUTE] });
        await renderPage();

        fireEvent.click(screen.getByText('Accept'));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(
                expect.stringContaining('/api/disputes/500/accept'),
                { resolution_notes: '' }
            );
        });
    });

    test('rejecting requires resolution notes', async () => {
        mockUser = { id: 3, role: 'traveler', name: 'Tom Traveler' };
        mockGet({ disputes: [OPEN_DISPUTE] });
        await renderPage();

        fireEvent.click(screen.getByText('Reject'));
        expect(mockWarn).toHaveBeenCalledWith('Please explain why you are rejecting this dispute');
        expect(axios.post).not.toHaveBeenCalledWith(expect.stringContaining('/reject'), expect.anything());
    });

    test('the filer can withdraw their own dispute', async () => {
        mockUser = { id: 1, role: 'shipper', name: 'Sam Shipper' };
        mockGet({ disputes: [OPEN_DISPUTE] });
        await renderPage();

        fireEvent.click(screen.getByText('Withdraw Dispute'));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/api/disputes/500/withdraw'), undefined);
        });
    });
});
