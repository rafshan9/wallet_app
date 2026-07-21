import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import GoalCard from '../../components/GoalComponents/GoalCard';
import AddGoalModal from '../../components/GoalComponents/AddGoalModal';
import AddContributionModal from '../../components/GoalComponents/AddContributionModal';
import CelebrationModal from '../../components/GoalComponents/CelebrationModal';
import { useGoals } from '../../hooks/useGoals';
import TopBar from '../../components/TopBar';
import PlusIcon from '../../../assets/icons/plus_white.svg';

const BAR_COLORS = ['#34d399', '#0eff66ff', '#ffde0fff', '#3b08f7ff', '#f43f5e', '#fb923c', '#a855f7'];

export default function GoalScreen() {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFundModalOpen, setIsFundModalOpen] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState<{ id: string; name: string } | null>(null);
    const [celebratingGoal, setCelebratingGoal] = useState<{ name: string; targetAmount: number } | null>(null);

    const { goals, isLoading, fetchGoals, deleteGoal, totalSaved, totalTarget } = useGoals();

    if (isLoading) {
        return (
            <View className="flex-1 bg-background justify-center items-center">
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    // 1. Split Goals into Active and Completed
    const activeGoals = goals.filter((g) => g.savedAmount < g.targetAmount);
    const completedGoals = goals.filter((g) => g.savedAmount >= g.targetAmount);

    return (
        <View className="flex-1 bg-background_green pt-16">
            <TopBar />

            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>

                {/* 2. Overview Card with Segmented Bar */}
                <View className="bg-black rounded-3xl p-6 mb-8">
                    <Text className="text-white/60 font-inter_medium text-sm mb-2">Total Saved</Text>
                    <Text className="text-white font-inter_bold text-4xl mb-4">
                        ${totalSaved.toLocaleString()}
                    </Text>
                    <View className="h-3 bg-white/20 rounded-full overflow-hidden mb-2 flex-row">
                        {goals.length > 0 ? (
                            goals.map((g, index) => {
                                const widthPercent = totalTarget > 0 ? (g.savedAmount / totalTarget) * 100 : 0;
                                return (
                                    <View
                                        key={g.id}
                                        style={{
                                            width: `${widthPercent}%`,
                                            backgroundColor: BAR_COLORS[index % BAR_COLORS.length]
                                        }}
                                        className="h-full border-r border-black/20"
                                    />
                                );
                            })
                        ) : (
                            <View className="h-full bg-teal rounded-full" style={{ width: '0%' }} />
                        )}
                    </View>
                    <Text className="text-white/60 font-inter_medium text-xs">
                        ${totalSaved.toLocaleString()} of ${totalTarget.toLocaleString()} across {goals.length} goals
                    </Text>
                </View>

                {/* Header & Add Button */}
                <View className="flex-row justify-between items-center mb-6">
                    <Text className="text-xl font-inter_bold">Your Goals</Text>
                    {goals.length > 0 && (
                        <TouchableOpacity activeOpacity={0.8} onPress={() => setIsModalOpen(true)} className="flex-row items-center bg-black border-2 border-black/40 rounded-full px-6 py-4">
                            <PlusIcon width={14} height={14} />
                            <Text className="text-sm font-inter_bold text-white ml-1">Add New</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* 3. Empty State Handling */}
                {goals.length === 0 ? (
                    <View className="items-center justify-center py-12 mt-4 bg-white rounded-3xl ">
                        <View className="h-20 w-20 bg-black/5 rounded-full justify-center items-center mb-4">
                            <Feather name="target" size={32} color="black" />
                        </View>
                        <Text className="text-xl font-inter_bold text-black mb-2">No goals yet</Text>
                        <Text className="text-gray-500 font-inter_medium text-center mb-6 px-8">
                            Set a target and start tracking your savings journey today.
                        </Text>
                        <TouchableOpacity onPress={() => setIsModalOpen(true)} className="bg-black px-8 py-4 rounded-full">
                            <Text className="text-white font-inter_bold">Create Your First Goal</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        {/* 4. Active Goals List (Wrapped in TouchableOpacity for Routing) */}
                        {activeGoals.length > 0 && (
                            <View className="mb-4">
                                <Text className="text-sm font-inter_bold text-black mb-4 uppercase tracking-wider">In Progress</Text>
                                {activeGoals.map((goal) => (
                                    <TouchableOpacity key={goal.id} activeOpacity={0.9} onPress={() => router.push(`/goal/${goal.id}`)}>
                                        <GoalCard
                                            goal={goal}
                                            onAddPress={() => {
                                                setSelectedGoal({ id: goal.id, name: goal.name });
                                                setIsFundModalOpen(true);
                                            }}
                                            onDelete={deleteGoal}
                                        />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        {/* 5. Completed Goals List */}
                        {completedGoals.length > 0 && (
                            <View className="mt-4">
                                <Text className="text-sm font-inter_bold mb-4 uppercase tracking-wider">Completed</Text>
                                {completedGoals.map((goal) => (
                                    <TouchableOpacity key={goal.id} activeOpacity={0.9} onPress={() => router.push(`/goal/${goal.id}`)}>
                                        <GoalCard
                                            goal={goal}
                                            onAddPress={() => {
                                                setSelectedGoal({ id: goal.id, name: goal.name });
                                                setIsFundModalOpen(true);
                                            }}
                                            onDelete={deleteGoal}
                                        />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </>
                )}
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

                    const response = await fetchGoals();
                    const updated = response.data?.find((g) => g.id === goalId);

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