import { Animated, View, Text, useWindowDimensions } from 'react-native';
import { useCashFlow } from '../../hooks/useCashFlow';
import { useGoals } from '../../hooks/useGoals';
import { CARD_BACKGROUND_COLORS } from '../../constants/cardColors';

type Props = {
    scrollX: Animated.Value;
};

export default function CardSlider({ scrollX }: Props) {
    const { width: SCREEN_WIDTH } = useWindowDimensions();
    const { totalIncome, totalExpenses, transactions } = useCashFlow();
    const { totalSaved, totalTarget } = useGoals();

    const remainingFunds = totalIncome - totalExpenses - totalSaved;

    const isToday = (dateStr: string) => {
        const d1 = new Date(dateStr);
        const d2 = new Date();
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    };

    const todayExpenses = transactions
        .filter((t) => t.type === 'EXPENSE' && isToday(t.date))
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const currentDay = new Date().getDate();
    const avgDailyExpense = totalExpenses / currentDay;

    const formatCurrency = (amount: number) =>
        `$${Math.floor(amount).toLocaleString()}`;

    const formatExact = (amount: number) =>
        `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const CARDS_DATA = [
        {
            id: '1',
            title: 'Remaining Funds',
            amount: formatCurrency(remainingFunds),
            subtitle: `Deposited this month: ${formatCurrency(totalIncome)}`,
            isLight: false,
            amountColorClass: 'text-background',
        },
        {
            id: '2',
            title: 'Saving Goals',
            amount: formatCurrency(totalSaved),
            subtitle: `Total goals target: ${formatCurrency(totalTarget)}`,
            isLight: true,
            amountColorClass: 'text-black',
        },
        {
            id: '3',
            title: 'Monthly Expenses',
            amount: formatCurrency(totalExpenses),
            subtitle: `Total spent this month\nAvg Daily: ${formatExact(avgDailyExpense)} • Today: ${formatExact(todayExpenses)}`,
            isLight: false,
            amountColorClass: 'text-background_green',
        },
    ];

    const inputRange = CARDS_DATA.map((_, i) => i * SCREEN_WIDTH);

    const animatedBgColor = scrollX.interpolate({
        inputRange,
        outputRange: CARD_BACKGROUND_COLORS,
    });

    const animatedDotColor = scrollX.interpolate({
        inputRange,
        outputRange: CARDS_DATA.map((c) => (c.isLight ? '#000000' : '#FFFFFF')),
    });

    return (
        <Animated.View
            style={{ backgroundColor: animatedBgColor }}
            className="border-b-4 border-black  "
        >
            <Animated.FlatList
                data={CARDS_DATA}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                removeClippedSubviews={false}
                showsHorizontalScrollIndicator={false}
                decelerationRate="fast"
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
                renderItem={({ item }) => (
                    <View style={{ width: SCREEN_WIDTH }} className="px-6 h-[240px] justify-center">
                        <Text
                            className={`font-jb_mono_bold text-lg uppercase tracking-widest mb-1 ${item.isLight ? 'text-black' : 'text-white/80'
                                }`}
                        >
                            {item.title}
                        </Text>

                        <Text
                            className={`font-alfa text-[64px] leading-[72px] mb-2 ${item.amountColorClass}`}
                            numberOfLines={1}
                            adjustsFontSizeToFit
                        >
                            {item.amount}
                        </Text>

                        <Text
                            className={`font-jb_mono text-sm leading-relaxed ${item.isLight ? 'text-black' : 'text-white/90'
                                }`}
                        >
                            {item.subtitle}
                        </Text>
                    </View>
                )}
            />

            <View className="flex-row justify-center items-center pb-4 gap-3">
                {CARDS_DATA.map((_, index) => {
                    const dotInputRange = [
                        (index - 1) * SCREEN_WIDTH,
                        index * SCREEN_WIDTH,
                        (index + 1) * SCREEN_WIDTH,
                    ];
                    const dotWidth = scrollX.interpolate({
                        inputRange: dotInputRange,
                        outputRange: [8, 20, 8],
                        extrapolate: 'clamp',
                    });
                    const dotOpacity = scrollX.interpolate({
                        inputRange: dotInputRange,
                        outputRange: [0.4, 1, 0.4],
                        extrapolate: 'clamp',
                    });
                    return (
                        <Animated.View
                            key={index}
                            style={{
                                width: dotWidth,
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: animatedDotColor,
                                opacity: dotOpacity,
                            }}
                        />
                    );
                })}
            </View>
        </Animated.View>
    );
}