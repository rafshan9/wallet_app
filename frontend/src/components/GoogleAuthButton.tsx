import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function GoogleAuthButton({ onPress }: { onPress: () => void }) {
    return (
        <>
            <View className="flex-row items-center mb-6 w-full max-w-xs self-center">
                <View className="flex-1 h-[2px] bg-white/40" />
                <Text className="text-white/70 mx-3 font-inter_medium">or</Text>
                <View className="flex-1 h-[2px] bg-white/40" />
            </View>

            <TouchableOpacity className="relative self-center mb-6" onPress={onPress} activeOpacity={0.8}>
                <View className="absolute top-1.5 left-1.5 right-[-6px] bottom-[-6px] bg-black" />
                <View className="bg-white py-4 px-10 border-2 border-black items-center flex-row gap-3">
                    <FontAwesome name="google" size={20} color="#000" />
                    <Text className="font-inter_bold text-lg">Continue with Google</Text>
                </View>
            </TouchableOpacity>
        </>
    );
}