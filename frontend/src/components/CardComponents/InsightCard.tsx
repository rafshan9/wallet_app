import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function InsightCard() {
    return (
        <View className="mt-8 mb-6 relative">
            {/* Main Dashed Container */}
            <View className="w-full bg-black rounded-[40px] p-8 border-[4px] border-dashed border-white">

                {/* Red Icon Badge */}
                <View className="h-14 w-14 bg-red rounded-full justify-center items-center mb-6">
                    <Feather name="file-text" size={24} color="white" />
                </View>

                {/* Insight Text */}
                <Text className="text-white text-2xl font-rubik_medium leading-9 w-[85%]">
                    You've spent 15% less on miscellaneous items this week. On track to save $200.
                </Text>

            </View>

        </View>
    );
}