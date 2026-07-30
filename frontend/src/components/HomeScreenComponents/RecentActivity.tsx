import { View, Text } from 'react-native';
import { Transaction } from '../../hooks/useCashFlow';
import { ActivityBlock } from './ActivityBlock';

const CATEGORY_COLORS: Record<string, string> = {
    GROCERIES: '#E63946',
    SUBSCRIPTIONS: '#E63946',
    ENTERTAINMENT: '#FFB703',
    SHOPPING: '#0077B6',
    MEMBERSHIP: '#FFB703',
    DINING: '#FFB703',
    TRANSPORT: '#0077B6',
    BILLS: '#0077B6',
    INCOME: '#03045E',
    OTHER: '#0077B6',
};

export default function RecentActivity({
    transactions = []
}: {
    transactions: Transaction[];
}) {
    const recentItems = transactions.slice(0, 5);

    return (
        <View className="mt-6 mb-4">
            <Text className="font-jb_mono_bold text-xs uppercase tracking-wider text-neutral-500 mb-3">
                RECENT ACTIVITY
            </Text>

            <View className="flex-col gap-y-3">
                {recentItems.map((item) => {
                    const color = CATEGORY_COLORS[item.category?.toUpperCase()] || '#0077B6';
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