import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons'
export default function DailyBudgetPage() {
    const router = useRouter();
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
                />
                <Text className="font-jb_mono_medium text-sm text-center">
                    If you don't have one, just press continue
                </Text>

                {/* Continue Button */}
                <TouchableOpacity
                    onPress={() => router.push('/')}
                    className="bg-yellow w-full py-4 rounded-xl border-2 border-black items-center mt-6">
                    <Text className="font-jb_mono_medium text-xl">
                        Continue
                    </Text>
                </TouchableOpacity>

                {/* Clear Button */}
                <TouchableOpacity className="absolute bottom-20 py-3 px-4 rounded-xl bg-background_red/80 ">
                    <Text className="font-jb_mono_medium text-sm text-white">Clear budget</Text>
                </TouchableOpacity>


            </View>
        </View>
    );
}