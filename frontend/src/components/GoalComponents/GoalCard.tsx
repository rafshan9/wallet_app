import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';

type Goal = {
    id: string;
    name: string;
    targetAmount: number;
    savedAmount: number;
    color: string;
    deadline?: string;
};

type GoalCardProps = {
    goal: Goal;
    onAddPress: () => void;
    onDelete: (id: string) => void;
};

export default function GoalCard({ goal, onAddPress, onDelete }: GoalCardProps) {
    const percent = goal.targetAmount > 0 ? Math.min(100, Math.round((goal.savedAmount / goal.targetAmount) * 100)) : 0;

    const lightBackgrounds = ['bg-yellow', 'bg-light_blue', 'bg-orange', 'bg-teal'];
    const textColor = lightBackgrounds.includes(goal.color) ? 'text-black' : 'text-white';
    const isDark = textColor === 'text-white';

    const handleDelete = () => {
        Alert.alert(
            'Delete Goal',
            `Remove "${goal.name}"? This can't be undone.`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => onDelete(goal.id) },
            ]
        );
    };

    return (
        <View className={`${goal.color} rounded-3xl p-5 mb-4 border-2 border-dashed border-black`}>
            <View className="flex-row justify-between items-start mb-4">
                <View className="flex-1 mr-2">
                    <Text className={`font-rubik_bold text-lg ${textColor}`}>{goal.name}</Text>
                    {goal.deadline && (
                        <Text className={`font-rubik_regular text-xs mt-1 ${isDark ? 'text-white/70' : 'text-black/60'}`}>
                            {goal.deadline}
                        </Text>
                    )}
                </View>
                <View className="flex-row items-center gap-3">
                    <Text className={`font-rubik_bold text-base ${textColor}`}>{percent}%</Text>
                    <TouchableOpacity onPress={handleDelete} hitSlop={8}>
                        <Feather name="trash-2" size={16} color={isDark ? 'white' : 'black'} style={{ opacity: 0.5 }} />
                    </TouchableOpacity>
                </View>
            </View>

            <View
                className="h-3 rounded-full overflow-hidden mb-3"
                style={{ backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.1)' }}
            >
                <View
                    className={`h-full rounded-full ${isDark ? 'bg-white' : 'bg-black'}`}
                    style={{ width: `${percent}%` }}
                />
            </View>

            <View className="flex-row justify-between items-center">
                <Text className={`font-rubik_medium text-sm ${textColor}`}>
                    ${goal.savedAmount.toLocaleString()}
                    <Text className={isDark ? 'text-white/60' : 'text-black/50'}> of ${goal.targetAmount.toLocaleString()}</Text>
                </Text>
                <TouchableOpacity
                    onPress={onAddPress}
                    className={`px-3 py-1.5 rounded-full ${isDark ? 'bg-white/20' : 'bg-black/10'}`}
                >
                    <Feather name="plus" size={14} color={isDark ? 'white' : 'black'} />
                </TouchableOpacity>
            </View>
        </View>
    );
}