import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Feather } from '@expo/vector-icons'
import api from '../../utils/axios';
import { useAlert } from '../components/AlertModal';



export default function DailyBudgetPage() {
    const router = useRouter();
    const showAlert = useAlert();
    const [budget, setBudget] = useState<string>('');
    const [spentToday, setSpentToday] = useState<number>(0);

    useEffect(() => {
        fetchBudget();
    }, []);

    const fetchBudget = async () => {
        try {
            const { data } = await api.get('/budget');
            if (data.daily_budget !== null) {
                setBudget(data.daily_budget.toString());
            }
            setSpentToday(data.spent_today);

        } catch (error) {
            console.error('Fetch error:', error)
        }

    };

    const saveBudget = async () => {
        try {
            // Convert string to number, or send null if they cleared the input
            const amount = budget ? parseFloat(budget) : null;

            await api.post('/budget/', { daily_budget: amount });
            showAlert({ title: 'Success', message: 'Budget updated!' });
            router.back();

        } catch (error) {
            console.error('Save error:', error);
            showAlert({ title: 'Error', message: 'Could not save budget.' });
        }
    };

    const handleClear = async () => {
        try {
            await api.post('/budget/', { daily_budget: null })
            setBudget('');
            showAlert({ title: 'Success', message: 'Budget cleared!' });
            router.back();

        } catch (error) {
            console.error('Clear error:', error);
            showAlert({ title: 'Error', message: 'Could not clear budget.' });

        }
    };

    return (
        <View className="flex-1 bg-background">
            {/*Back button*/}
            <TouchableOpacity
                onPress={() => router.back()}
                className="absolute top-16 left-6 z-10 bg-yellow rounded-full border border-[2.5px] border-black p-3"
            >
                <Feather name="arrow-left" size={24} color="black" />
            </TouchableOpacity>

            {/* Main Content */}
            <View className="flex-1 justify-center items-center px-8">
                <Text className="font-jb_mono_bold text-3xl mb-8 text-center text-black">
                    Enter a daily budget
                </Text>
                <TextInput
                    className="bg-white border-[2.5px] border-black/20 text-black w-full h-16 rounded-xl font-jb_mono_bold text-2xl text-center mb-4"
                    placeholder="$0.00"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                    value={budget}
                    onChangeText={setBudget}
                />
                <Text className="font-jb_mono_medium text-sm text-center">
                    If you don't have one, just press continue
                </Text>

                {/* Continue Button */}
                <TouchableOpacity
                    onPress={budget ? saveBudget : () => router.push('/')}
                    className="bg-yellow w-full py-4 rounded-xl border-2 border-black items-center mt-6">
                    <Text className="font-jb_mono_medium text-xl">
                        {budget ? 'Save' : 'Continue'}
                    </Text>
                </TouchableOpacity>

                {/* Clear Button */}
                <TouchableOpacity
                    className="absolute bottom-20 py-3 px-4 rounded-xl bg-background_red/80 "
                    onPress={handleClear}
                >
                    <Text className="font-jb_mono_medium text-sm text-white">Clear budget</Text>
                </TouchableOpacity>


            </View>
        </View>
    );
}