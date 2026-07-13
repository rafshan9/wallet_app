import { View, Text, Modal, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import api from '../../../utils/axios';

type AddContributionModalProps = {
    visible: boolean;
    onClose: () => void;
    goal: { id: string; name: string } | null;
};

export default function AddContributionModal({ visible, onClose, goal }: AddContributionModalProps) {
    const [amount, setAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (!amount || !goal) {
            Alert.alert('Error', 'Please enter an amount.');
            return;
        }

        setIsLoading(true);
        const parsedAmount = amount.replace(/[^0-9.]/g, '');

        try {
            // 1. Add to the savings goal
            await api.post('/contributions/', { // Note: ensure this endpoint exists in Django!
                goal: goal.id,
                amount: parsedAmount,
            });

            // 2. Deduct from cash flow by logging it as an expense
            await api.post('/transactions/', {
                type: 'EXPENSE',
                amount: parsedAmount,
                title: `Transferred to ${goal.name}`,
                category: 'OTHER',
            });

            setAmount('');
            onClose();
        } catch (error) {
            console.error('Failed to add funds:', error);
            Alert.alert('Error', 'Failed to process contribution.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal visible={visible} animationType="fade" transparent={true}>
            <View className="flex-1 justify-center bg-black/80 px-6">
                <View className="bg-dark_blue w-full rounded-[40px] p-8 border-2 border-black">
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="text-2xl font-rubik_bold text-white">Add to {goal?.name}</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Feather name="x" size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                    <TextInput
                        placeholder="$0.00"
                        keyboardType="numeric"
                        value={amount}
                        onChangeText={setAmount}
                        placeholderTextColor="rgba(255,255,255,0.5)"
                        className="text-5xl font-rubik_bold text-white text-center mb-8"
                        style={{ lineHeight: 64, paddingTop: 8 }}
                    />

                    <TouchableOpacity
                        className="bg-yellow px-8 py-4 rounded-full flex-row items-center justify-center shadow-md border-2 border-black"
                        onPress={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="black" />
                        ) : (
                            <Text className="text-black font-rubik_bold text-lg">Confirm Transfer</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}