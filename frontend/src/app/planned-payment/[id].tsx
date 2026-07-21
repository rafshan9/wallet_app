// app/planned-payment/[id].tsx
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import api from '../../../utils/axios';
import { CATEGORY_STYLES, PaymentCategory } from '../../constants/paymentCategories';
import { usePlannedPayments } from '../../hooks/usePlannedPayments';

export default function PlannedPaymentDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [payment, setPayment] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { markPaid, deletePayment } = usePlannedPayments();


    useEffect(() => { fetchPayment(); }, [id]);

    const fetchPayment = async () => {
        try {
            const res = await api.get(`/planned-payments/${id}/`);
            setPayment(res.data);
        } catch (error) {
            console.error('Failed to fetch payment', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMarkPaid = async () => {
        try {
            await markPaid(id as string);
            router.back();
        } catch (error) {
            console.error('Failed to mark paid', error);
            Alert.alert('Something went wrong', 'Could not update this payment.');
        }
    };

    const handleDelete = () => {
        Alert.alert('Delete payment', `Remove "${payment.name}"? This can't be undone.`, [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete', style: 'destructive', onPress: async () => {
                    try {
                        await deletePayment(id as string);
                        router.back();
                    } catch (error) {
                        console.error('Failed to delete payment', error);
                        Alert.alert('Something went wrong', 'Could not delete this payment.');
                    }
                }
            },
        ]);
    };

    if (isLoading) {
        return (
            <View className="flex-1 bg-background justify-center items-center">
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (!payment) return null;

    const category: PaymentCategory = payment.category ?? 'other';
    const style = CATEGORY_STYLES[category];

    return (
        <View className="flex-1 bg-dark_blue pt-16 px-6">
            <View className="flex-row items-center justify-between mb-8">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-12 h-12 bg-white border-2 border-white rounded-full items-center justify-center shadow-sm"
                >
                    <Feather name="arrow-left" size={24} color="black" />
                </TouchableOpacity>
                <Text className="text-2xl text-white font-inter_bold mx-4 flex-1" numberOfLines={1}>{payment.name}</Text>
            </View>

            <View className={`p-6 rounded-3xl mb-8 border-2 border-dashed border-black ${style.bg}`}>
                <View className="h-14 w-14 rounded-full bg-white/20 justify-center items-center mb-4">
                    <Feather name={style.icon} size={24} color="white" />
                </View>
                <Text className="text-white/80 font-inter_medium text-sm mb-1 uppercase tracking-widest">Amount</Text>
                <Text className="text-white font-inter_bold text-4xl mb-6">
                    ${Number(payment.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </Text>
                <View className="flex-row justify-between">
                    <Text className="text-white/80 font-inter_medium text-sm">
                        Due: {new Date(payment.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </Text>
                    {payment.isRecurring && (
                        <Text className="text-white/80 font-inter_medium text-sm capitalize">{payment.frequency}</Text>
                    )}
                </View>
            </View>

            <TouchableOpacity onPress={handleMarkPaid} className="bg-yellow py-4 rounded-full items-center mb-3">
                <Text className="font-inter_bold">Mark as Paid</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleDelete} className="bg-red border-2 border-white/30 py-4 rounded-full items-center">
                <Text className="text-white font-inter_bold">Delete</Text>
            </TouchableOpacity>
        </View>
    );
}