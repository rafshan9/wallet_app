import { useState, useMemo } from 'react';
import {
    View, Text, Modal, TouchableOpacity,
    TextInput, FlatList, SafeAreaView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { CURRENCIES } from '../../constants/currencies';

type Props = {
    visible: boolean;
    onClose: () => void;
    onSelect: (code: string) => void;
    selected: string;
    title?: string;
};

export default function CurrencyPickerModal({ visible, onClose, onSelect, selected, title = 'Select Currency' }: Props) {
    const [query, setQuery] = useState('');

    const filtered = useMemo(() => {
        const q = query.toLowerCase().trim();
        if (!q) return CURRENCIES;
        return CURRENCIES.filter(
            (c) => c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)
        );
    }, [query]);

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <SafeAreaView className="flex-1 bg-black/70 justify-end">
                <View className="bg-background rounded-t-[32px] border-2 border-black" style={{ maxHeight: '85%' }}>
                    {/* Header */}
                    <View className="flex-row items-center justify-between px-6 pt-6 pb-4 border-b-2 border-black">
                        <Text className="text-xl font-jb_mono_bold text-black">{title}</Text>
                        <TouchableOpacity
                            onPress={() => { setQuery(''); onClose(); }}
                            className="w-10 h-10 bg-yellow border-2 border-black rounded-full items-center justify-center"
                        >
                            <Feather name="x" size={20} color="black" />
                        </TouchableOpacity>
                    </View>

                    {/* Search */}
                    <View className="px-6 py-3 border-b-2 border-black">
                        <View className="flex-row items-center bg-white border-2 border-black rounded-2xl px-4">
                            <Feather name="search" size={18} color="gray" />
                            <TextInput
                                value={query}
                                onChangeText={setQuery}
                                placeholder="Search currency..."
                                placeholderTextColor="#888"
                                autoCapitalize="none"
                                autoCorrect={false}
                                className="flex-1 ml-3 py-3 font-jb_mono_medium text-black text-base"
                            />
                        </View>
                    </View>

                    {/* List */}
                    <FlatList
                        data={filtered}
                        keyExtractor={(item) => item.code}
                        keyboardShouldPersistTaps="handled"
                        renderItem={({ item }) => {
                            const isSelected = item.code === selected;
                            return (
                                <TouchableOpacity
                                    onPress={() => { setQuery(''); onSelect(item.code); onClose(); }}
                                    className={`flex-row items-center justify-between px-6 py-4 border-b border-black/10 ${isSelected ? 'bg-yellow' : ''}`}
                                    activeOpacity={0.7}
                                >
                                    <View className="flex-row items-center flex-1">
                                        <Text className="text-lg font-jb_mono_bold text-black w-14">{item.code}</Text>
                                        <Text className="font-jb_mono_medium text-black/70 text-sm flex-1">{item.name}</Text>
                                    </View>
                                    <View className="flex-row items-center gap-2">
                                        <Text className="font-jb_mono_bold text-black">{item.symbol}</Text>
                                        {isSelected && <Feather name="check" size={18} color="black" />}
                                    </View>
                                </TouchableOpacity>
                            );
                        }}
                    />
                </View>
            </SafeAreaView>
        </Modal>
    );
}
