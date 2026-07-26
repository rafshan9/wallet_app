import { View, Text, TextInput, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import api from '../../utils/axios';
import { useAppStore } from '../../src/store';
import { useAlert } from '../components/AlertModal';
import PasswordValidator from '../components/PasswordValidator';

export default function AccountSettingsScreen() {
    const router = useRouter();
    const { user } = useAppStore();
    const showAlert = useAlert();

    // Change password state
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            showAlert({ title: 'Error', message: 'Please fill in all fields.' });
            return;
        }
        if (newPassword !== confirmPassword) {
            showAlert({ title: 'Error', message: 'New passwords do not match.' });
            return;
        }

        setIsChangingPassword(true);
        try {
            await api.post('/account/change-password/', {
                old_password: oldPassword,
                new_password: newPassword,
            });
            showAlert({ title: 'Success', message: 'Your password has been changed.' });
            setShowChangePassword(false);
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            const message = error.response?.data?.error || 'Could not change password.';
            showAlert({ title: 'Error', message: Array.isArray(message) ? message.join('\n') : message });
        } finally {
            setIsChangingPassword(false);
        }
    };

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
        showAlert({
            title: "Delete Account",
            message: "Are you sure? This will permanently delete your account and all your data. This action cannot be undone.",
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

    const SettingsRow = ({ icon, label, onPress, rightElement, destructive }: {
        icon: string;
        label: string;
        onPress?: () => void;
        rightElement?: React.ReactNode;
        destructive?: boolean;
    }) => (
        <TouchableOpacity
            className="flex-row items-center justify-between bg-white p-5 rounded-2xl border-2 border-black"
            onPress={onPress}
            activeOpacity={onPress ? 0.7 : 1}
        >
            <View className="flex-row items-center flex-1">
                <Feather name={icon as any} size={22} color={destructive ? '#DC2626' : 'black'} />
                <Text className={`ml-4 text-lg font-inter_medium ${destructive ? 'text-red-600' : 'text-black'}`}>{label}</Text>
            </View>
            {rightElement || (onPress && <Feather name="chevron-right" size={22} color="gray" />)}
        </TouchableOpacity>
    );

    return (
        <ScrollView className="flex-1 bg-dark_blue pt-16 px-6" contentContainerStyle={{ paddingBottom: 60 }}>

            {/* Top Bar */}
            <View className="flex-row items-center mb-8">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-12 h-12 bg-yellow border-2 border-black rounded-full items-center justify-center shadow-sm"
                >
                    <Feather name="arrow-left" size={24} color="black" />
                </TouchableOpacity>
                <Text className="text-2xl font-inter_bold ml-4 text-white">Account Settings</Text>
            </View>

            {/* Account Info Section */}
            <Text className="text-white/60 font-inter_bold text-sm uppercase tracking-wider mb-3 ml-1">Account</Text>
            <View className="gap-y-3 mb-8">
                <View className="bg-white p-5 rounded-2xl border-2 border-black">
                    <Text className="text-sm font-inter_medium text-gray-500 mb-1">Name</Text>
                    <Text className="text-lg font-inter_bold text-black">
                        {user ? `${user.first_name} ${user.last_name}` : '—'}
                    </Text>
                </View>
                <View className="bg-white p-5 rounded-2xl border-2 border-black">
                    <Text className="text-sm font-inter_medium text-gray-500 mb-1">Email</Text>
                    <Text className="text-lg font-inter_bold text-black">
                        {user?.email || '—'}
                    </Text>
                </View>
            </View>

            {/* Security Section */}
            <Text className="text-white/60 font-inter_bold text-sm uppercase tracking-wider mb-3 ml-1">Security</Text>
            <View className="gap-y-3 mb-8">
                <SettingsRow
                    icon="lock"
                    label="Change Password"
                    onPress={() => setShowChangePassword(!showChangePassword)}
                />

                {/* Change Password Expandable Section */}
                {showChangePassword && (
                    <View className="bg-white/10 p-5 rounded-2xl border-2 border-white/20">
                        {/* Old Password */}
                        <View className="relative mb-4">
                            <TextInput
                                placeholder="Current password"
                                secureTextEntry={!showOldPassword}
                                value={oldPassword}
                                autoCapitalize="none"
                                onChangeText={setOldPassword}
                                className="bg-white text-black px-6 py-4 pr-14 rounded-2xl border-2 border-black font-inter_medium text-lg placeholder:text-gray-400"
                            />
                            <TouchableOpacity
                                className="absolute right-4 top-5 z-10"
                                onPress={() => setShowOldPassword(!showOldPassword)}
                            >
                                <Feather name={showOldPassword ? "eye" : "eye-off"} size={24} color="gray" />
                            </TouchableOpacity>
                        </View>

                        {/* New Password */}
                        <View className="relative mb-4">
                            <TextInput
                                placeholder="New password"
                                secureTextEntry={!showNewPassword}
                                value={newPassword}
                                autoCapitalize="none"
                                onChangeText={setNewPassword}
                                className="bg-white text-black px-6 py-4 pr-14 rounded-2xl border-2 border-black font-inter_medium text-lg placeholder:text-gray-400"
                            />
                            <TouchableOpacity
                                className="absolute right-4 top-5 z-10"
                                onPress={() => setShowNewPassword(!showNewPassword)}
                            >
                                <Feather name={showNewPassword ? "eye" : "eye-off"} size={24} color="gray" />
                            </TouchableOpacity>
                        </View>

                        <PasswordValidator password={newPassword} />

                        {/* Confirm New Password */}
                        <View className="relative mb-6">
                            <TextInput
                                placeholder="Confirm new password"
                                secureTextEntry={!showConfirmPassword}
                                value={confirmPassword}
                                autoCapitalize="none"
                                onChangeText={setConfirmPassword}
                                className="bg-white text-black px-6 py-4 pr-14 rounded-2xl border-2 border-black font-inter_medium text-lg placeholder:text-gray-400"
                            />
                            <TouchableOpacity
                                className="absolute right-4 top-5 z-10"
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                <Feather name={showConfirmPassword ? "eye" : "eye-off"} size={24} color="gray" />
                            </TouchableOpacity>
                        </View>

                        {/* Submit Button */}
                        <TouchableOpacity
                            className="relative self-center"
                            onPress={handleChangePassword}
                            activeOpacity={0.8}
                            disabled={isChangingPassword}
                        >
                            <View className="absolute top-1.5 left-1.5 right-[-6px] bottom-[-6px] bg-black" />
                            <View className="bg-yellow py-3 px-12 border-2 border-black items-center">
                                <Text className="font-inter_bold text-black text-lg">
                                    {isChangingPassword ? 'Saving...' : 'Update Password'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                )}

                <SettingsRow
                    icon="mail"
                    label="Reset Password via Email"
                    onPress={() => router.push('/forgot-password')}
                />
            </View>

            {/* Support Section */}
            <Text className="text-white/60 font-inter_bold text-sm uppercase tracking-wider mb-3 ml-1">Support</Text>
            <View className="gap-y-3 mb-8">
                <SettingsRow
                    icon="help-circle"
                    label="Help & FAQ"
                />
                <SettingsRow
                    icon="message-circle"
                    label="Contact Support"
                />
                <SettingsRow
                    icon="file-text"
                    label="Terms of Service"
                />
                <SettingsRow
                    icon="shield"
                    label="Privacy Policy"
                />
            </View>

            {/* Danger Zone */}
            <Text className="text-red-400/60 font-inter_bold text-sm uppercase tracking-wider mb-3 ml-1">Danger Zone</Text>
            <View className="gap-y-3 mb-8">
                <TouchableOpacity
                    className="relative self-center mb-2"
                    onPress={handleLogout}
                    activeOpacity={0.8}
                >
                    <View className="absolute top-1.5 left-1.5 right-[-6px] bottom-[-6px] bg-black" />
                    <View className="flex-row items-center justify-center gap-4 bg-yellow py-4 px-16 border-2 border-black">
                        <Feather name="log-out" size={22} color="black" />
                        <Text className="font-inter_bold text-black text-lg">Log Out</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    className="relative self-center"
                    onPress={handleDeleteAccount}
                    activeOpacity={0.8}
                >
                    <View className="absolute top-1.5 left-1.5 right-[-6px] bottom-[-6px] bg-black" />
                    <View className="flex-row items-center justify-center gap-4 bg-background_red py-4 px-16 border-2 border-black">
                        <Feather name="trash-2" size={22} color="white" />
                        <Text className="font-inter_bold text-white text-lg">Delete Account</Text>
                    </View>
                </TouchableOpacity>
            </View>

            {/* App Version */}
            <Text className="text-center text-white/30 font-inter_medium text-sm mb-4">Spends v1.0.0</Text>
        </ScrollView>
    );
}
