import { View, Text, Animated } from 'react-native';
import { Transaction } from '../../hooks/useCashFlow';
import { ActivityBlock } from './ActivityBlock';

import SubscriptionIcon from '../../../assets/icons/subscription_icon.svg';
import TransportIcon from '../../../assets/icons/transport_icon.svg';
import MembershipIcon from '../../../assets/icons/membership_icon.svg';
import DiningIcon from '../../../assets/icons/dining_icon.svg';
import ShoppingIcon from '../../../assets/icons/shopping_icon.svg';
import RentIcon from '../../../assets/icons/rent_icon.svg';
import EntertainmentIcon from '../../../assets/icons/entertainment_icon.svg';
import BillsIcon from '../../../assets/icons/bills_icon.svg';
import GroceriesIcon from '../../../assets/icons/groceries_icon.svg';

const CATEGORY_ICONS: Record<string, any> = {
    GROCERIES: GroceriesIcon,
    SUBSCRIPTIONS: SubscriptionIcon,
    ENTERTAINMENT: EntertainmentIcon,
    SHOPPING: ShoppingIcon,
    MEMBERSHIP: MembershipIcon,
    DINING: DiningIcon,
    TRANSPORTATION: TransportIcon,
    BILLS: BillsIcon,
    OTHER: EntertainmentIcon,
};

export default function RecentActivity({
    transactions = [],
    scrollX
}: {
    transactions: Transaction[];
    scrollX: Animated.Value; // Changed from SharedValue to Animated.Value
}) {
    const recentItems = transactions.slice(0, 4);

    return (
        <View className="mt-6 mb-4">
            <Text className="font-inter_black text-xl text-gray-900 mb-4">
                Recent Activity
            </Text>

            <View className="flex-row flex-wrap justify-between">
                {recentItems.map((item) => {
                    const IconComponent = CATEGORY_ICONS[item.category] || EntertainmentIcon;

                    return (
                        <ActivityBlock
                            key={item.id}
                            item={item}
                            IconComponent={IconComponent}
                            scrollX={scrollX}
                        />
                    );
                })}
            </View>
        </View>
    );
}