import { FlatList, View } from 'react-native';
import WalletCard from './WalletCard';

const CARDS_DATA = [
    {
        id: '1',

        title: 'Total Expenses',
        amount: '$15,000',
        subtitle: 'This Month:\n$3,200',
        bgColor: 'bg-yellow', // Yellow (Update to match your Figma)
    },
    {
        id: '2',
        title: 'Remaining Funds',
        amount: '$50,000',
        subtitle: 'Total Deposited:\n$65,000',
        bgColor: 'bg-red', // Red
    },
    {
        id: '3',
        title: 'Active Trades',
        amount: '$12,450',
        subtitle: '24h PNL:\n+$450.00',
        bgColor: 'bg-dark_blue', // Green (Update to match your Figma)
    },
];

export default function CardSlider() {
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