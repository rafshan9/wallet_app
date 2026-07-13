import { FlatList, View, ActivityIndicator } from 'react-native';
import WalletCard from './WalletCard';
import { useCashFlow } from '../../hooks/useCashFlow'; // Adjust path if needed
import { useGoals } from '../../hooks/useGoals';       // Adjust path if needed

export default function CardSlider() {
    const { totalIncome, totalExpenses, isLoading: isCashFlowLoading } = useCashFlow();
    const { totalSaved, totalTarget, isLoading: isGoalsLoading } = useGoals();

    // Calculate what's left in the wallet
    const remainingFunds = totalIncome - totalExpenses - totalSaved;

    // Helper to format currency
    const formatCurrency = (amount: number) =>
        `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const CARDS_DATA = [
        {
            id: '1',
            title: 'Expenses',
            amount: formatCurrency(totalExpenses),
            subtitle: 'Total spent \nthis month',
            bgColor: 'bg-yellow',
        },
        {
            id: '2',
            title: 'Remaining Funds',
            amount: formatCurrency(remainingFunds),
            subtitle: `Total Deposited:\n${formatCurrency(totalIncome)}`,
            bgColor: 'bg-red',
        },
        {
            id: '3',
            title: 'Savings Goals',
            amount: formatCurrency(totalSaved),
            subtitle: `Total goals target:\n${formatCurrency(totalTarget)}`,
            bgColor: 'bg-dark_blue',
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
            <FlatList
                data={CARDS_DATA}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToAlignment="center"
                snapToInterval={288}
                decelerationRate="fast"
                renderItem={({ item }) => (
                    <WalletCard
                        title={item.title}
                        amount={item.amount}
                        subtitle={item.subtitle}
                        bgClass={item.bgColor}
                    />
                )}
                contentContainerStyle={{
                    paddingLeft: 24,
                    paddingRight: 24
                }}
            />
        </View>
    );
}