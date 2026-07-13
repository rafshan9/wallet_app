import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import GoalCard from '../../components/GoalComponents/GoalCard';
import AddGoalModal from '../../components/GoalComponents/AddGoalModal';
import AddContributionModal from '../../components/GoalComponents/AddContributionModal';
import CelebrationModal from '../../components/GoalComponents/CelebrationModal';
import { useGoals } from '../../hooks/useGoals';

export default function GoalScreen() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFundModalOpen, setIsFundModalOpen] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState<{ id: string; name: string } | null>(null);
    const [celebratingGoal, setCelebratingGoal] = useState<{ name: string; targetAmount: number } | null>(null);

    const { goals, isLoading, fetchGoals, deleteGoal, totalSaved, totalTarget, overallPercent } = useGoals();

    if (isLoading) {
        return (
            <View className="flex-1 bg-background justify-center items-center">
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-background pt-16">
            <View className="px-6 flex-row justify-between items-center mb-6">
                <Text className="text-3xl font-rubik_bold">Goals</Text>
            </View>

            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>
                <View className="bg-black rounded-3xl p-6 mb-8">
                    <Text className="text-white/60 font-rubik_medium text-sm mb-2">Total Saved</Text>
                    <Text className="text-white font-rubik_bold text-4xl mb-4">
                        ${totalSaved.toLocaleString()}
                    </Text>
                    <View className="h-3 bg-white/20 rounded-full overflow-hidden mb-2">
                        <View className="h-full bg-teal rounded-full" style={{ width: `${overallPercent}%` }} />
                    </View>
                    <Text className="text-white/60 font-rubik_medium text-xs">
                        ${totalSaved.toLocaleString()} of ${totalTarget.toLocaleString()} across {goals.length} goals
                    </Text>
                </View>

                <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-xl font-rubik_bold">Your Goals</Text>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => setIsModalOpen(true)} className="flex-row items-center bg-dark_blue border-2 border-black/40 rounded-full px-6 py-4">
                        <Feather name="plus" size={16} color="white" />
                        <Text className="text-sm font-rubik_bold text-white ml-1">Add New</Text>
                    </TouchableOpacity>
                </View>

                {goals.map((goal) => (
                    <GoalCard
                        key={goal.id}
                        goal={goal}
                        onAddPress={() => {
                            setSelectedGoal({ id: goal.id, name: goal.name });
                            setIsFundModalOpen(true);
                        }}
                        onDelete={deleteGoal}
                    />
                ))}
            </ScrollView>

            <AddGoalModal
                visible={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    fetchGoals();
                }}
            />

            <AddContributionModal
                visible={isFundModalOpen}
                goal={selectedGoal}
                onClose={async () => {
                    const goalId = selectedGoal?.id;
                    const previous = goals.find((g) => g.id === goalId);
                    const goalName = selectedGoal?.name ?? '';

                    setIsFundModalOpen(false);
                    setSelectedGoal(null);

                    const freshGoals = await fetchGoals();
                    const updated = freshGoals?.find((g) => g.id === goalId);

                    if (
                        previous &&
                        updated &&
                        previous.savedAmount < previous.targetAmount &&
                        updated.savedAmount >= updated.targetAmount
                    ) {
                        setCelebratingGoal({ name: goalName, targetAmount: updated.targetAmount });
                    }
                }}
            />

            <CelebrationModal
                visible={!!celebratingGoal}
                goalName={celebratingGoal?.name ?? ''}
                targetAmount={celebratingGoal?.targetAmount ?? 0}
                onClose={() => setCelebratingGoal(null)}
            />
        </View>
    );
}