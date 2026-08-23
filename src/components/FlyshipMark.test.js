import { render, screen } from '@testing-library/react';
import FlyshipMark from './FlyshipMark';

test('brand mark uses the FLYnSHIP label', () => {
    render(<FlyshipMark />);
    expect(screen.getByRole('img', { name: 'FLYnSHIP' })).toBeInTheDocument();
});
