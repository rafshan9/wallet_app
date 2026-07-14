import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
    const queryClient = useQueryClient();

    const { data: payments = [], isLoading, refetch } = useQuery<PlannedPayment[]>({
        queryKey: ['planned-payments'],
        queryFn: async () => {
            const res = await api.get('/planned-payments/');
            return res.data.map((p: any) => ({
                ...p,
                amount: parseFloat(p.amount),
            }));
        }
    });

    const markPaidMutation = useMutation({
        mutationFn: (id: string) => api.post(`/planned-payments/${id}/mark_paid/`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['planned-payments'] });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => api.delete(`/planned-payments/${id}/`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['planned-payments'] });
        }
    });

    const upcoming = [...payments]
        .filter((p) => !p.isPaid)
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

    const totalDueThisWeek = upcoming
        .filter((p) => (new Date(p.dueDate).getTime() - Date.now()) / (1000 * 3600 * 24) <= 7)
        .reduce((sum, p) => sum + p.amount, 0);

    return {
        payments,
        upcoming,
        isLoading,
        fetchPayments: refetch,
        markPaid: markPaidMutation.mutateAsync,
        deletePayment: deleteMutation.mutateAsync,
        totalDueThisWeek
    };
}