import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';

jest.mock('../context/AuthContext', () => ({
    useAuth: () => ({ user: null, logout: jest.fn() }),
}));

beforeAll(() => {
    window.matchMedia = window.matchMedia || function () {
        return { matches: false, addListener: jest.fn(), removeListener: jest.fn() };
    };
});

test('nav shows the PeerPost brand mark', () => {
    render(
        <MemoryRouter>
            <Navbar />
        </MemoryRouter>
    );
    expect(screen.getByRole('img', { name: 'PeerPost' })).toBeInTheDocument();
});

test('Help & Resources menu links to What\'s New and FAQ', () => {
    render(
        <MemoryRouter>
            <Navbar />
        </MemoryRouter>
    );
    const trigger = screen.getByRole('button', { name: 'Help & Resources' });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('menuitem', { name: "What's New" })).toHaveAttribute('href', '/whats-new');
    expect(screen.getByRole('menuitem', { name: 'FAQ' })).toHaveAttribute('href', '/faq');
});
