import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import Navbar, { headlineBalance } from './Navbar';

jest.mock('axios');
jest.mock('../context/AuthContext', () => ({
    useAuth: () => ({ user: { id: 1, name: 'Murali the Traveller', role: 'traveler' }, logout: jest.fn() }),
}));
jest.mock('./NotificationBell', () => () => null);

beforeAll(() => {
    window.matchMedia = window.matchMedia || (() => ({ matches: false, addListener: jest.fn(), removeListener: jest.fn() }));
});

test('headline balance prefers USD, else the first non-empty wallet', () => {
    expect(headlineBalance([{ currency: 'EUR', balance: 5 }, { currency: 'USD', balance: 710 }]).currency).toBe('USD');
    expect(headlineBalance([{ currency: 'USD', balance: 0 }, { currency: 'SGD', balance: 12 }]).currency).toBe('SGD');
    expect(headlineBalance([])).toEqual({ currency: 'USD', balance: 0 });
});

test('logged-in bar shows page links, the wallet balance and a compact theme switch', async () => {
    axios.get.mockResolvedValue({ data: [{ currency: 'USD', balance: 710, locked_balance: 0 }] });
    render(<MemoryRouter initialEntries={['/dashboard']}><Navbar /></MemoryRouter>);

    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Wallet' })).toBeInTheDocument();
    await waitFor(() => expect(screen.getByTitle('Wallet balance')).toHaveTextContent('USD 710'));
    expect(screen.getByRole('switch', { name: 'Dark mode' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Account menu' })).toBeInTheDocument();
    expect(screen.queryByText('Murali the Traveller')).not.toBeInTheDocument();
});
