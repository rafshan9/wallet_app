import { View, Text, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useCashFlow } from '../hooks/useCashFlow';

const COLORS = [
    { bg: 'bg-dark_blue', text: 'text-white' },
    { bg: 'bg-yellow', text: 'text-black' },
    { bg: 'bg-red', text: 'text-white' },
    { bg: 'bg-maroon', text: 'text-white' },
    { bg: 'bg-green', text: 'text-white' },
];

const COLUMNS = 3;
const GAP = 8;

export default function RecentActivity() {
    const { transactions, isLoading } = useCashFlow();
    const [containerWidth, setContainerWidth] = useState(0);

    if (isLoading) {
        return (
            <View className="mt-8 justify-center items-center h-24">
                <ActivityIndicator size="small" color="#000000" />
            </View>
        );
    }

    const pillWidth = containerWidth > 0
        ? (containerWidth - GAP * (COLUMNS - 1)) / COLUMNS
        : undefined;

    const recentActivity = [...transactions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 6)
        .map(tx => {
            const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
            return { ...tx, colorStyle: randomColor };
        });

    return (
        <View className="mt-8 px-6">
            <Text className="text-xl font-rubik_bold mb-4">Recent Activity:</Text>

            <View
                className="flex-row flex-wrap justify-between"
                onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
            >
                {recentActivity.map((tx) => {
                    const amount = parseFloat(tx.amount);
                    const prefix = tx.type === 'INCOME' ? '+' : '';
                    const isGoal = tx.title.startsWith('Transferred to');
                    const displayText = isGoal
                        ? `Saving $${amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
                        : `${tx.title} ${prefix}$${amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

                    return (
                        <View
                            key={tx.id}
                            style={{ width: pillWidth }}
                            className={`rounded-full px-3 py-2 mb-3 border-2 border-black/80 items-center ${tx.colorStyle.bg}`}
                        >
                            <Text
                                numberOfLines={1}
                                className={`${tx.colorStyle.text} font-rubik_medium text-xs`}
                            >
                                {displayText}
                            </Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
}