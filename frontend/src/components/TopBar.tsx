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
        <View className="px-6 pb-4 mb-2 ">
            <View className="flex-row items-center justify-between">
                {/* Left: app wordmark */}
                <View className="bg-very_dark_blue rounded-full px-4 py-2">
                    <Text className="font-rubik_bold text-base text-white">wallet.</Text>
                </View>

                {/* Middle: current page name, home stays blank */}
                <Text className="font-rubik_bold text-base text-black">{title}</Text>

                {/* Right: Avatar + Settings */}
                <View className="flex-row items-center gap-2.5">
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => router.push('/profile')}
                        className="h-9 w-9 bg-yellow rounded-full border-[3px] border-black justify-center items-center"
                    >
                        <Feather name="settings" size={20} color="black" />
                    </TouchableOpacity>
                    <View className="h-11 w-11 rounded-full border-[3px] border-black overflow-hidden">
                        <Image
                            source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
                            className="w-full h-full"
                        />
                    </View>
                </View>




            </View>
        </View>
    );
}