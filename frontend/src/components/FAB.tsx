import { View, TouchableOpacity, Animated, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useState, useRef } from 'react';
import AddFundModal from './CashFlowComponents/AddFundModal';
import NoteModal from './NoteComponents/NoteModal';
import { useAppStore } from '../store';
import { useNotes } from '../hooks/useNotes';

export default function FAB() {
    const [isOpen, setIsOpen] = useState(false);
    const animation = useRef(new Animated.Value(0)).current;
    const {
        isAddModalOpen, openModal, closeModal, triggerRefresh,
        isNoteModalOpen, editingNote, openNoteModal, closeNoteModal,
    } = useAppStore();
    const { createNote, updateNote } = useNotes();

    const toggleMenu = () => {
        const toValue = isOpen ? 0 : 1;
        Animated.spring(animation, {
            toValue,
            useNativeDriver: true,
            friction: 5,
        }).start();
        setIsOpen(!isOpen);
    };

    const handleSaveNote = async (content: string) => {
        if (editingNote) await updateNote({ id: editingNote.id, content });
        else await createNote(content);
    };

    const rotation = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '45deg']
    });

    const item1Style = {
        transform: [
            { scale: animation },
            { translateY: animation.interpolate({ inputRange: [0, 1], outputRange: [0, -96] }) }
        ],
        opacity: animation
    };

    const item2Style = {
        transform: [
            { scale: animation },
            { translateY: animation.interpolate({ inputRange: [0, 1], outputRange: [0, -192] }) }
        ],
        opacity: animation
    };

    return (
        <View className="items-center justify-end relative z-50">
            <Animated.View className="absolute items-center justify-center" style={item2Style}>
                <View className="absolute right-[68px] bg-yellow py-2 rounded-full w-36 items-center justify-center">
                    <Text className="text-black font-inter_medium text-sm">Add Transaction</Text>
                </View>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                        toggleMenu();
                        openModal();
                    }}
                    className="h-14 w-14 bg-yellow rounded-full justify-center items-center shadow-xl"
                >
                    <Feather name="shopping-bag" size={24} color="black" />
                </TouchableOpacity>
            </Animated.View>

            <Animated.View className="absolute items-center justify-center" style={item1Style}>
                <View className="absolute right-[68px] bg-dark_blue py-2 rounded-full w-20 items-center justify-center">
                    <Text className="text-white font-inter_medium text-sm">Notes</Text>
                </View>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                        toggleMenu();
                        openNoteModal();
                    }}
                    className="h-14 w-14 bg-dark_blue rounded-full justify-center items-center shadow-xl"
                >
                    <Feather name="file-text" size={24} color="white" />
                </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity
                activeOpacity={0.8}
                onPress={toggleMenu}
                className="h-14 w-14 bg-red rounded-full justify-center items-center z-50 shadow-xl"
            >
                <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                    <View className="justify-center items-center w-6 h-6">
                        <View className="absolute w-1 h-6 bg-white rounded-full" />
                        <View className="absolute w-6 h-1 bg-white rounded-full" />
                    </View>
                </Animated.View>
            </TouchableOpacity>

            <AddFundModal
                visible={isAddModalOpen}
                onClose={closeModal}
            />

            <NoteModal
                visible={isNoteModalOpen}
                note={editingNote}
                onClose={closeNoteModal}
                onSave={handleSaveNote}
            />
        </View>
    );
}