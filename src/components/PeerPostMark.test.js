import { render, screen } from '@testing-library/react';
import PeerPostMark from './PeerPostMark';

test('brand mark uses the PeerPost label', () => {
    render(<PeerPostMark />);
    expect(screen.getByRole('img', { name: 'PeerPost' })).toBeInTheDocument();
});
