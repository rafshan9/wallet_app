import { useRef } from 'react';
import { Animated, View, ActivityIndicator } from 'react-native';
import WalletCard from './WalletCard';
import { useCashFlow } from '../../hooks/useCashFlow';
import { useGoals } from '../../hooks/useGoals';

const CARD_WIDTH = 288;

export default function CardSlider() {
    const { totalIncome, totalExpenses, isLoading: isCashFlowLoading } = useCashFlow();
    const { totalSaved, totalTarget, isLoading: isGoalsLoading } = useGoals();

    const scrollX = useRef(new Animated.Value(0)).current;

    const remainingFunds = totalIncome - totalExpenses - totalSaved;

    const formatCurrency = (amount: number) =>
        `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const CARDS_DATA = [
        {
            id: '1',
            title: 'Expenses',
            amount: formatCurrency(totalExpenses),
            subtitle: 'Total spent \nthis month',
            bgColor: 'bg-red',
        },
        {
            id: '2',
            title: 'Remaining Funds',
            amount: formatCurrency(remainingFunds),
            subtitle: `Total Deposited:\n${formatCurrency(totalIncome)}`,
            bgColor: 'bg-dark_blue',
        },
        {
            id: '3',
            title: 'Savings Goals',
            amount: formatCurrency(totalSaved),
            subtitle: `Total goals target:\n${formatCurrency(totalTarget)}`,
            bgColor: 'bg-yellow',
        },
    ];

    if (isCashFlowLoading || isGoalsLoading) {
        return (
            <View className="mt-4 mx-0 h-48 justify-center items-center">
                <ActivityIndicator size="large" color="#000000" />
            </View>
        );
    }

    return (
        <View className="mt-4 mx-0">
            <Animated.FlatList
                data={CARDS_DATA}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToAlignment="center"
                snapToInterval={CARD_WIDTH}
                decelerationRate="fast"
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: true }
                )}
                scrollEventThrottle={16}
                renderItem={({ item, index }) => {
                    const inputRange = [
                        (index - 1) * CARD_WIDTH,
                        index * CARD_WIDTH,
                        (index + 1) * CARD_WIDTH,
                    ];

                    const scale = scrollX.interpolate({
                        inputRange,
                        outputRange: [0.88, 1, 0.88],
                        extrapolate: 'clamp',
                    });

                    const opacity = scrollX.interpolate({
                        inputRange,
                        outputRange: [0.5, 1, 0.5],
                        extrapolate: 'clamp',
                    });

                    return (
                        <Animated.View style={{ transform: [{ scale }], opacity }}>
                            <WalletCard
                                title={item.title}
                                amount={item.amount}
                                subtitle={item.subtitle}
                                bgClass={item.bgColor}
                            />
                        </Animated.View>
                    );
                }}
                contentContainerStyle={{
                    paddingLeft: 24,
                    paddingRight: 24,
                }}
            />
        </View>
    );
}