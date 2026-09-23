import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';

test('landing page shows PeerPost branding', () => {
    render(
        <MemoryRouter>
            <Home />
        </MemoryRouter>
    );
    expect(screen.getByText('WHY PEERPOST')).toBeInTheDocument();
    expect(screen.getByText(/© \d{4} PeerPost/)).toBeInTheDocument();
});
