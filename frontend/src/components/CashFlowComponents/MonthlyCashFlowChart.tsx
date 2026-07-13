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
        { label: 'Income', value: deposited, hex: '#fde905ff' },
        { label: 'Expenses', value: expense, hex: '#00bfffff' },
        { label: 'Savings', value: savings, hex: '#b81461ff' },
    ];

    return (
        <View className="bg-very_dark_blue rounded-2xl p-6 mb-8">
            <Text className="font-rubik_medium text-xs text-white/50 mb-1">This month · net</Text>
            <Text
                className="font-rubik_bold text-3xl mb-5"
                style={{ color: isPositive ? '#ffffff' : '#F87171' }}
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
            <View className="flex-row justify-between">
                {segments.map((seg) => (
                    <View key={seg.label} className="flex-1">
                        <View className="flex-row items-center mb-1">
                            <View className="h-2 w-2 rounded-full mr-1.5" style={{ backgroundColor: seg.hex }} />
                            <Text className="font-rubik_medium text-xs text-white/60">{seg.label}</Text>
                        </View>
                        <Text className="font-rubik_bold text-sm text-white">
                            ${seg.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
}