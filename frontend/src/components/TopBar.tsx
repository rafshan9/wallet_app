import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function TopBar() {
    const router = useRouter();

    return (
        <View className="flex-row items-center justify-end w-full mb-6">
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.replace('/profile')}
                className="flex-row items-center bg-black rounded-full pl-4 pr-1 py-1"
            >
                {/* Black Name Pill */}
                <View className="bg-black h-12 rounded-full pl-6 pr-10 justify-center">
                    <Text className="text-white font-rubik_bold text-lg">Rafshan</Text>
                </View>

                {/* Profile Picture (Overlaps using -ml-6) */}
                <View className="h-16 w-16 rounded-full border-4 border-[#5284ff] overflow-hidden -ml-6 z-10">
                    <Image
                        source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
                        className="w-full h-full"
                    />
                </View>
            </TouchableOpacity>

        </View>
    );
}