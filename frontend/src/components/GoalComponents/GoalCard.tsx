import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

type Goal = {
    id: string;
    name: string;
    targetAmount: number;
    savedAmount: number;
    color: string;
    textColor: string;
    deadline?: string;
};

type GoalCardProps = {
    goal: Goal;
};

export default function GoalCard({ goal }: GoalCardProps) {
    const percent = Math.min(100, Math.round((goal.savedAmount / goal.targetAmount) * 100));
    const isDark = goal.textColor === 'text-white';

    return (
        <View className={`${goal.color} rounded-3xl p-5 mb-4 border-2 border-dashed border-black`}>
            <View className="flex-row justify-between items-start mb-4">
                <View className="flex-1 mr-2">
                    <Text className={`font-rubik_bold text-lg ${goal.textColor}`}>{goal.name}</Text>
                    {goal.deadline && (
                        <Text className={`font-rubik_regular text-xs mt-1 ${isDark ? 'text-white/70' : 'text-black/60'}`}>
                            {goal.deadline}
                        </Text>
                    )}
                </View>
                <Text className={`font-rubik_bold text-base ${goal.textColor}`}>{percent}%</Text>
            </View>

            <View className={`h-3 rounded-full overflow-hidden mb-3 ${isDark ? 'bg-black/20' : 'bg-black/10'}`}>
                <View
                    className={`h-full rounded-full ${isDark ? 'bg-white' : 'bg-black'}`}
                    style={{ width: `${percent}%` }}
                />
            </View>

            <View className="flex-row justify-between items-center">
                <Text className={`font-rubik_medium text-sm ${goal.textColor}`}>
                    ${goal.savedAmount.toLocaleString()}
                    <Text className={isDark ? 'text-white/60' : 'text-black/50'}> of ${goal.targetAmount.toLocaleString()}</Text>
                </Text>
                <TouchableOpacity className={`px-3 py-1.5 rounded-full ${isDark ? 'bg-white/20' : 'bg-black/10'}`}>
                    <Feather name="plus" size={14} color={isDark ? 'white' : 'black'} />
                </TouchableOpacity>
            </View>
        </View>
    );
}