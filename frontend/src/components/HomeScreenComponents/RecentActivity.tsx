import { View, Text, Animated } from 'react-native';
import { Transaction } from '../../hooks/useCashFlow';
import { ActivityBlock } from './ActivityBlock';

// Replaced icons with vibrant colors matching your neo-brutalist reference
const CATEGORY_COLORS: Record<string, string> = {
    GROCERIES: '#D23E60',       // Blue
    SUBSCRIPTIONS: '#D23E60',    // Teal
    ENTERTAINMENT: '#D23E60',    // Pink
    SHOPPING: '#4775E9',        // Orange
    MEMBERSHIP: '#FFAE00',      // Purple
    DINING: '#FFAE00',          // Yellow
    TRANSPORTATION: '#4775E9',  // Blue
    BILLS: '#4775E9',           // Pink
    OTHER: '#4775E9',          // Orange
};

export default function RecentActivity({
    transactions = [],
    scrollX // Kept in the interface so the parent component doesn't break, but no longer passed to the child
}: {
    transactions: Transaction[];
    scrollX: Animated.Value;
}) {
    // 1. Slice to max 9 items
    const recentItems = transactions.slice(0, 9);

    return (
        <View className="mt-6 mb-4">
            <Text className="font-inter_black text-xl text-gray-900 mb-4">
                Recent Activity
            </Text>

            {/* 2. Changed to justify-start to allow the varying width pills to pack neatly from the left */}
            <View className="flex-row flex-wrap justify-start">
                {recentItems.map((item) => {
                    const color = CATEGORY_COLORS[item.category] || '#4361EE';

                    return (
                        <ActivityBlock
                            key={item.id}
                            item={item}
                            color={color}
                        />
                    );
                })}
            </View>
        </View>
    );
}