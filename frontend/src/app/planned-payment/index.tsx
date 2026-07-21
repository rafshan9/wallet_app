import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { usePlannedPayments } from '../../hooks/usePlannedPayments';
import { CATEGORY_STYLES, PaymentCategory } from '../../constants/paymentCategories';

function getStatus(dueDate: string) {
    const days = Math.ceil((new Date(dueDate).getTime() - Date.now()) / (1000 * 3600 * 24));
    if (days < 0) return { label: 'Overdue', color: 'text-red-500' };
    if (days <= 3) return { label: 'Due soon', color: 'text-amber-500' };
    return { label: 'Upcoming', color: 'text-gray-400' };
}

export default function AllPlannedPaymentsScreen() {
    const router = useRouter();
    const { upcoming, isLoading } = usePlannedPayments();

    if (isLoading) {
        return (
            <View className="flex-1 bg-background justify-center items-center">
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-very_dark_blue pt-16 px-6">
            <View className="flex-row items-center mb-8">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-12 h-12 bg-yellow border-2 border-black rounded-full items-center justify-center shadow-sm"
                >
                    <Feather name="arrow-left" size={24} color="black" />
                </TouchableOpacity>
                <Text className="text-2xl font-inter_bold mx-4 text-white">All Payments</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {upcoming.length === 0 ? (
                    <Text className="text-gray-400 font-inter_medium text-center py-8">Nothing scheduled.</Text>
                ) : (
                    upcoming.map((payment) => {
                        const style = CATEGORY_STYLES[payment.category as PaymentCategory] ?? CATEGORY_STYLES.other;
                        const status = getStatus(payment.dueDate);
                        return (
                            <TouchableOpacity
                                key={payment.id}
                                onPress={() => router.push(`/planned-payment/${payment.id}`)}
                                className="flex-row items-center bg-background p-4 rounded-3xl mb-3 border-2 border-black border-dashed"
                            >
                                <View className={`w-10 h-10 rounded-full ${style.bg} items-center justify-center mr-3`}>
                                    <Feather name={style.icon} size={16} color="white" />
                                </View>
                                <View className="flex-1">
                                    <Text className="font-inter_medium text-base">{payment.name}</Text>
                                    <Text className="font-inter_regular text-xs text-gray-400">
                                        {payment.isRecurring ? `${payment.frequency} · ` : ''}
                                        {new Date(payment.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </Text>
                                </View>
                                <View className="items-end">
                                    <Text className="font-inter_bold text-sm">${payment.amount.toLocaleString()}</Text>
                                    <Text className={`font-inter_medium text-[10px] ${status.color}`}>{status.label}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })
                )}
            </ScrollView>
        </View>
    );
}