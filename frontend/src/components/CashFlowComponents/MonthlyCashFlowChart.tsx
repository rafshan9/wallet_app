import { View, Text } from 'react-native';
import { useAppStore } from '../../store';
import { getCurrencySymbol } from '../../constants/currencyFormat';

type MonthlyCashFlowChartProps = {
    deposited: number;
    expense: number;
    savings: number;
};

export default function MonthlyCashFlowChart({ deposited, expense, savings }: MonthlyCashFlowChartProps) {
    const { preferredCurrency } = useAppStore();
    const symbol = getCurrencySymbol(preferredCurrency);
    const net = deposited - expense;
    const isPositive = net >= 0;

    const segments = [
        { label: 'Income', value: deposited, hex: '#12a95bff' },
        { label: 'Expenses', value: expense, hex: '#ffe313ff' },
        { label: 'Savings', value: savings, hex: '#fefefeff' },
    ];

    return (
        <View className="mt-8 bg-black p-10 mb-8">
            <Text className="font-jb_mono_bold text-md text-white mb-1">This month · net</Text>
            <Text
                className={isPositive ? 'text-background font-jb_mono_bold text-4xl mb-5' : 'text-red font-alfa text-5xl mb-5'}
            >
                {isPositive ? '+' : '-'}{symbol}{Math.abs(net).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>

            {/* Segmented bar */}
            <View className="flex-row h-3 rounded-full overflow-hidden mb-5">
                {segments.map((seg) => (
                    <View
                        key={seg.label}
                        style={{ flex: Math.max(seg.value, 0.01), backgroundColor: seg.hex }}
                    />
                ))}
            </View>

            {/* Stat chips */}
            <View className="flex-row justify-between gap-4">
                {segments.map((seg) => (
                    <View key={seg.label} className="flex-1">
                        <View className="flex-row items-center mb-1">
                            <View className="h-2 w-2 rounded-full mr-1.5" style={{ backgroundColor: seg.hex }} />
                            <Text className="font-jb_mono_bold text-s text-background">{seg.label}</Text>
                        </View>
                        <Text className="font-jb_mono_medium text-xs text-background ml-3">
                            {symbol}{seg.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
}