import { View, Text, Modal, TextInput, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { CATEGORIES } from '../../constants/categories';

type AddExpenseModalProps = {
    visible: boolean;
    onClose: () => void;
};


export default function AddExpenseModal({ visible, onClose }: AddExpenseModalProps) {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View className="flex-1 justify-end bg-black/80">
                <View className="bg-very_dark_blue w-full rounded-t-[40px] p-8 border-2 border-black ">

                    <View className="flex-row justify-between items-center mb-8">
                        <Text className="text-3xl font-rubik_bold text-white">New Expense</Text>
                        <TouchableOpacity
                            className="rounded-full border-2 border-black p-2 bg-yellow"
                            onPress={onClose}>
                            <Feather name="x" size={28} color="black" />
                        </TouchableOpacity>
                    </View>

                    <TextInput
                        placeholder="$0.00"
                        keyboardType="numeric"
                        className="text-6xl font-rubik_bold text-white text-center mb-8"
                        style={{ lineHeight: 64, paddingTop: 8 }}
                    />

                    <TextInput
                        placeholder="What was this for?"
                        className="bg-white px-6 py-4 rounded-2xl border-2 border-black font-rubik_medium text-lg mb-6"
                    />

                    {/* Category Pills */}
                    <View className="flex-row flex-wrap mb-6">
                        {CATEGORIES.map((cat) => {
                            const isSelected = selectedCategory === cat.label;
                            return (
                                <TouchableOpacity
                                    key={cat.label}
                                    onPress={() => setSelectedCategory(isSelected ? null : cat.label)}
                                    className={`${cat.color} flex-row items-center px-4 py-2 rounded-full mr-2 mb-2 border-2`}
                                    style={{
                                        borderColor: isSelected ? 'white' : 'black',
                                        opacity: !selectedCategory || isSelected ? 1 : 0.4,
                                    }}
                                >
                                    {isSelected && (
                                        <Feather
                                            name="check"
                                            size={14}
                                            color={cat.text === 'text-white' ? 'white' : 'black'}
                                            style={{ marginRight: 4 }}
                                        />
                                    )}
                                    <Text className={`font-rubik_medium text-sm ${cat.text}`}>{cat.label}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <View className="flex-row justify-between items-center mb-8">
                        <View className="flex-row gap-4">
                            <TouchableOpacity className="h-14 w-14 bg-yellow rounded-full justify-center items-center border-2 border-black shadow-sm">
                                <Feather name="camera" size={24} color="black" />
                            </TouchableOpacity>

                            <TouchableOpacity className="h-14 w-14 bg-yellow rounded-full justify-center items-center border-2 border-black shadow-sm">
                                <Feather name="mic" size={24} color="black" />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            className="bg-maroon px-8 py-4 rounded-full flex-row items-center shadow-md border-2 border-black"
                            onPress={onClose}
                        >
                            <Text className="text-white font-rubik_bold text-lg mr-2">Add</Text>
                            <Feather name="check" size={20} color="white" />
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </Modal>
    );
}