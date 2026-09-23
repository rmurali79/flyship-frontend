import { render, screen } from '@testing-library/react';
import FlyshipMark from './FlyshipMark';

test('brand mark uses the PeerPost label', () => {
    render(<FlyshipMark />);
    expect(screen.getByRole('img', { name: 'PeerPost' })).toBeInTheDocument();
});
