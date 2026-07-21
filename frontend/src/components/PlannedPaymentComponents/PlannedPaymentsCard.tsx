// components/PlannedPaymentsCard.tsx
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { PlannedPayment } from '../../hooks/usePlannedPayments';

const CATEGORY_STYLES: Record<string, { icon: keyof typeof Feather.glyphMap; bg: string }> = {
    housing: { icon: 'home', bg: 'bg-dark_blue' },
    subscription: { icon: 'tv', bg: 'bg-teal' },
    utility: { icon: 'zap', bg: 'bg-yellow' },
    insurance: { icon: 'shield', bg: 'bg-orange' },
    transport: { icon: 'truck', bg: 'bg-light_blue' },
    other: { icon: 'credit-card', bg: 'bg-maroon' },
};

function getStatus(dueDate: string) {
    const days = Math.ceil((new Date(dueDate).getTime() - Date.now()) / (1000 * 3600 * 24));
    if (days < 0) return { label: 'Overdue', color: 'text-red-500' };
    if (days <= 3) return { label: 'Due soon', color: 'text-amber-500' };
    return { label: 'Upcoming', color: 'text-gray-400' };
}

type Props = {
    payments: PlannedPayment[];
    totalDueThisWeek: number;
    onPressPayment: (id: string) => void;
    onAddPress: () => void;
    onViewAll: () => void;
};

export default function PlannedPaymentsCard({ payments, totalDueThisWeek, onPressPayment, onAddPress, onViewAll }: Props) {
    const visible = payments.slice(0, 4);
    const remaining = payments.length - visible.length;

    return (
        <View className="bg-white rounded-3xl p-5 mb-8 border-2 border-black border-dashed">
            <TouchableOpacity
                onPress={onViewAll}
                className="flex-row justify-between items-center mb-4"
            >
                <Text className="font-inter_bold text-lg">Upcoming Payments</Text>
                <View className="flex-row items-center">
                    <Text className="font-inter_medium text-xs text-gray-400">
                        ${totalDueThisWeek.toLocaleString()} due this week
                    </Text>
                    <Feather name="chevron-right" size={16} color="#9CA3AF" style={{ marginLeft: 4 }} />
                </View>
            </TouchableOpacity>

            {visible.length === 0 ? (
                <Text className="text-gray-400 font-inter_medium text-center py-4">Nothing scheduled.</Text>
            ) : (
                visible.map((payment) => {
                    const style = CATEGORY_STYLES[payment.category] ?? CATEGORY_STYLES.other;
                    const status = getStatus(payment.dueDate);
                    return (
                        <TouchableOpacity
                            key={payment.id}
                            onPress={() => onPressPayment(payment.id)}
                            className="flex-row items-center py-3 border-t border-black/5"
                        >
                            <View className={`w-10 h-10 rounded-full ${style.bg} items-center justify-center mr-3`}>
                                <Feather name={style.icon} size={16} color="white" />
                            </View>
                            <View className="flex-1">
                                <Text className="font-inter_medium text-lg">{payment.name}</Text>
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

            {remaining > 0 && (
                <TouchableOpacity onPress={onViewAll} className="flex-row items-center justify-center py-2">
                    <Text className="font-inter_medium text-xs text-gray-400">
                        +{remaining} more
                    </Text>
                    <Feather name="chevron-right" size={12} color="#9CA3AF" style={{ marginLeft: 2 }} />
                </TouchableOpacity>
            )}

            <TouchableOpacity onPress={onAddPress} className="mt-4 bg-dark_blue py-3 rounded-full items-center">
                <Text className="text-white p-2 font-inter_bold text-md">Add Payment</Text>
            </TouchableOpacity>
        </View>
    );
}