import { View, Text, Animated } from 'react-native';
import { useState } from 'react';
import { Transaction } from '../../hooks/useCashFlow';
import { ActivityBlock } from './ActivityBlock';

const CATEGORY_COLORS: Record<string, string> = {
    GROCERIES: '#D23E60',
    SUBSCRIPTIONS: '#D23E60',
    ENTERTAINMENT: '#D23E60',
    SHOPPING: '#4775E9',
    MEMBERSHIP: '#FFAE00',
    DINING: '#FFAE00',
    TRANSPORT: '#4775E9',
    BILLS: '#4775E9',
    OTHER: '#4775E9',
};

const HORIZONTAL_PADDING = 16;
const GAP = 12;

export default function RecentActivity({
    transactions = [],
    scrollX
}: {
    transactions: Transaction[];
    scrollX: Animated.Value;
}) {
    const [rowWidth, setRowWidth] = useState(0);
    const recentItems = transactions.slice(0, 9);

    const innerWidth = rowWidth - HORIZONTAL_PADDING;
    const maxItemWidth = rowWidth > 0 ? Math.floor((innerWidth - GAP * 2) / 3) - 1 : undefined;

    return (
        <View className="mt-6 mb-4">
            <Text className="font-inter_black text-xl text-gray-900 mb-4">
                Recent Activity
            </Text>

            <View
                className="flex-row flex-wrap px-2 gap-x-3 gap-y-4"
                onLayout={(e) => setRowWidth(e.nativeEvent.layout.width)}
            >
                {recentItems.map((item) => {
                    const color = CATEGORY_COLORS[item.category] || '#4361EE';

                    return (
                        <ActivityBlock
                            key={item.id}
                            item={item}
                            color={color}
                            maxWidth={maxItemWidth}
                        />
                    );
                })}
            </View>
        </View>
    );
}