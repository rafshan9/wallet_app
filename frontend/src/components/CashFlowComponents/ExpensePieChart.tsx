import { View, Text } from 'react-native';

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
    return (
        <View className="mb-8 overflow-hidden">
            {/* Header */}
            <View className="flex-row items-center justify-between px-5 py-4">
                <Text className="font-jb_mono_bold text-sm text-black/50 tracking-widest uppercase">
                    Spending by category
                </Text>
                <Text className="font-alfa text-4xl text-black">
                    {total.split('.')[0]}
                </Text>
            </View>

            {/* Category rows */}
            <View className="px-5 py-5">
                {categories.map((cat, index) => {
                    const hasSpend = cat.amount > 0;

                    return (
                        <View
                            key={cat.label}
                            className={index === categories.length - 1 ? '' : 'mb-5'}
                        >
                            <View className="flex-row items-center justify-between mb-2">
                                <View className="flex-row items-center flex-1 pr-2">
                                    <View
                                        className="h-4 w-4 border-2 border-black mr-2.5"
                                        style={{ backgroundColor: cat.hex }}
                                    />
                                    <Text
                                        className="font-jb_mono_bold text-lg text-black"
                                        numberOfLines={1}
                                    >
                                        {cat.label}
                                    </Text>
                                </View>

                                <View className="flex-row items-baseline">
                                    <Text className="font-jb_mono_bold text-base text-black/40 mr-6">
                                        {hasSpend ? `${cat.percent}%` : '–'}
                                    </Text>
                                    <Text className="font-jb_mono_bold text-xl text-black">
                                        ${cat.amount.toFixed(0)}
                                    </Text>
                                </View>
                            </View>

                            <View className="h-3.5 border-[2.5px] border-black bg-[#D9D9D9] overflow-hidden">
                                <View
                                    className="h-full rounded-sm"
                                    style={{
                                        width: `${hasSpend ? cat.percent : 0}%`,
                                        backgroundColor: cat.hex,
                                    }}
                                />
                            </View>
                        </View>
                    );
                })}
            </View>
        </View>
    );
}