import { useQuery } from '@tanstack/react-query';
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
    GROCERIES: '#219C90',
    SUBSCRIPTIONS: '#ffffffff',
    ENTERTAINMENT: '#FF9E20',
    SHOPPING: '#6FEDD6',
    MEMBERSHIP: '#1a4a57ff',
    DINING: '#6639e3',
    OTHER: '#bc2d39ff',
};

const isThisMonth = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
};

const isToday = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    return d.toDateString() === now.toDateString();
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
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['cashFlow'],
        queryFn: async () => {
            const [txRes, contRes] = await Promise.all([
                api.get('/transactions/'),
                api.get('/contributions/')
            ]);

            return {
                transactions: txRes.data as Transaction[],
                contributions: contRes.data
            };
        }
    });

    const transactions = data?.transactions || [];
    const contributions = data?.contributions || [];

    // Savings calculations
    const totalSavings = contributions.reduce((sum: number, c: any) => sum + parseFloat(c.amount), 0);
    const monthlySavings = contributions
        .filter((c: any) => isThisMonth(c.date)) // Change c.date to c.created_at if your backend uses that
        .reduce((sum: number, c: any) => sum + parseFloat(c.amount), 0);

    const dailySavings = contributions
        .filter((c: any) => isToday(c.date))
        .reduce((sum: number, c: any) => sum + parseFloat(c.amount), 0);

    const dailyTransactions = transactions.filter((t) => isToday(t.date));

    const dailySpent = dailyTransactions
        .filter((t) => t.type === 'EXPENSE')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0) - dailySavings;

    // All-time totals
    const totalIncome = transactions
        .filter((t) => t.type === 'INCOME')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const totalExpenses = transactions
        .filter((t) => t.type === 'EXPENSE')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0) - totalSavings;

    // Monthly totals
    const monthlyTransactions = transactions.filter((t) => isThisMonth(t.date));

    const monthlyIncome = monthlyTransactions
        .filter((t) => t.type === 'INCOME')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const monthlyExpenses = monthlyTransactions
        .filter((t) => t.type === 'EXPENSE')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0) - monthlySavings;

    const categoryBreakdown = getCategoryBreakdown(transactions);

    return {
        transactions,
        isLoading,
        fetchTransactions: refetch,
        totalIncome,
        totalExpenses,
        monthlyIncome,
        monthlyExpenses,
        categoryBreakdown,
        totalSavings,
        dailySpent
    };
}