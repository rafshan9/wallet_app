import { View, Text, Modal, TextInput, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import api from '../../../utils/axios';
import { useAppStore } from '../../store';
import { getCurrencySymbol } from '../../constants/currencyFormat';

type AddGoalModalProps = {
    visible: boolean;
    onClose: () => void;
};

const COLOR_OPTIONS = [
    { color: 'bg-black' },
    { color: 'bg-[#143D60]' },
    { color: 'bg-[#D10363]' },
    { color: 'bg-white' },
];

export default function AddGoalModal({ visible, onClose }: AddGoalModalProps) {
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { preferredCurrency } = useAppStore();
    const symbol = getCurrencySymbol(preferredCurrency);

    const handleSubmit = async () => {
        if (!name || !targetAmount || !selectedColor) {
            Alert.alert('Error', 'Please fill in all fields and select a color.');
            return;
        }

        setIsLoading(true);
        try {
            await api.post('/goals/', {
                name: name,
                target_amount: targetAmount.replace(/[^0-9.]/g, ''),
                color: selectedColor,
            });

            setName('');
            setTargetAmount('');
            setSelectedColor(null);
            onClose();
        } catch (error) {
            console.error('Failed to create goal:', error);
            Alert.alert('Error', 'Failed to create goal.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <KeyboardAvoidingView behavior="padding" className="flex-1 justify-end">
                <View className="flex-1 justify-end bg-black/80">
                    <View className="bg-background w-full rounded-t-[40px] p-8 border-2 border-black">

                        <View className="flex-row justify-between items-center mb-8">
                            <Text className="text-3xl text-black font-jb_mono_bold">New Goal</Text>
                            <TouchableOpacity
                                className="bg-yellow rounded-full p-2 border-2 border-black"
                                onPress={onClose}>
                                <Feather name="x" size={28} color="black" />
                            </TouchableOpacity>
                        </View>

                        <TextInput
                            placeholder="Goal name"
                            value={name}
                            onChangeText={setName}
                            placeholderTextColor="rgba(0, 0, 0, 0.5)"
                            className="text-2xl border font-jb_mono_medium border-2 border-black rounded-xl px-4 py-2 text-black font_jb_mono_bold mb-6"
                        />

                        <TextInput
                            placeholder={`${symbol}0.00`}
                            keyboardType="numeric"
                            placeholderTextColor="rgba(100, 100, 100, 0.5)"
                            scrollEnabled={false}
                            multiline={false}
                            value={targetAmount}
                            onChangeText={setTargetAmount}
                            className="text-5xl text-black font-jb_mono_bold text-center mb-8"
                            style={{ textAlignVertical: 'center', includeFontPadding: false, paddingVertical: 0, height: 80 }}
                            adjustsFontSizeToFit
                            numberOfLines={1}
                        />

                        <Text className="text-black font-jb_mono_bold text-sm mb-3">Choose a color</Text>
                        <View className="flex-row flex-wrap mb-8">
                            {COLOR_OPTIONS.map((opt) => {
                                const isSelected = selectedColor === opt.color;
                                return (
                                    <TouchableOpacity
                                        key={opt.color}
                                        onPress={() => setSelectedColor(isSelected ? null : opt.color)}
                                        className={`${opt.color} h-11 w-11 rounded-full border border-2 border-black mr-3 mb-3 items-center justify-center`}
                                        style={{ borderColor: isSelected ? 'white' : 'transparent' }}
                                    >
                                        {isSelected && (
                                            <Feather name="check" size={16} color={opt.color === 'bg-white' ? 'black' : 'white'} />
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        <TouchableOpacity
                            className="bg-maroon px-8 py-4 rounded-full flex-row items-center justify-center shadow-md border-2 border-black mt-8"
                            onPress={handleSubmit}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <>
                                    <Text className="text-white font-jb_mono_medium text-lg mr-2">Create Goal</Text>
                                    <Feather name="check" size={20} color="white" />
                                </>
                            )}
                        </TouchableOpacity>

                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}