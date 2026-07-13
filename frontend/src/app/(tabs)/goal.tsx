import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import GoalCard from '../../components/GoalComponents/GoalCard';
import AddGoalModal from '../../components/GoalComponents/AddGoalModal';

type Goal = {
    id: string;
    name: string;
    targetAmount: number;
    savedAmount: number;
    color: string;
    textColor: string;
    deadline?: string;
};


const DUMMY_GOALS: Goal[] = [
    { id: '1', name: 'Japan Trip', targetAmount: 5000, savedAmount: 3200, color: 'bg-teal', textColor: 'text-white', deadline: 'Dec 2026' },
    { id: '2', name: 'Emergency Fund', targetAmount: 10000, savedAmount: 6500, color: 'bg-dark_blue', textColor: 'text-white', deadline: 'Ongoing' },
    { id: '3', name: 'New Car', targetAmount: 15000, savedAmount: 2100, color: 'bg-orange', textColor: 'text-white', deadline: 'Jun 2027' },
    { id: '4', name: 'New Laptop', targetAmount: 2000, savedAmount: 2000, color: 'bg-green', textColor: 'text-white' },
];

export default function GoalScreen() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const totalSaved = DUMMY_GOALS.reduce((sum, g) => sum + g.savedAmount, 0);
    const totalTarget = DUMMY_GOALS.reduce((sum, g) => sum + g.targetAmount, 0);
    const overallPercent = Math.min(100, Math.round((totalSaved / totalTarget) * 100));

    return (
        <View className="flex-1 bg-background pt-16">

            {/* Header */}
            <View className="px-6 flex-row justify-between items-center mb-6">
                <Text className="text-3xl font-rubik_bold">Goals</Text>
                <TouchableOpacity className="h-12 w-12 bg-black rounded-full justify-center items-center">
                    <Feather name="filter" size={20} color="white" />
                </TouchableOpacity>
            </View>

            <ScrollView
                className="flex-1 px-6"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 140 }}
            >
                {/* Overview Card */}
                <View className="bg-black rounded-3xl p-6 mb-8">
                    <Text className="text-white/60 font-rubik_medium text-sm mb-2">Total Saved</Text>
                    <Text className="text-white font-rubik_bold text-4xl mb-4">
                        ${totalSaved.toLocaleString()}
                    </Text>

                    <View className="h-3 bg-white/20 rounded-full overflow-hidden mb-2">
                        <View
                            className="h-full bg-teal rounded-full"
                            style={{ width: `${overallPercent}%` }}
                        />
                    </View>

                    <Text className="text-white/60 font-rubik_medium text-xs">
                        ${totalSaved.toLocaleString()} of ${totalTarget.toLocaleString()} across {DUMMY_GOALS.length} goals
                    </Text>
                </View>

                {/* Section Header + Add New */}
                <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-xl font-rubik_bold">Your Goals</Text>
                    {/* Add New Button */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => setIsModalOpen(true)}
                        className="flex-row items-center bg-dark_blue border-2 border-black/40 rounded-full px-6 py-4"
                    >
                        <Feather name="plus" size={16} color="white" />
                        <Text className="text-sm font-rubik_bold text-white ml-1">Add New</Text>
                    </TouchableOpacity>
                </View>

                {/* Goal Cards */}
                {DUMMY_GOALS.map((goal) => (
                    <GoalCard key={goal.id} goal={goal} />
                ))}
            </ScrollView>

            <AddGoalModal visible={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </View>
    );
}