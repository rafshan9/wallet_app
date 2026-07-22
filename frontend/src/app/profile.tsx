import { View, Text, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import api from '../../utils/axios';
import { useAppStore } from '../../src/store';

export default function ProfileScreen() {
    const router = useRouter();
    const { user } = useAppStore();

    const fullName = user ? `${user.first_name} ${user.last_name}` : 'User Name';
    const email = user?.email || 'user@example.com';
    const avatarUri = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=F5B000&color=000&size=256`;


    const handleLogout = async () => {
        try {
            await SecureStore.deleteItemAsync('accessToken');
            useAppStore.getState().setUser(null);
            router.replace('/login');
        } catch (error) {
            console.error("Failed to log out:", error);
        }
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            "Delete Account",
            "Are you sure? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            // 1. Send delete request
                            await api.delete('/account/delete/');

                            // 2. Remove token from SecureStore
                            await SecureStore.deleteItemAsync('accessToken');

                            // 3. Clear user from store
                            useAppStore.getState().setUser(null);

                            // 4. Redirect to login
                            router.replace('/login');
                        } catch (error) {
                            console.error("Failed to delete account:", error);
                        }
                    }
                }
            ]
        );
    };
    return (
        <ScrollView className="flex-1 bg-dark_blue pt-16 px-6">

            {/* Top Bar with Back Button */}
            <View className="flex-row items-center mb-8">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-12 h-12 bg-yellow border-2 border-black rounded-full items-center justify-center shadow-sm"
                >
                    <Feather name="arrow-left" size={24} color="black" />
                </TouchableOpacity>
                <Text className="text-2xl font-inter_bold ml-4 text-white">My Profile</Text>
            </View>

            {/* Avatar & User Info */}
            <View className="items-center mb-10">
                <View className="relative">
                    <Image
                        source={{ uri: avatarUri }}
                        className="w-32 h-32 rounded-full border-4 border-black mb-4 bg-white"
                    />
                    <TouchableOpacity className="absolute bottom-4 right-0 bg-white p-2 rounded-full border-2 border-black">
                        <Feather name="edit-2" size={16} color="black" />
                    </TouchableOpacity>
                </View>
                <Text className="text-3xl font-inter_bold text-black text-center mb-1">{fullName}</Text>
                <Text className="text-lg font-inter_medium text-white">{email}</Text>
            </View>

            {/* Settings Links (Dummy) */}
            <View className="gap-y-4 mb-8">
                <TouchableOpacity className="flex-row items-center justify-between bg-white p-5 rounded-2xl border-2 border-black shadow-sm">
                    <View className="flex-row items-center">
                        <Feather name="settings" size={24} color="black" />
                        <Text className="ml-4 text-xl font-inter_medium text-black">Account Settings</Text>
                    </View>
                    <Feather name="chevron-right" size={24} color="gray" />
                </TouchableOpacity>

                <TouchableOpacity className="flex-row items-center justify-between bg-white p-5 rounded-2xl border-2 border-black shadow-sm">
                    <View className="flex-row items-center">
                        <Feather name="bell" size={24} color="black" />
                        <Text className="ml-4 text-xl font-inter_medium text-black">Notifications</Text>
                    </View>
                    <Feather name="chevron-right" size={24} color="gray" />
                </TouchableOpacity>
            </View>

            {/* Logout Button */}
            <TouchableOpacity
                className="relative self-center mb-6"
                onPress={handleLogout}
                activeOpacity={0.8}
            >

                {/* The Solid Shadow */}
                <View className="absolute top-1.5 left-1.5 right-[-6px] bottom-[-6px] bg-black" />

                {/* The Button */}
                <View className="flex-row items-center justify-center gap-4 bg-yellow py-4 px-16 border-2 border-black">
                    <Feather name="log-out" size={24} color="black" />
                    <Text className="font-inter_bold text-black text-xl">Log Out</Text>
                </View>
            </TouchableOpacity>

            {/* Delete Account Button */}
            <TouchableOpacity
                className="relative self-center mb-6"
                onPress={handleDeleteAccount}
                activeOpacity={0.8}
            >
                {/* The Solid Shadow */}
                <View className="absolute top-1.5 left-1.5 right-[-6px] bottom-[-6px] bg-black" />

                {/* The Button */}
                <View className="flex-row items-center justify-center gap-4 bg-background_red py-4 px-16 border-2 border-black">
                    <Feather name="trash-2" size={24} color="white" />
                    <Text className="font-inter_bold text-white text-xl">Delete Account</Text>
                </View>
            </TouchableOpacity>

        </ScrollView>
    );
}