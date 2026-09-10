import { render, screen } from '@testing-library/react';
import FlyshipMark from './FlyshipMark';

test('brand mark uses the Fly it Fast label', () => {
    render(<FlyshipMark />);
    expect(screen.getByRole('img', { name: 'Fly it Fast' })).toBeInTheDocument();
});
