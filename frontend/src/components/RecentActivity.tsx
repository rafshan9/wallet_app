import { View, Text } from 'react-native';

const ACTIVITIES = [
    { id: '1', label: 'Groceries shopping $50', bgColor: 'bg-dark_blue' },
    { id: '2', label: 'Football', bgColor: 'bg-yellow' },
    { id: '3', label: 'Netflix', bgColor: 'bg-red' },
    { id: '4', label: 'Netflix', bgColor: 'bg-yellow' },
    { id: '5', label: 'Football', bgColor: 'bg-red' },
    { id: '6', label: 'Monthly Subscription', bgColor: 'bg-teal' },
];

export default function RecentActivity() {
    return (
        <View className="mt-8">
            <Text className="text-xl font-rubik_bold mb-4">Recent Activity:</Text>

            {/* flex-wrap forces items to the next line when they hit the edge */}
            <View className="flex-row flex-wrap">
                {ACTIVITIES.map((item) => (
                    <View
                        key={item.id}
                        className={`rounded-full px-5 py-2 mr-3 mb-3 border-2 border-black/80 ${item.bgColor}`}                    >
                        <Text className="text-white font-rubik_medium">{item.label}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}