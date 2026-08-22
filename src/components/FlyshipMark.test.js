import { render, screen } from '@testing-library/react';
import FlyshipMark from './FlyshipMark';

test('brand mark uses the FLYSHIP label', () => {
    render(<FlyshipMark />);
    expect(screen.getByRole('img', { name: 'FLYSHIP' })).toBeInTheDocument();
});
