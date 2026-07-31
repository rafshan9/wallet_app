import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { PlannedPayment } from '../../hooks/usePlannedPayments';
import { useState } from 'react';

function checkIsDueThisWeek(dueDate: string) {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));
    return diffDays >= 0 && diffDays <= 7;
}

type Props = {
    payments: PlannedPayment[];
    totalPlanned: number;
    onPressPayment: (id: string) => void;
    onAddPress: () => void;
};

export default function PlannedPaymentsCard({
    payments,
    totalPlanned,
    onPressPayment,
    onAddPress,
}: Props) {
    const [expanded, setExpanded] = useState(false);
    const visible = expanded ? payments : payments.slice(0, 7);

    return (
        <View className="mt-6 mb-4">
            {/* Header */}
            <Text className="font-jb_mono_bold text-xs uppercase tracking-wider text-neutral-500 mb-3">
                PLANNED PAYMENTS
            </Text>

            {/* Main Outer Neo-Brutalist Card */}
            <View className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                {payments.length > 0 && (
                    <View className="mb-4 pb-3 border-b-2 border-black flex-row justify-between items-center">
                        <Text className="font-jb_mono_bold text-sm text-black">
                            Total Planned
                        </Text>
                        <Text className="font-jb_mono_bold text-base text-black">
                            ${totalPlanned.toLocaleString()}
                        </Text>
                    </View>
                )}

                {/* Total Summary Row */}
                {/* {totalDueThisWeek > 0 && (
                    <View className="mb-4 pb-3 border-b-2 border-black flex-row justify-between items-center">
                        <Text className="font-jb_mono_bold text-sm text-black">
                            Due This Week
                        </Text>
                        <Text className="font-jb_mono_bold text-base text-black">
                            ${totalDueThisWeek.toLocaleString()}
                        </Text>
                    </View>
                )} */}

                {/* Items Container */}
                <View className="flex-col gap-y-3">
                    {visible.length === 0 ? (
                        <Text className="font-jb_mono text-xs text-neutral-400 text-center py-2">
                            No scheduled payments.
                        </Text>
                    ) : (
                        visible.map((payment) => {
                            const isDueThisWeek = checkIsDueThisWeek(payment.dueDate);
                            const cardBg = isDueThisWeek ? 'bg-[#F4C753]' : 'bg-white';

                            return (
                                <TouchableOpacity
                                    key={payment.id}
                                    onPress={() => onPressPayment(payment.id)}
                                    className={`flex-row items-center justify-between border-2 border-black p-3.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${cardBg}`}
                                >
                                    <View className="flex-row items-center gap-x-2">
                                        {isDueThisWeek && (
                                            <Feather name="alert-triangle" size={14} color="black" />
                                        )}
                                        <Text className="font-jb_mono_bold text-sm text-black">
                                            {isDueThisWeek ? 'Due this week' : payment.name}
                                        </Text>
                                    </View>

                                    <Text className="font-jb_mono_bold text-sm text-black">
                                        ${payment.amount.toLocaleString()} {isDueThisWeek ? payment.name : ''}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })
                    )}
                </View>

                {/* Actions */}
                <View className="mt-4 flex-row gap-x-3">
                    <TouchableOpacity
                        onPress={onAddPress}
                        className="flex-1 bg-black p-3 items-center justify-center"
                    >
                        <Text className="font-jb_mono_bold text-xs text-white uppercase">
                            + Add Payment
                        </Text>
                    </TouchableOpacity>

                    {payments.length > 7 && (
                        <TouchableOpacity
                            onPress={() => setExpanded((prev) => !prev)}
                            className="bg-white border-2 border-black px-4 py-3 flex-row items-center justify-center gap-x-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        >
                            <Text className="font-jb_mono_bold text-xs text-black uppercase">
                                {expanded ? 'Show Less' : 'View All'}
                            </Text>
                            <Feather name={expanded ? 'chevron-up' : 'chevron-down'} size={14} color="black" />
                        </TouchableOpacity>
                    )}
                </View>

            </View>
        </View>
    );
}