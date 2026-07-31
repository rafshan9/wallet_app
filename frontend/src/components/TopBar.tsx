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

type TopBarProps = {
    textColor?: Animated.AnimatedInterpolation<string> | string;
};

export default function TopBar({ textColor = '#000' }: TopBarProps) {
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
        <View className="w-full">
            <View className="flex-row items-center px-4 h-14" style={{ position: 'relative' }}>
                {/* Left column — flex:1, pill pinned to the start, mirrors the right column exactly */}
                <View className="flex-1 items-start">
                    <TouchableOpacity
                        activeOpacity={isHome ? 1 : 0.8}
                        disabled={isHome}
                        onPress={() => router.back()}
                        className="bg-yellow rounded-xl  border-2 border-black"
                        style={{ width: PILL_WIDTH, height: PILL_HEIGHT, overflow: 'hidden' }}
                    >
                        <Animated.View style={[{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }, spendsStyle]}>
                            <Text className="font-alfa text-sm text-black uppercase">SPENDS</Text>
                        </Animated.View>

                        <Animated.View style={[{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }, backStyle]}>
                            <Feather name="chevron-left" size={16} color="black" />
                            <Text className="font-jb_mono_bold text-sm ml-1 text-black uppercase">BACK</Text>
                        </Animated.View>
                    </TouchableOpacity>
                </View>

                <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, alignItems: 'center' }}>
                    <Animated.Text
                        className={`font-jb_mono_bold ${isHome ? 'text-lg' : 'text-md'}`}
                        style={{ color: textColor }}
                    >
                        {title}
                    </Animated.Text>
                </View>

                <View className="flex-1 items-end">
                    <TouchableOpacity activeOpacity={0.8} onPress={() => router.push('/profile')}>
                        <Animated.Text className="px-2 py-1 font-jb_mono_bold text-sm" style={{ color: textColor }}>
                            Profile
                        </Animated.Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}