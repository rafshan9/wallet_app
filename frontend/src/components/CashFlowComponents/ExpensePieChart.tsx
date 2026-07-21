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
    const chartColumnWidth = rowWidth * 0.4;
    const chartSize = Math.min(chartColumnWidth * 0.85, 200);
    const outerRadius = chartSize / 2;
    const strokeWidth = outerRadius;
    const radius = strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;

    let cumulativePercent = 0;

    return (
        <View
            className="bg-black rounded-2xl p-6 mb-8"
            onLayout={(e) => setRowWidth(e.nativeEvent.layout.width)}
        >
            <Text className="font-inter_bold text-lg text-white p-2 mb-4">Spending by category</Text>

            <View className="flex-row items-center justify-between">
                <View className="items-center justify-center">
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
                        </View>
                    )}
                </View>
                <View className="flex-1 pl-8 justify-center">
                    <Text className="font-inter_bold text-xl text-white/60 mb-2">Total</Text>
                    <Text className="font-alfa text-5xl text-[#FDE047]">
                        {total.split('.')[0]}
                    </Text>
                </View>
            </View>

            <View className="flex-row flex-wrap justify-start w-full mt-6 px-2 gap-y-4">
                {categories.map((cat) => (
                    <View key={cat.label} className="w-[50%] pr-2">
                        <View className="flex-row items-center mb-1">
                            <View
                                className="h-2.5 w-2.5 rounded-full mr-1.5"
                                style={{ backgroundColor: cat.hex }}
                            />
                            <Text
                                className="font-inter_bold text-sm text-white flex-1"
                                numberOfLines={1}
                            >
                                {cat.label}
                            </Text>
                        </View>
                        <Text
                            className="font-inter_bold text-[10px] text-background_green ml-4"
                            numberOfLines={1}
                        >
                            ${cat.amount.toFixed(2)} · {cat.percent}%
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
}