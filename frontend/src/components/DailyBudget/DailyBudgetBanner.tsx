import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
export default function DailyBudgetBanner() {
    const router = useRouter();
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