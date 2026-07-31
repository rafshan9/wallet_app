import { View, Text, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import api from '../../utils/axios';
import { useAppStore } from '../../src/store';
import { useAlert } from '../components/AlertModal';

export default function ProfileScreen() {
    const router = useRouter();
    const { user } = useAppStore();
    const showAlert = useAlert();

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
        // This looks almost exactly like your original Alert.alert!
        showAlert({
            title: "Delete Account",
            message: "Are you sure? This action cannot be undone.",
            buttons: [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await api.delete('/account/delete/');
                            await SecureStore.deleteItemAsync('accessToken');
                            useAppStore.getState().setUser(null);
                            router.replace('/login');
                        } catch (error) {
                            console.error("Failed to delete account:", error);
                        }
                    }
                }
            ]
        });
    };
    return (
        <ScrollView className="flex-1 bg-[#F4F4F0] pt-16 px-6">

            {/* Top Bar with Back Button */}
            <View className="flex-row items-center mb-8">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-12 h-12 bg-yellow rounded-full border-2 border-black items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                    <Feather name="arrow-left" size={24} color="black" />
                </TouchableOpacity>
                <Text className="text-2xl font-jb_mono_bold ml-4 text-black">My Profile</Text>
            </View>

            {/* Avatar & User Info */}
            <View className="items-center mb-10">
                <View className="relative mb-4">
                    <Image
                        source={{ uri: avatarUri }}
                        className="w-32 h-32 rounded-full border-4 border-black bg-white"
                    />
                </View>
                <Text className="text-3xl font-jb_mono_bold text-black text-center mb-1">{fullName}</Text>
                <Text className="text-lg font-jb_mono_medium text-black/70">{email}</Text>
            </View>

            {/* Settings Links */}
            <View className="gap-y-4 mb-8">
                <TouchableOpacity
                    className="flex-row rounded-xl items-center justify-between bg-white p-5 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    onPress={() => router.push('/account-settings')}
                >
                    <View className="flex-row items-center">
                        <Feather name="settings" size={24} color="black" />
                        <Text className="ml-4 text-xl font-jb_mono_medium text-black">Account Settings</Text>
                    </View>
                    <Feather name="chevron-right" size={24} color="black" />
                </TouchableOpacity>

                <TouchableOpacity className="flex-row rounded-xl items-center justify-between bg-white p-5 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <View className="flex-row items-center">
                        <Feather name="bell" size={24} color="black" />
                        <Text className="ml-4 text-xl font-jb_mono_medium text-black">Notifications</Text>
                    </View>
                    <Feather name="chevron-right" size={24} color="black" />
                </TouchableOpacity>
            </View>

            {/* Logout Button */}
            <TouchableOpacity
                className="flex-row rounded-xl items-center justify-center gap-4 bg-yellow py-4 px-16 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6"
                onPress={handleLogout}
                activeOpacity={1}
            >
                <Feather name="log-out" size={24} color="black" />
                <Text className="font-jb_mono_bold text-black text-xl">Log Out</Text>
            </TouchableOpacity>

            {/* Delete Account Button */}
            <TouchableOpacity
                className="flex-row rounded-xl items-center justify-center gap-4 bg-background_red py-4 px-16 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-12"
                onPress={handleDeleteAccount}
                activeOpacity={1}
            >
                <Feather name="trash-2" size={24} color="black" />
                <Text className="font-jb_mono_bold text-black text-xl">Delete Account</Text>
            </TouchableOpacity>

        </ScrollView>
    );
}