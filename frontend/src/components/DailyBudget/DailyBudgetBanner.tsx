import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useAppStore } from '../../store';
import { useCashFlow } from '../../hooks/useCashFlow';


export default function DailyBudgetBanner() {
    const { budget, fetchBudget } = useAppStore();
    const { dailySpent, isLoading: isCashFlowLoading } = useCashFlow();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const isOverBudget = dailySpent > budget;
    const fadeAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(fadeAnim, { toValue: 0.2, duration: 600, useNativeDriver: true }),
                Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true })
            ])
        ).start();
    }, [fadeAnim]);

    useFocusEffect(
        useCallback(() => {
            fetchBudget().finally(() => setLoading(false));
        }, [])
    );

    if (!budget || Number(budget) === 0) {
        return (
            <TouchableOpacity onPress={() => router.push('/DailyBudgetPage')}>
                <View className="flex-row bg-yellow w-full justify-center items-center py-3.5 border-b-2 border-black">
                    <Text className="font-jb_mono_bold px-4 opacity-70">Tap to set daily budget</Text>
                </View>
            </TouchableOpacity>
        );
    }

    if (loading || isCashFlowLoading) {
        return <Text className="font-jb_mono_bold">Loading...</Text>;
    }

    return (
        <TouchableOpacity onPress={() => router.push('/DailyBudgetPage')}>
            <View className="flex-row bg-yellow w-full justify-between items-center py-3.5 border-b-2 border-black">
                <Text className="font-jb_mono_bold px-4">Daily Budget: ${budget}</Text>

                <View className="flex-row items-center px-4">
                    <Animated.View
                        style={{ opacity: fadeAnim }}
                        className={`w-3 h-3 rounded-full mr-2 ${isOverBudget ? 'bg-red' : 'bg-green'}`} />
                    <Text className={`font-jb_mono_bold ${isOverBudget ? 'text-black bg-red/50 rounded-xl p-2' : 'text-black'}`}>
                        Spent: ${dailySpent}/${budget}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}