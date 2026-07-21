import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';

type ScannedItem = { name: string; amount: number; category: string; };

interface AiReviewModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: (items: ScannedItem[]) => void;
    scannedData: ScannedItem[];
}

export default function AiReviewModal({ visible, onClose, onConfirm, scannedData }: AiReviewModalProps) {
    const [items, setItems] = useState<ScannedItem[]>([]);

    useEffect(() => {
        if (scannedData) setItems(scannedData);
    }, [scannedData]);

    const updateItemAmount = (index: number, newAmount: string) => {
        const updated = [...items];
        updated[index].amount = parseFloat(newAmount) || 0;
        setItems(updated);
    };

    return (
        <Modal transparent visible={visible} animationType="slide">
            <View className="flex-1 bg-black/80 justify-end">
                <View className="bg-[#F9F9F9] w-full rounded-t-3xl p-6 h-[80%]">
                    <Text className="text-xl font-inter_bold text-black mb-4">Review Receipt</Text>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {items.map((item, index) => (
                            <View key={index} className="flex-row justify-between items-center mb-4 bg-white p-3 rounded-xl">
                                <View className="flex-1">
                                    <Text className="font-bold text-black">{item.name}</Text>
                                    <Text className="text-gray-500 text-xs">{item.category}</Text>
                                </View>

                                <TextInput
                                    keyboardType="numeric"
                                    value={item.amount.toString()}
                                    onChangeText={(val) => updateItemAmount(index, val)}
                                    className="bg-gray-100 p-2 rounded-lg text-right font-bold min-w-[80px]"
                                />
                            </View>
                        ))}
                    </ScrollView>

                    <View className="flex-row justify-between mt-4">
                        <TouchableOpacity onPress={onClose} className="px-6 py-3 rounded-full bg-gray-300">
                            <Text className="font-bold text-black">Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => onConfirm(items)} className="px-6 py-3 rounded-full bg-black">
                            <Text className="font-bold text-white">Save All</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}