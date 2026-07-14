import { useState, useEffect } from 'react';
import api from '../../utils/axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Matches what Django sends

type ApiGoal = {
    id: string;
    name: string;
    target_amount: string;
    current_amount: string;
    color: string;
    created_at: string;

};



// Matches what your UI needs
export type UIGoal = {
    id: string;
    name: string;
    targetAmount: number;
    savedAmount: number;
    color: string;
    textColor: string;
    deadline?: string;

};

export function useGoals() {
    const { data: goals = [], isLoading, refetch } = useQuery<UIGoal[]>({
        queryKey: ['goals'],
        queryFn: async () => {
            const response = await api.get('/goals/');
            return response.data.map((g: ApiGoal) => ({
                id: g.id,
                name: g.name,
                targetAmount: parseFloat(g.target_amount),
                savedAmount: parseFloat(g.current_amount || '0'),
                color: g.color,
                textColor: 'text-white',
                deadline: 'Ongoing',
            }));
        }
    });
    const queryClient = useQueryClient();
    const deleteMutation = useMutation({
        mutationFn: (id: string) => api.delete(`/goals/${id}/`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['goals'] });
        }
    });

    const totalSaved = goals.reduce((sum: number, g: UIGoal) => sum + g.savedAmount, 0);
    const totalTarget = goals.reduce((sum: number, g: UIGoal) => sum + g.targetAmount, 0);
    const overallPercent = totalTarget > 0 ? Math.min(100, Math.round((totalSaved / totalTarget) * 100)) : 0;

    return {
        goals,
        isLoading,
        fetchGoals: refetch,
        deleteGoal: deleteMutation.mutate,
        totalSaved,
        totalTarget,
        overallPercent
    };
}