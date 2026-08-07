import { CURRENCIES } from './currencies';

/**
 * Returns the symbol for a given currency code.
 * Falls back to the code itself if not found.
 */
export function getCurrencySymbol(code: string): string {
    return CURRENCIES.find((c) => c.code === code)?.symbol ?? code;
}

/**
 * Formats a number as a currency string using the given currency code.
 * e.g. formatCurrency(1234.5, 'MYR') => 'RM1,234.5'
 */
export function formatCurrency(amount: number, currencyCode: string, fractionDigits = 2): string {
    const symbol = getCurrencySymbol(currencyCode);
    return `${symbol}${amount.toLocaleString(undefined, {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
    })}`;
}
