import { View, Text, Modal, TouchableOpacity, Animated, Easing } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';

type CelebrationModalProps = {
    visible: boolean;
    onClose: () => void;
    goalName: string;
    targetAmount: number;
};

const CONFETTI_COLORS = ['#22C55E', '#EAB308', '#3B82F6', '#E24B4A', '#14B8A6'];
const CONFETTI_COUNT = 14;

export default function CelebrationModal({ visible, onClose, goalName, targetAmount }: CelebrationModalProps) {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const confettiAnims = useRef(
        Array.from({ length: CONFETTI_COUNT }, () => ({
            translateY: new Animated.Value(-20),
            translateX: new Animated.Value(0),
            rotate: new Animated.Value(0),
            opacity: new Animated.Value(1),
        }))
    ).current;

    useEffect(() => {
        if (!visible) return;

        scaleAnim.setValue(0);
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 5,
            tension: 60,
            useNativeDriver: true,
        }).start();

        confettiAnims.forEach((anim) => {
            anim.translateY.setValue(-20);
            anim.translateX.setValue(0);
            anim.rotate.setValue(0);
            anim.opacity.setValue(1);

            const fallDistance = 260 + Math.random() * 80;
            const drift = (Math.random() - 0.5) * 160;
            const delay = Math.random() * 200;

            Animated.parallel([
                Animated.timing(anim.translateY, {
                    toValue: fallDistance,
                    duration: 1400,
                    delay,
                    easing: Easing.out(Easing.quad),
                    useNativeDriver: true,
                }),
                Animated.timing(anim.translateX, {
                    toValue: drift,
                    duration: 1400,
                    delay,
                    easing: Easing.out(Easing.quad),
                    useNativeDriver: true,
                }),
                Animated.timing(anim.rotate, {
                    toValue: 1,
                    duration: 1400,
                    delay,
                    useNativeDriver: true,
                }),
                Animated.timing(anim.opacity, {
                    toValue: 0,
                    duration: 600,
                    delay: delay + 800,
                    useNativeDriver: true,
                }),
            ]).start();
        });
    }, [visible]);

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View className="flex-1 bg-black/70 justify-center items-center px-8">
                <View className="absolute inset-0" pointerEvents="none">
                    {confettiAnims.map((anim, i) => (
                        <Animated.View
                            key={i}
                            style={{
                                position: 'absolute',
                                top: '35%',
                                left: `${10 + (i * 80) / CONFETTI_COUNT}%`,
                                width: 10,
                                height: 10,
                                borderRadius: 2,
                                backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
                                opacity: anim.opacity,
                                transform: [
                                    { translateY: anim.translateY },
                                    { translateX: anim.translateX },
                                    {
                                        rotate: anim.rotate.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: ['0deg', '360deg'],
                                        }),
                                    },
                                ],
                            }}
                        />
                    ))}
                </View>

                <Animated.View
                    style={{ transform: [{ scale: scaleAnim }] }}
                    className="bg-white rounded-3xl p-8 items-center w-full border-2 border-black"
                >
                    <View className="h-20 w-20 rounded-full bg-yellow items-center justify-center mb-5 border-2 border-black">
                        <Feather name="award" size={40} color="black" />
                    </View>

                    <Text className="font-rubik_bold text-2xl text-black text-center mb-2">Goal Complete!</Text>
                    <Text className="font-rubik_medium text-base text-gray-500 text-center mb-6">
                        You hit your ${targetAmount.toLocaleString()} target for "{goalName}"
                    </Text>

                    <TouchableOpacity onPress={onClose} className="bg-black px-10 py-4 rounded-full w-full items-center">
                        <Text className="text-white font-rubik_bold text-lg">Nice!</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    );
}