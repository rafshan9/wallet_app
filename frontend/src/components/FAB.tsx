import { View, TouchableOpacity, Animated, Text } from 'react-native';
import { useState, useRef } from 'react';
import AddFundModal from './CashFlowComponents/AddFundModal';
import NoteModal from './NoteComponents/NoteModal';
import { useAppStore } from '../store';
import { useNotes } from '../hooks/useNotes';
import PlusIcon from '../../assets/icons/plus_sign.svg';


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
                    <Text className="text-black font-inter_bold text-sm">Add Transaction</Text>
                </View>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                        toggleMenu();
                        openModal();
                    }}
                    className="h-14 w-14 bg-yellow rounded-full justify-center items-center shadow-xl"
                >
                    <PlusIcon width={24} height={24} />
                </TouchableOpacity>
            </Animated.View>

            <Animated.View className="absolute items-center justify-center" style={item1Style}>
                <View className="absolute right-[68px] bg-dark_blue py-2 rounded-full w-20 items-center justify-center">
                    <Text className="text-white font-inter_bold text-sm">Notes</Text>
                </View>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                        toggleMenu();
                        openNoteModal();
                    }}
                    className="h-14 w-14 bg-dark_blue rounded-full justify-center items-center shadow-xl"
                >
                    <PlusIcon width={24} height={24} />
                </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity
                activeOpacity={0.8}
                onPress={toggleMenu}
                className="h-14 w-14 bg-white rounded-full justify-center items-center z-50 shadow-xl"
            >
                <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                    <PlusIcon width={24} height={24} />
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