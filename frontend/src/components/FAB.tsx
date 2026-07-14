import { View, TouchableOpacity, Animated, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useState, useRef } from 'react';
import AddFundModal from './CashFlowComponents/AddFundModal';
import { useAppStore } from '../store';


export default function FAB() {
    const [isOpen, setIsOpen] = useState(false);
    const animation = useRef(new Animated.Value(0)).current;
    const { isAddModalOpen, openModal, closeModal, triggerRefresh } = useAppStore();

    const toggleMenu = () => {
        const toValue = isOpen ? 0 : 1;
        Animated.spring(animation, {
            toValue,
            useNativeDriver: true,
            friction: 5,
        }).start();
        setIsOpen(!isOpen);
    };

    const rotation = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '45deg']
    });

    // 1. Notes (Blue) - 96px
    const item1Style = {
        transform: [
            { scale: animation },
            { translateY: animation.interpolate({ inputRange: [0, 1], outputRange: [0, -96] }) }
        ],
        opacity: animation
    };

    // 2. Expense (Yellow) - 192px
    const item2Style = {
        transform: [
            { scale: animation },
            { translateY: animation.interpolate({ inputRange: [0, 1], outputRange: [0, -192] }) }
        ],
        opacity: animation
    };

    return (
        <View className="items-center justify-end relative z-50">
            {/* Pop-up Item 2 (Middle - Yellow - Expense) */}
            <Animated.View className="absolute items-center justify-center" style={item2Style}>
                <View className="absolute right-[80px] bg-yellow py-2 rounded-full w-40 items-center justify-center">
                    <Text className="text-black font-rubik_medium">Add Transaction</Text>
                </View>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                        toggleMenu();
                        openModal();
                    }}
                    className="h-20 w-20 bg-yellow rounded-full justify-center items-center shadow-xl"
                >
                    <Feather name="shopping-bag" size={32} color="black" />
                </TouchableOpacity>
            </Animated.View>

            {/* Pop-up Item 1 (Bottom - Blue - Notes) */}
            <Animated.View className="absolute items-center justify-center" style={item1Style}>
                <View className="absolute right-[80px] bg-dark_blue py-2 rounded-full w-24 items-center justify-center">
                    <Text className="text-white font-rubik_medium">Notes</Text>
                </View>
                <TouchableOpacity
                    activeOpacity={0.8}
                    className="h-20 w-20 bg-dark_blue rounded-full justify-center items-center shadow-xl"
                >
                    <Feather name="file-text" size={32} color="white" />
                </TouchableOpacity>
            </Animated.View>

            {/* Main Toggle FAB (Red) */}
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={toggleMenu}
                className="h-20 w-20 bg-red rounded-full justify-center items-center z-50 shadow-xl"
            >
                <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                    {/* Your custom thick rounded plus icon */}
                    <View className="justify-center items-center w-8 h-8">
                        <View className="absolute w-1.5 h-8 bg-white rounded-full" />
                        <View className="absolute w-8 h-1.5 bg-white rounded-full" />
                    </View>
                </Animated.View>
            </TouchableOpacity>
            <AddFundModal
                visible={isAddModalOpen}
                onClose={() => {
                    closeModal();
                }}
            />
        </View>
    );
}