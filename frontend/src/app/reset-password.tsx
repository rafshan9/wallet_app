import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import axios from 'axios';
import { Feather } from '@expo/vector-icons';
import PasswordValidator from '../components/PasswordValidator';
import { useAlert } from '../components/AlertModal';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function ResetPasswordScreen() {
    const router = useRouter();
    const { uid, token } = useLocalSearchParams<{ uid: string; token: string }>();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const showAlert = useAlert();

    const handleSubmit = async () => {
        if (!newPassword || !confirmPassword) {
            showAlert({ title: 'Error', message: 'Please fill in both fields.' });
            return;
        }
        if (newPassword !== confirmPassword) {
            showAlert({ title: 'Error', message: 'Passwords do not match.' });
            return;
        }
        if (!uid || !token) {
            showAlert({ title: 'Error', message: 'This reset link is invalid. Please request a new one.' });
            return;
        }

        setIsLoading(true);
        try {
            await axios.post(`${API_URL}/api/auth/reset-password/`, {
                uid,
                token,
                new_password: newPassword,
            });
            showAlert({ title: 'Success', message: 'Your password has been reset. Please log in.' });
            router.replace('/login');
        } catch (error: any) {
            const message = error.response?.data?.error || 'Could not reset your password. The link may have expired.';
            showAlert({ title: 'Error', message: Array.isArray(message) ? message.join('\n') : message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-background_red justify-center px-6">
            <Text className="text-3xl font-alfa text-white text-center mb-8">Reset Password</Text>

            <View className="relative mb-4">
                <TextInput
                    placeholder="New password"
                    secureTextEntry={!showPassword}
                    value={newPassword}
                    autoCapitalize="none"
                    onChangeText={setNewPassword}
                    className="bg-white text-black px-6 py-4 pr-14 rounded-2xl border-2 border-black font-jb_mono_medium text-lg placeholder:text-gray-400"
                />
                <TouchableOpacity
                    className="absolute right-4 top-5 z-10"
                    onPress={() => setShowPassword(!showPassword)}
                >
                    <Feather name={showPassword ? "eye" : "eye-off"} size={24} color="gray" />
                </TouchableOpacity>
            </View>

            <PasswordValidator password={newPassword} />

            <View className="relative mb-8">
                <TextInput
                    placeholder="Confirm new password"
                    secureTextEntry={!showConfirmPassword}
                    value={confirmPassword}
                    autoCapitalize="none"
                    onChangeText={setConfirmPassword}
                    className="bg-white text-black px-6 py-4 pr-14 rounded-2xl border-2 border-black font-jb_mono_medium text-lg placeholder:text-gray-400"
                />
                <TouchableOpacity
                    className="absolute right-4 top-5 z-10"
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                    <Feather name={showConfirmPassword ? "eye" : "eye-off"} size={24} color="gray" />
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                className="relative self-center"
                onPress={handleSubmit}
                activeOpacity={0.8}
                disabled={isLoading}
            >
                <View className="absolute top-1.5 left-1.5 right-[-6px] bottom-[-6px] bg-black" />
                <View className="bg-yellow py-4 px-16 border-2 border-black items-center">
                    <Text className="font-jb_mono_bold text-black text-xl">{isLoading ? 'Resetting...' : 'Reset Password'}</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}