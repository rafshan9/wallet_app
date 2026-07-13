import { useState, useEffect } from 'react';
import api from '../../utils/axios';

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
    deadline?: string;
};


export function useGoals() {
    const [goals, setGoals] = useState<UIGoal[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchGoals = async () => {
        try {
            const response = await api.get('/goals/'); // Ensure this endpoint exists in your Django urls.py

            const formattedGoals: UIGoal[] = response.data.map((g: ApiGoal) => ({
                id: g.id,
                name: g.name,
                targetAmount: parseFloat(g.target_amount),
                savedAmount: parseFloat(g.current_amount || '0'),
                color: g.color,
                textColor: 'text-white',
                deadline: 'Ongoing',
            }));
            setGoals(formattedGoals);
        } catch (error) {
            console.error('Failed to fetch goals:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchGoals();
    }, []);

    const totalSaved = goals.reduce((sum, g) => sum + g.savedAmount, 0);
    const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
    const overallPercent = totalTarget > 0 ? Math.min(100, Math.round((totalSaved / totalTarget) * 100)) : 0;

    return { goals, isLoading, fetchGoals, totalSaved, totalTarget, overallPercent };
}