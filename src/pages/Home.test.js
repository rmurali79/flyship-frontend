import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';

test('features heading and footer copyright read FLYSHIP', () => {
    render(
        <MemoryRouter>
            <Home />
        </MemoryRouter>
    );
    expect(screen.getByText('Why FLYSHIP?')).toBeInTheDocument();
    expect(screen.getByText(/FLYSHIP\. All rights reserved\./)).toBeInTheDocument();
});
