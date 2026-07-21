import { View, Text, TouchableOpacity } from 'react-native';
import { Transaction } from '../../hooks/useCashFlow';

const CATEGORY_HEX: Record<string, string> = {
    GROCERIES: '#0eff66',
    SUBSCRIPTIONS: '#34d399',
    ENTERTAINMENT: '#ffde0f',
    SHOPPING: '#3b08f7',
    MEMBERSHIP: '#f43f5e',
    DINING: '#fb923c',
    OTHER: '#a855f7',
};

export default function RecentActivity({ transactions = [] }: { transactions: Transaction[] }) {
    // Get only the 4 most recent transactions
    const recentItems = transactions.slice(0, 4);

    return (
        <View className="mt-6 mb-4">
            <Text className="font-inter_700Bold text-xl text-gray-900 mb-4">
                Recent Activity
            </Text>

            <View className="flex-row flex-wrap justify-between">
                {recentItems.map((item) => {
                    const hexColor = CATEGORY_HEX[item.category] || '#888888';

                    return (
                        <TouchableOpacity
                            key={item.id}
                            className="w-[48%] aspect-square rounded-3xl p-4 mb-4 justify-between"
                            style={{ backgroundColor: `${hexColor}20` }} // 20 hex = 12% opacity
                        >
                            {/* Icon Placeholder */}
                            <View
                                className="w-10 h-10 rounded-full items-center justify-center"
                                style={{ backgroundColor: `${hexColor}40` }}
                            />

                            <View>
                                <Text className="font-inter_500Medium text-gray-600 text-xs mb-1">
                                    {item.category}
                                </Text>
                                <Text className="font-inter_700Bold text-gray-900 text-sm" numberOfLines={1}>
                                    {item.title}
                                </Text>
                                <Text className="font-inter_900Black text-gray-900 text-lg mt-1">
                                    {item.type === 'EXPENSE' ? '-' : '+'}${item.amount}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}