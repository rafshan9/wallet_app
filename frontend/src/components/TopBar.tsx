import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

const PAGE_TITLES: Record<string, string> = {
    '/cashflow': 'Cash Flow',
    '/goal': 'Goals',
};

export default function TopBar() {
    const router = useRouter();
    const pathname = usePathname();
    const title = PAGE_TITLES[pathname] ?? '';

    return (
        <View className="flex-row items-center justify-between w-full mb-6">

            {/* Right: App name */}
            <Text className="font-rubik_bold text-xl text-black ml-4">wallet.</Text>

            {/* Middle: Current page name */}
            <Text className="font-rubik_bold text-base text-black">{title}</Text>

            {/* Left: Avatar + Settings */}
            <View className="flex-row items-center gap-4">
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => router.push('/profile')} // Use push instead of replace
                    className="h-10 w-10 justify-center items-center"
                >
                    <Feather name="settings" size={24} color="black" />
                </TouchableOpacity>
                <View className="h-12 w-12 rounded-full border-2 border-[#5284ff] overflow-hidden">
                    <Image
                        source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
                        className="w-full h-full"
                    />
                </View>
            </View>




        </View>
    );
}