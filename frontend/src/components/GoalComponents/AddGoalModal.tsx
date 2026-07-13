import { View, Text, Modal, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import api from '../../../utils/axios';

type AddGoalModalProps = {
    visible: boolean;
    onClose: () => void;
};

const COLOR_OPTIONS = [
    { color: 'bg-red', text: 'text-white' },
    { color: 'bg-maroon', text: 'text-white' },
    { color: 'bg-dark_blue', text: 'text-white' },
    { color: 'bg-light_blue', text: 'text-black' },
    { color: 'bg-yellow', text: 'text-black' },
    { color: 'bg-orange', text: 'text-black' },
    { color: 'bg-teal', text: 'text-white' },
    { color: 'bg-green', text: 'text-white' },
    { color: 'bg-black', text: 'text-white' },
];

export default function AddGoalModal({ visible, onClose }: AddGoalModalProps) {
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        // Added validation to ensure a color is selected
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

            // Reset and close
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
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View className="flex-1 justify-end bg-black/80">
                <View className="bg-dark_blue w-full rounded-t-[40px] p-8">

                    <View className="flex-row justify-between items-center mb-8">
                        <Text className="text-3xl font-rubik_bold text-white">New Goal</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Feather name="x" size={28} color="white" />
                        </TouchableOpacity>
                    </View>

                    <TextInput
                        placeholder="Goal name"
                        value={name}
                        onChangeText={setName}
                        placeholderTextColor="rgba(255,255,255,0.5)"
                        className="text-2xl font-rubik_bold text-white mb-6"
                    />

                    <TextInput
                        placeholder="$0.00 target"
                        keyboardType="numeric"
                        value={targetAmount}
                        onChangeText={setTargetAmount}
                        placeholderTextColor="rgba(255,255,255,0.5)"
                        className="text-5xl font-rubik_bold text-white text-center mb-8"
                        style={{ lineHeight: 64, paddingTop: 8 }}
                    />

                    {/* Restored Color Picker UI */}
                    <Text className="text-white/60 font-rubik_medium text-sm mb-3">Choose a color</Text>
                    <View className="flex-row flex-wrap mb-8">
                        {COLOR_OPTIONS.map((opt) => {
                            const isSelected = selectedColor === opt.color;
                            return (
                                <TouchableOpacity
                                    key={opt.color}
                                    onPress={() => setSelectedColor(isSelected ? null : opt.color)}
                                    className={`${opt.color} h-11 w-11 rounded-full mr-3 mb-3 items-center justify-center border-2`}
                                    style={{ borderColor: isSelected ? 'white' : 'transparent' }}
                                >
                                    {isSelected && (
                                        <Feather name="check" size={16} color={opt.text === 'text-white' ? 'white' : 'black'} />
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
                                <Text className="text-white font-rubik_bold text-lg mr-2">Create Goal</Text>
                                <Feather name="check" size={20} color="white" />
                            </>
                        )}
                    </TouchableOpacity>

                </View>
            </View>
        </Modal>
    );
}