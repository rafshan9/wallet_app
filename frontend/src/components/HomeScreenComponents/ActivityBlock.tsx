import { View, Text } from 'react-native';
import { Transaction } from '../../hooks/useCashFlow';

export function ActivityBlock({ item, color }: { item: Transaction; color: string }) {
    const isIncome = item.type === 'INCOME' || Number(item.amount) > 0;
    const formattedAmount = `${isIncome ? '+' : '-'}$${Math.abs(Number(item.amount)).toLocaleString()}`;

    return (
        <View className="flex-row items-center justify-between bg-white border-2 border-black p-3.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <View className="flex-row items-center gap-x-3">
                {/* Category Dot */}
                <View
                    style={{ backgroundColor: color }}
                    className="w-4 h-4 rounded-full border-2 border-black"
                />

                <View>
                    <Text className="font-jb_mono_bold text-base text-black">
                        {item.title || item.category}
                    </Text>
                    <Text className="font-jb_mono text-xs text-neutral-400 capitalize">
                        {item.category.toLowerCase()}
                    </Text>
                </View>
            </View>

            <Text className={`font-jb_mono_bold text-base ${isIncome ? 'text-emerald-700' : 'text-black'}`}>
                {formattedAmount}
            </Text>
        </View>
    );
}