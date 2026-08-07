import { View, Text, Modal, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import api from '../../../utils/axios';
import { useAlert } from '../AlertModal';
import { useAppStore } from '../../store';
import { getCurrencySymbol } from '../../constants/currencyFormat';

type AddContributionModalProps = {
    visible: boolean;
    onClose: () => void;
    goal: { id: string; name: string } | null;
};

export default function AddContributionModal({ visible, onClose, goal }: AddContributionModalProps) {
    const [amount, setAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const showAlert = useAlert();
    const triggerRefresh = useAppStore((state) => state.triggerRefresh);
    const preferredCurrency = useAppStore((state) => state.preferredCurrency);
    const symbol = getCurrencySymbol(preferredCurrency);

    const handleSubmit = async () => {
        if (!amount || !goal) {
            showAlert({ title: 'Error', message: 'Please enter an amount.' });
            return;
        }

        setIsLoading(true);
        const parsedAmount = amount.replace(/[^0-9.]/g, '');

        try {
            await api.post(`/goals/${goal.id}/add_funds/`, {
                amount: parsedAmount,
            });

            setAmount('');
            onClose();
        } catch (error: any) {
            console.error('Failed to add funds:', error);
            if (error.code === 'ERR_NETWORK') {
                showAlert({ title: 'Connection hiccup', message: "Lost connection right after saving — checking if it went through." });
                onClose();
            } else {
                showAlert({ title: 'Error', message: 'Failed to process contribution.' });
            }
        } finally {
            setIsLoading(false);
            triggerRefresh();
        }
    };

    return (
        <Modal visible={visible} animationType="fade" transparent={true}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1 justify-center bg-black/80 px-6"
            >
                <View className="bg-dark_blue w-full rounded-[40px] p-8 border-2 border-black">
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="text-lg font-jb_mono_bold text-white">Add to {goal?.name}</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Feather name="x" size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                    <TextInput
                        placeholder={`${symbol}0.00`}
                        keyboardType="numeric"
                        value={amount}
                        onChangeText={setAmount}
                        placeholderTextColor="rgba(255,255,255,0.5)"
                        className="text-5xl font-jb_mono_bold text-white text-center mb-8"
                        style={{ lineHeight: 64, paddingTop: 8 }}
                        // @ts-expect-error - adjustsFontSizeToFit is not in React Native TextInput types but works on iOS
                        adjustsFontSizeToFit
                        numberOfLines={1}
                    />

                    <TouchableOpacity
                        className="bg-yellow px-8 py-4 rounded-full flex-row items-center justify-center shadow-md border-2 border-black"
                        onPress={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="black" />
                        ) : (
                            <Text className="text-black font-jb_mono_bold text-lg">Confirm Transfer</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}