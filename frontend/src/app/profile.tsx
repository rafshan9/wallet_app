import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

export default function ProfileScreen() {
    const router = useRouter();

    return (
        <ScrollView className="flex-1 bg-background pt-16 px-6">

            {/* Top Bar with Back Button */}
            <View className="flex-row items-center mb-8">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-12 h-12 bg-white border-2 border-black rounded-full items-center justify-center shadow-sm"
                >
                    <Feather name="arrow-left" size={24} color="black" />
                </TouchableOpacity>
                <Text className="text-2xl font-rubik_bold ml-4">My Profile</Text>
            </View>

            {/* Avatar & User Info */}
            <View className="items-center mb-10">
                <View className="relative">
                    <Image
                        source={{ uri: 'https://ui-avatars.com/api/?name=Rafshan+Isti+Ahmed&background=F5B000&color=000&size=256' }}
                        className="w-32 h-32 rounded-full border-4 border-black mb-4 bg-white"
                    />
                    <TouchableOpacity className="absolute bottom-4 right-0 bg-white p-2 rounded-full border-2 border-black">
                        <Feather name="edit-2" size={16} color="black" />
                    </TouchableOpacity>
                </View>
                <Text className="text-3xl font-rubik_bold text-black text-center mb-1">Rafshan Isti Ahmed</Text>
                <Text className="text-lg font-rubik_medium text-gray-500">rafshan@example.com</Text>
            </View>

            {/* Settings Links (Dummy) */}
            <View className="gap-y-4 mb-8">
                <TouchableOpacity className="flex-row items-center justify-between bg-white p-5 rounded-2xl border-2 border-black shadow-sm">
                    <View className="flex-row items-center">
                        <Feather name="settings" size={24} color="black" />
                        <Text className="ml-4 text-xl font-rubik_medium text-black">Account Settings</Text>
                    </View>
                    <Feather name="chevron-right" size={24} color="gray" />
                </TouchableOpacity>

                <TouchableOpacity className="flex-row items-center justify-between bg-white p-5 rounded-2xl border-2 border-black shadow-sm">
                    <View className="flex-row items-center">
                        <Feather name="bell" size={24} color="black" />
                        <Text className="ml-4 text-xl font-rubik_medium text-black">Notifications</Text>
                    </View>
                    <Feather name="chevron-right" size={24} color="gray" />
                </TouchableOpacity>
            </View>

            {/* Functional Logout Button */}
            <TouchableOpacity
                onPress={() => router.replace('/login')}
                className="flex-row items-center justify-center bg-yellow p-5 rounded-2xl border-2 border-black shadow-sm mb-4"
            >
                <Feather name="log-out" size={24} color="black" />
                <Text className="ml-3 text-xl font-rubik_bold text-black">Log Out</Text>
            </TouchableOpacity>

            {/* Dummy Delete Account Button */}
            <TouchableOpacity
                className="flex-row items-center justify-center bg-red p-5 rounded-2xl border-2 border-black shadow-sm mb-12"
            >
                <Feather name="trash-2" size={24} color="white" />
                <Text className="ml-3 text-xl font-rubik_bold text-white">Delete Account</Text>
            </TouchableOpacity>

        </ScrollView>
    );
}