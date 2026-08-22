import { render, screen } from '@testing-library/react';
import FlyshipMark from './FlyshipMark';

test('brand mark uses the JETRUNNER label', () => {
    render(<FlyshipMark />);
    expect(screen.getByRole('img', { name: 'JETRUNNER' })).toBeInTheDocument();
});
