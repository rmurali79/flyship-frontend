// Money is shown with its ISO code ("USD 50", "SGD 12.50"), never a bare "$", so amounts in
// different currencies can't be mistaken for each other.
export const formatMoney = (amount, currency = 'USD') => {
    const value = Number(amount);
    if (amount == null || amount === '' || Number.isNaN(value)) return '—';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency || 'USD',
        currencyDisplay: 'code',
        minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
        maximumFractionDigits: 2,
    }).format(value);
};
