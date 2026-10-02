import { formatMoney } from './money';

const plain = (s) => s.replace(/ /g, ' ');

test('formats with the ISO code, dropping .00 on whole amounts', () => {
    expect(plain(formatMoney(50))).toBe('USD 50');
    expect(plain(formatMoney('86.6'))).toBe('USD 86.60');
    expect(plain(formatMoney(1234.5, 'SGD'))).toBe('SGD 1,234.50');
});

test('shows a dash for missing or invalid amounts', () => {
    expect(formatMoney(null)).toBe('—');
    expect(formatMoney('')).toBe('—');
    expect(formatMoney('abc')).toBe('—');
});
