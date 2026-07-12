import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useState } from 'react';

type CategoryBreakdown = {
    label: string;
    percent: number;
    color: string; // tailwind class, used for the legend dot
    hex: string;    // actual color value, used to draw the pie slice
};

type ExpensePieChartProps = {
    total: string;
    categories: CategoryBreakdown[];
};

export default function ExpensePieChart({ total, categories }: ExpensePieChartProps) {
    const [rowWidth, setRowWidth] = useState(0);

    const chartColumnWidth = rowWidth * 0.7;
    const chartSize = Math.min(chartColumnWidth * 0.85, 200);
    const strokeWidth = chartSize * 0.28;
    const radius = (chartSize - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    let cumulativePercent = 0;

    return (
        <View
            className="flex-row items-center bg-black rounded-2xl p-6 mb-8"
            onLayout={(e) => setRowWidth(e.nativeEvent.layout.width)}
        >
            {/* Pie Chart — 70% */}
            <View style={{ width: '70%' }} className="items-center justify-center">
                {chartSize > 0 && (
                    <View style={{ width: chartSize, height: chartSize }}>
                        <View style={{ transform: [{ rotate: '-90deg' }] }}>
                            <Svg width={chartSize} height={chartSize}>
                                <Circle
                                    cx={chartSize / 2}
                                    cy={chartSize / 2}
                                    r={radius}
                                    stroke="#e5e5e5"
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
                                            fill="none"
                                        />
                                    );
                                })}
                            </Svg>
                        </View>

                        <View className="absolute inset-0 items-center justify-center">
                            <Text className="font-rubik_bold text-sm text-white">Total</Text>
                            <Text className="font-rubik_medium text-xs text-white">{total}</Text>
                        </View>
                    </View>
                )}
            </View>

            {/* Legend — 30% */}
            <View style={{ width: '30%' }}>
                {categories.map((cat) => (
                    <View key={cat.label} className="flex-row items-center justify-between mb-3">
                        <View className="flex-row items-center flex-shrink">
                            <View className={`h-2.5 w-2.5 rounded-full ${cat.color} mr-1.5`} />
                            <Text className="font-rubik_medium text-xs text-white" numberOfLines={1}>{cat.label}</Text>
                        </View>
                        <Text className="font-rubik_bold text-xs text-white ml-1">{cat.percent}%</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}