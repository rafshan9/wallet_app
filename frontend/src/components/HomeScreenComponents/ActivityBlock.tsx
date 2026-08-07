import { View, Text } from 'react-native';
import { Transaction } from '../../hooks/useCashFlow';
import { useAppStore } from '../../store';
import { getCurrencySymbol } from '../../constants/currencyFormat';

export function ActivityBlock({ item, color }: { item: Transaction; color: string }) {
    const isIncome = item.type === 'INCOME' || Number(item.amount) > 0;
    const { preferredCurrency } = useAppStore();
    const symbol = getCurrencySymbol(preferredCurrency);
    const formattedAmount = `${isIncome ? '+' : '-'}${symbol}${Math.abs(Number(item.amount)).toLocaleString()}`;

    return (
        <View className="flex-row items-center justify-between bg-white border-2 border-black p-3.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            {/* Added flex-1 and mr-3 here so text constrains without squishing the amount */}
            <View className="flex-1 flex-row items-center gap-x-3 mr-3">
                {/* Dot */}
                <View
                    style={{ backgroundColor: color }}
                    className="w-4 h-4 rounded-full border-2 border-black flex-shrink-0"
                />

                <View className="flex-1">
                    {/* Changed to text-sm, leading-snug, and numberOfLines={2} */}
                    <Text numberOfLines={2} className="font-jb_mono_bold text-sm leading-snug text-black">
                        {item.title || item.category}
                    </Text>
                    <Text numberOfLines={1} className="font-jb_mono text-xs text-neutral-400 capitalize">
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