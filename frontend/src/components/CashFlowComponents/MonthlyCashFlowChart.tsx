import { View, Text } from 'react-native';

type MonthlyCashFlowChartProps = {
    deposited: number;
    expense: number;
    savings: number;
};

export default function MonthlyCashFlowChart({ deposited, expense, savings }: MonthlyCashFlowChartProps) {
    const net = deposited - expense;
    const isPositive = net >= 0;

    const segments = [
        { label: 'Income', value: deposited, hex: '#25ffffff' },
        { label: 'Expenses', value: expense, hex: '#ffe313ff' },
        { label: 'Savings', value: savings, hex: '#aaff0cff' },
    ];

    return (
        <View className="bg-black rounded-2xl p-10 mb-8">
            <Text className="font-inter_bold text-md text-white mb-1">This month · net</Text>
            <Text
                className={isPositive ? 'text-yellow font-alfa text-5xl mb-5' : 'text-red font-alfa text-5xl mb-5'}
            >
                {isPositive ? '+' : '-'}${Math.abs(net).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                            <Text className="font-inter_medium text-s text-white/60">{seg.label}</Text>
                        </View>
                        <Text className="font-inter_black text-sm text-background_green">
                            ${seg.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
}