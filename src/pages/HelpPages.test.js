import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FAQ, { FAQ_SECTIONS } from './FAQ';
import WhatsNew from './WhatsNew';

test('FAQ renders every drafted question', () => {
    render(<MemoryRouter><FAQ /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Frequently asked questions' })).toBeInTheDocument();
    FAQ_SECTIONS.flatMap(s => s.items).forEach(({ q }) => expect(screen.getByText(q)).toBeInTheDocument());
});

test("What's New announces Wallet Support with a link to the wallet", () => {
    render(<MemoryRouter><WhatsNew /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Wallet Support' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Open your wallet' })).toHaveAttribute('href', '/wallet');
});
