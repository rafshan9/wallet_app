import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import api from '../../../utils/axios';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';


export default function DailyBudgetBanner() {
    const router = useRouter();
    const [budgetData, setBudgetData] = useState({ limit: 0, spent: 0 });

    useFocusEffect(
        useCallback(() => {
            api.get('/budget/').then((res) => {
                setBudgetData({
                    limit: res.data.daily_budget || 0,
                    spent: res.data.spent_today || 0
                });
            });
        }, [])
    );
    return (
        <TouchableOpacity
            onPress={() => router.push({ pathname: '/DailyBudgetPage' })}
        >
            <View
                className="flex-row justify-between items-center bg-yellow p-4 border border-b-[2.5px]"
            >
                <Text className='font-jb_mono_bold'>Daily Budget: $12</Text>
                <Text className="font-jb_mono_bold">Spent:$4/$12</Text>
            </View>
        </TouchableOpacity>
    );
}