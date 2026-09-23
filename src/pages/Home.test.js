import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';

test('features heading and footer copyright read PeerPost', () => {
    render(
        <MemoryRouter>
            <Home />
        </MemoryRouter>
    );
    expect(screen.getByText('Why PeerPost?')).toBeInTheDocument();
    expect(screen.getByText(/PeerPost\. All rights reserved\./)).toBeInTheDocument();
});
