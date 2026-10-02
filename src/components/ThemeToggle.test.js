import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';

const renderToggle = () => render(<ThemeProvider><ThemeToggle /></ThemeProvider>);

beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    window.matchMedia = jest.fn().mockReturnValue({ matches: false });
});

test('defaults to dark and switches to light and back, remembering the choice', () => {
    renderToggle();
    const toggle = screen.getByRole('switch', { name: 'Dark mode' });
    expect(toggle).toHaveAttribute('aria-checked', 'true');
    expect(document.documentElement).toHaveClass('dark');

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-checked', 'false');
    expect(document.documentElement).not.toHaveClass('dark');
    expect(localStorage.theme).toBe('light');

    fireEvent.click(toggle);
    expect(document.documentElement).toHaveClass('dark');
    expect(localStorage.theme).toBe('dark');
});

test('starts from the saved theme', () => {
    localStorage.theme = 'light';
    renderToggle();
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
    expect(document.documentElement).not.toHaveClass('dark');
});

test('follows a light OS preference when nothing is saved', () => {
    window.matchMedia = jest.fn().mockReturnValue({ matches: true });
    renderToggle();
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
});
