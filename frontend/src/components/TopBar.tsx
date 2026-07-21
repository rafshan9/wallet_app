import { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Feather } from '@expo/vector-icons';

const PAGE_TITLES: Record<string, string> = {
    '/CashFlowScreen': 'Cash Flow',
    '/GoalScreen': 'Goals',
};

const PILL_WIDTH = 88;
const PILL_HEIGHT = 34;

export default function TopBar() {
    const router = useRouter();
    const pathname = usePathname();
    const title = PAGE_TITLES[pathname] ?? 'Home';
    const isHome = title === 'Home';

    const slideAnim = useRef(new Animated.Value(isHome ? 0 : 1)).current;

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: isHome ? 0 : 1,
            duration: 220,
            useNativeDriver: true,
        }).start();
    }, [isHome]);

    const spendsStyle = {
        opacity: slideAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
        transform: [{ translateX: slideAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -16] }) }],
    };

    const backStyle = {
        opacity: slideAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }),
        transform: [{ translateX: slideAnim.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }],
    };

    return (
        <View className="px-6 pb-2 mb-2">
            <View className="flex-row items-center bg-white rounded-full border-[2px] border-black px-5 h-14" style={{ position: 'relative' }}>
                {/* Left column — flex:1, pill pinned to the start, mirrors the right column exactly */}
                <View className="flex-1 items-start">
                    <TouchableOpacity
                        activeOpacity={isHome ? 1 : 0.8}
                        disabled={isHome}
                        onPress={() => router.back()}
                        className="bg-yellow rounded-3xl border-[1px] border-yellow"
                        style={{ width: PILL_WIDTH, height: PILL_HEIGHT, overflow: 'hidden' }}
                    >
                        <Animated.View style={[{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }, spendsStyle]}>
                            <Text className="font-inter_black text-sm text-black">SPENDS</Text>
                        </Animated.View>

                        <Animated.View style={[{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }, backStyle]}>
                            <Feather name="chevron-left" size={16} color="black" />
                            <Text className="font-inter_bold text-sm text-black ml-1">BACK</Text>
                        </Animated.View>
                    </TouchableOpacity>
                </View>

                {/* Middle: absolutely centered on the whole bar */}
                <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, alignItems: 'center' }}>
                    <Text className={`font-inter_black ${isHome ? 'text-lg' : 'text-md'}`}>{title}</Text>
                </View>

                {/* Right column — flex:1, pill pinned to the end, mirrors the left column */}
                <View className="flex-1 items-end">
                    <TouchableOpacity activeOpacity={0.8} onPress={() => router.push('/profile')}>
                        <Text className="px-4 py-1 font-inter_bold text-sm">Profile</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}