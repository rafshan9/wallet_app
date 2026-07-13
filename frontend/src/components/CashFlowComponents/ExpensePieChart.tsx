import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useState } from 'react';

type CategoryBreakdown = {
    label: string;
    percent: number;
    amount: number;
    hex: string;
};

type ExpensePieChartProps = {
    total: string;
    categories: CategoryBreakdown[];
};

export default function ExpensePieChart({ total, categories }: ExpensePieChartProps) {
    const [rowWidth, setRowWidth] = useState(0);

    const chartColumnWidth = rowWidth * 0.7;
    const chartSize = Math.min(chartColumnWidth * 0.85, 200);
    const strokeWidth = chartSize * 0.22;
    const radius = (chartSize - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    let cumulativePercent = 0;

    return (
        <View
            className="bg-black rounded-2xl p-6 mb-8"
            onLayout={(e) => setRowWidth(e.nativeEvent.layout.width)}
        >
            <Text className="font-rubik_medium text-xs text-white/50 mb-4">Spending by category</Text>

            <View className="flex-row items-center">
                <View style={{ width: '70%' }} className="items-center justify-center">
                    {chartSize > 0 && (
                        <View style={{ width: chartSize, height: chartSize }}>
                            <View style={{ transform: [{ rotate: '-90deg' }] }}>
                                <Svg width={chartSize} height={chartSize}>
                                    <Circle
                                        cx={chartSize / 2}
                                        cy={chartSize / 2}
                                        r={radius}
                                        stroke="#333333"
                                        strokeWidth={strokeWidth}
                                        fill="none"
                                    />
                                    {categories.map((cat) => {
                                        const segmentLength = (cat.percent / 100) * circumference;
                                        const offset = -(cumulativePercent / 100) * circumference;
                                        cumulativePercent += cat.percent;

                                        return (
                                            <Circle
                                                key={cat.label}
                                                cx={chartSize / 2}
                                                cy={chartSize / 2}
                                                r={radius}
                                                stroke={cat.hex}
                                                strokeWidth={strokeWidth}
                                                strokeDasharray={`${segmentLength} ${circumference}`}
                                                strokeDashoffset={offset}
                                                strokeLinecap="butt"
                                                fill="none"
                                            />
                                        );
                                    })}
                                </Svg>
                            </View>

                            <View className="absolute inset-0 items-center justify-center">
                                <Text className="font-rubik_bold text-sm text-white">Total</Text>
                                <Text className="font-rubik_medium text-xs text-white/60">{total}</Text>
                            </View>
                        </View>
                    )}
                </View>

                <View style={{ width: '30%' }}>
                    {categories.map((cat) => (
                        <View key={cat.label} className="mb-3">
                            <View className="flex-row items-center mb-0.5">
                                <View
                                    className="h-2.5 w-2.5 rounded-full mr-1.5"
                                    style={{ backgroundColor: cat.hex }}
                                />
                                <Text className="font-rubik_medium text-xs text-white" numberOfLines={1}>{cat.label}</Text>
                            </View>
                            <Text className="font-rubik_regular text-xs text-white/50 ml-4">
                                ${cat.amount.toFixed(2)} · {cat.percent}%
                            </Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
}