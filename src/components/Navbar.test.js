import { render, screen } from '@testing-library/react';
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

test('brand text in the nav reads Fly it Fast', () => {
    render(
        <MemoryRouter>
            <Navbar />
        </MemoryRouter>
    );
    expect(screen.getByText('Fly it Fast')).toBeInTheDocument();
});
