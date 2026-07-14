// hooks/usePlannedPayments.ts
import { useState, useEffect, useCallback } from 'react';
import api from '../../utils/axios';

export type PaymentCategory = 'housing' | 'subscription' | 'utility' | 'insurance' | 'transport' | 'other';

export type PlannedPayment = {
    id: string;
    name: string;
    amount: number;
    dueDate: string;
    category: PaymentCategory;
    isRecurring: boolean;
    frequency?: 'weekly' | 'monthly' | 'yearly' | null;
    isPaid: boolean;
};

export function usePlannedPayments() {
    const [payments, setPayments] = useState<PlannedPayment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPayments = useCallback(async () => {
        try {
            const res = await api.get('/planned-payments/');
            setPayments(res.data);
            return res.data as PlannedPayment[];
        } catch (error) {
            console.error('Failed to fetch planned payments', error);
        } finally {
            setIsLoading(false);
        }
    }, []);



    const markPaid = async (id: string) => {
        await api.post(`/planned-payments/${id}/mark_paid/`);
        fetchPayments();
    };

    const deletePayment = async (id: string) => {
        await api.delete(`/planned-payments/${id}/`);
        setPayments((prev) => prev.filter((p) => p.id !== id));
    };

    const upcoming = [...payments]
        .filter((p) => !p.isPaid)
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

    const totalDueThisWeek = upcoming
        .filter((p) => (new Date(p.dueDate).getTime() - Date.now()) / (1000 * 3600 * 24) <= 7)
        .reduce((sum, p) => sum + p.amount, 0);

    return { payments, upcoming, isLoading, fetchPayments, markPaid, deletePayment, totalDueThisWeek };
}