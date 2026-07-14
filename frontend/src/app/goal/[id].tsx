import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import api from '../../../utils/axios';

type Contribution = {
    id: string;
    amount: string;
    date: string;
};

export default function GoalDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const [goal, setGoal] = useState<any>(null);
    const [contributions, setContributions] = useState<Contribution[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchGoalDetails();
    }, [id]);

    const fetchGoalDetails = async () => {
        try {
            const [goalRes, contributionsRes] = await Promise.all([
                api.get(`/goals/${id}/`),
                api.get(`/contributions/`)
            ]);

            setGoal(goalRes.data);

            // FRONTEND FILTER: Strictly keep only contributions linked to THIS goal
            const goalContributions = contributionsRes.data.filter(
                (tx: any) => String(tx.goal) === String(id) || String(tx.goal_id) === String(id)
            );

            setContributions(goalContributions);
        } catch (error) {
            console.error('Failed to fetch goal details', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <View className="flex-1 bg-background justify-center items-center">
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (!goal) return null;

    // 1. Safely extract the target amount (handling both camelCase and snake_case from Django)
    const target = parseFloat(goal.targetAmount || goal.target_amount || goal.target || '0');

    // 2. Calculate the saved amount directly from the contribution history to guarantee 100% accuracy
    const saved = contributions.reduce((sum, tx) => sum + parseFloat(tx.amount || '0'), 0);

    // 3. Safely calculate progress so it never divides by zero
    const progress = target > 0 ? Math.min(100, Math.max(0, (saved / target) * 100)) : 0;
    const isCompleted = target > 0 && saved >= target;


    return (
        <View className="flex-1 bg-very_dark_blue pt-16 px-6">

            {/* Custom Header */}
            <View className="flex-row items-center justify-between mb-8">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-12 h-12 bg-white border-2 border-white rounded-full items-center justify-center shadow-sm"
                >
                    <Feather name="arrow-left" size={24} color="black" />
                </TouchableOpacity>
                <Text className="text-2xl text-white font-rubik_bold mx-4 flex-1" numberOfLines={1}>{goal.name}</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

                {/* Main Stats Card */}
                <View className="p-6 bg-maroon rounded-3xl mb-8 border-2 border-dashed border-very_dark_blue shadow-sm">
                    <Text className="text-center text-sm font-rubik_medium text-white mb-2 uppercase tracking-widest">
                        Current Balance
                    </Text>
                    <Text className="text-center text-5xl font-rubik_bold text-white mb-8">
                        ${saved.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Text>

                    <View className="mb-2 flex-row justify-between">
                        <Text className="font-rubik_bold text-white">Progress</Text>
                        <Text className="font-rubik_bold text-white">{progress.toFixed(0)}%</Text>
                    </View>

                    <View className="h-4 bg-black/5 rounded-full overflow-hidden mb-4">
                        <View
                            className={`h-full rounded-full ${isCompleted ? 'bg-yellow' : 'bg-white'}`}
                            style={{ width: `${progress}%` }}
                        />
                    </View>

                    <View className="flex-row justify-between">
                        <Text className="text-sm font-rubik_medium text-white">Target: ${Number(goal.targetAmount).toLocaleString()}</Text>
                        {goal.deadline && (
                            <Text className="text-sm font-rubik_medium text-white">
                                Due: {new Date(goal.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </Text>
                        )}
                    </View>
                </View>

                {/* Contribution History */}
                <Text className="text-xl font-rubik_bold mb-4 text-white">Contribution History</Text>

                {contributions.length === 0 ? (
                    <Text className="text-center text-gray-400 font-rubik_medium py-8">No contributions yet.</Text>
                ) : (
                    contributions.map((tx) => (
                        <View key={tx.id} className="flex-row items-center bg-yellow p-4 rounded-3xl mb-4 border-2 border-black/10">
                            <View className="h-12 w-12 rounded-full bg-white/60 justify-center items-center mr-4">
                                <Feather name="arrow-up-right" size={20} color="#000000ff" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-lg font-rubik_medium">Added Funds</Text>
                                <Text className="text-sm font-rubik_regular text-black mt-1">
                                    {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                                </Text>
                            </View>
                            <Text className="text-lg font-rubik_bold text-black">
                                +${parseFloat(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </Text>
                        </View>
                    ))
                )}
            </ScrollView>
        </View>
    );
}