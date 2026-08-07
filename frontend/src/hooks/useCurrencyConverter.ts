import { useState, useRef } from 'react';

// Cache rates so we don't refetch every time the modal opens
const rateCache: { [key: string]: { rates: Record<string, number>; fetchedAt: number } } = {};
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

export function useCurrencyConverter() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRates = async (from: string): Promise<Record<string, number>> => {
        const cached = rateCache[from];
        if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
            return cached.rates;
        }

        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch(`https://api.frankfurter.app/latest?from=${from}`);
            if (!res.ok) throw new Error('Failed to fetch rates');
            const data = await res.json();
            rateCache[from] = { rates: data.rates, fetchedAt: Date.now() };
            return data.rates;
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
        const rate = rates[to];
        if (!rate) throw new Error(`No rate available for ${to}`);
        return parseFloat((amount * rate).toFixed(2));
    };

    return { convert, isLoading, error };
}
