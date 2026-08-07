import { useState } from 'react';

// Cache rates so we don't refetch every time the modal opens
const rateCache: { [key: string]: { rates: Record<string, number>; fetchedAt: number } } = {};
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

// Uses fawazahmed0/currency-api — free, no API key, 170+ currencies, CDN-hosted
// Docs: https://github.com/fawazahmed0/exchange-api
const CURRENCY_API_BASE = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies';

export function useCurrencyConverter() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRates = async (from: string): Promise<Record<string, number>> => {
        const fromLower = from.toLowerCase();
        const cached = rateCache[fromLower];
        if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
            return cached.rates;
        }

        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch(`${CURRENCY_API_BASE}/${fromLower}.json`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            // Response shape: { date: "...", [fromLower]: { usd: 1.1, myr: 4.7, ... } }
            const rates = data[fromLower] as Record<string, number>;
            if (!rates) throw new Error('Unexpected API response shape');
            rateCache[fromLower] = { rates, fetchedAt: Date.now() };
            return rates;
        } catch (e: any) {
            setError('Could not fetch exchange rates. Check your connection.');
            throw e;
        } finally {
            setIsLoading(false);
        }
    };

    const convert = async (amount: number, from: string, to: string): Promise<number> => {
        if (from === to) return amount;
        const rates = await fetchRates(from);
        const rate = rates[to.toLowerCase()];
        if (rate === undefined) throw new Error(`No rate available for ${to}`);
        return parseFloat((amount * rate).toFixed(4));
    };

    return { convert, isLoading, error };
}
