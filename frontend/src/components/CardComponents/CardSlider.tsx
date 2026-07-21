import { Animated, View, ActivityIndicator, useWindowDimensions } from 'react-native';
import WalletCard from './WalletCard';
import { useCashFlow } from '../../hooks/useCashFlow';
import { useGoals } from '../../hooks/useGoals';
import { CARD_BACKGROUND_COLORS } from '../../constants/cardColors';

type Props = {
    scrollX: Animated.Value;
};

export default function CardSlider({ scrollX }: Props) {
    const { width: SCREEN_WIDTH } = useWindowDimensions();
    const { totalIncome, totalExpenses, isLoading: isCashFlowLoading } = useCashFlow();
    const { totalSaved, totalTarget, isLoading: isGoalsLoading } = useGoals();

    const remainingFunds = totalIncome - totalExpenses - totalSaved;

    const formatCurrency = (amount: number) =>
        `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const CARDS_DATA = [
        {
            id: '1',
            title: 'Remaining Funds',
            amount: formatCurrency(remainingFunds),
            subtitle: `Total Deposited this month:\n${formatCurrency(totalIncome)}`,
            isLight: false,
            amountColorClass: 'text-yellow',
        },
        {
            id: '2',
            title: 'Saving Goals',
            amount: formatCurrency(totalSaved),
            subtitle: `Total goals target:\n${formatCurrency(totalTarget)}`,
            isLight: true,
            amountColorClass: 'text-black',
        },
        {
            id: '3',
            title: 'Monthly Expenses',
            amount: formatCurrency(totalExpenses),
            subtitle: 'Total spent\nthis month',
            isLight: false,
            amountColorClass: 'text-background_green',
        },
    ];

    if (isCashFlowLoading || isGoalsLoading) {
        return (
            <View className="mt-4 h-64 justify-center items-center">
                <ActivityIndicator size="large" color="#000000" />
            </View>
        );
    }

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
        <Animated.View style={{ backgroundColor: animatedBgColor }}>
            <Animated.FlatList
                data={CARDS_DATA}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                decelerationRate="fast"
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
                renderItem={({ item }) => (
                    <View style={{ width: SCREEN_WIDTH }}>
                        <WalletCard
                            title={item.title}
                            amount={item.amount}
                            subtitle={item.subtitle}
                            isLight={item.isLight}
                            amountColorClass={item.amountColorClass}
                        />
                    </View>
                )}
            />

            <View className="flex-row justify-center items-center pb-5 gap-2">
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