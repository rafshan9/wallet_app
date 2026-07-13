import { useState, useEffect } from 'react';
import api from '../../utils/axios';

export type Transaction = {
    id: string;
    type: 'INCOME' | 'EXPENSE';
    title: string;
    amount: string;
    category: string;
    date: string;
};

const CATEGORY_HEX: Record<string, string> = {
    GROCERIES: '#0eff66ff',
    SUBSCRIPTIONS: '#34d399',
    ENTERTAINMENT: '#ffde0fff',
    SHOPPING: '#3b08f7ff',
    MEMBERSHIP: '#f43f5e',
    DINING: '#fb923c',
    OTHER: '#a855f7',
};

function getCategoryBreakdown(transactions: Transaction[]) {
    const expenseTxs = transactions.filter(t => t.type === 'EXPENSE');
    const total = expenseTxs.reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const grouped = expenseTxs.reduce<Record<string, number>>((acc, t) => {
        const amt = parseFloat(t.amount);
        acc[t.category] = (acc[t.category] ?? 0) + amt;
        return acc;
    }, {});

    return Object.entries(grouped)
        .map(([label, amount]) => ({
            label,
            amount,
            percent: Math.round((amount / total) * 100) || 0,
            hex: CATEGORY_HEX[label] ?? '#888888',
        }))
        .sort((a, b) => b.amount - a.amount);
}

export function useCashFlow() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalSavings, setTotalSavings] = useState(0);


    const fetchTransactions = async () => {
        try {
            // Fetch both at the same time
            const [txRes, contRes] = await Promise.all([
                api.get('/transactions/'),
                api.get('/contributions/')
            ]);

            setTransactions(txRes.data);

            // Sum up the contributions
            const savingsSum = contRes.data.reduce((sum: number, c: any) => sum + parseFloat(c.amount), 0);
            setTotalSavings(savingsSum);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const totalIncome = transactions
        .filter((t) => t.type === 'INCOME')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const totalExpenses = transactions
        .filter((t) => t.type === 'EXPENSE')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0) - totalSavings;

    const categoryBreakdown = getCategoryBreakdown(transactions);

    return {
        transactions,
        isLoading,
        fetchTransactions,
        totalIncome,
        totalExpenses,
        categoryBreakdown,
        totalSavings
    };
}