import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function ResetPasswordScreen() {
    const router = useRouter();
    const { uid, token } = useLocalSearchParams<{ uid: string; token: string }>();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (!newPassword || !confirmPassword) {
            Alert.alert('Error', 'Please fill in both fields.');
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match.');
            return;
        }
        if (!uid || !token) {
            Alert.alert('Error', 'This reset link is invalid. Please request a new one.');
            return;
        }

        setIsLoading(true);
        try {
            await axios.post(`${API_URL}/api/auth/reset-password/`, {
                uid,
                token,
                new_password: newPassword,
            });
            Alert.alert('Success', 'Your password has been reset. Please log in.');
            router.replace('/login');
        } catch (error: any) {
            const message = error.response?.data?.error || 'Could not reset your password. The link may have expired.';
            Alert.alert('Error', Array.isArray(message) ? message.join('\n') : message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-background_red justify-center px-6">
            <Text className="text-3xl font-alfa text-white text-center mb-8">Reset Password</Text>

            <TextInput
                placeholder="New password"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
                className="bg-white px-6 py-4 rounded-2xl border-2 border-black font-inter_medium text-lg mb-4 placeholder:text-gray-400"
            />
            <TextInput
                placeholder="Confirm new password"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                className="bg-white px-6 py-4 rounded-2xl border-2 border-black font-inter_medium text-lg mb-8 placeholder:text-gray-400"
            />

            <TouchableOpacity
                className="relative self-center"
                onPress={handleSubmit}
                activeOpacity={0.8}
                disabled={isLoading}
            >
                <View className="absolute top-1.5 left-1.5 right-[-6px] bottom-[-6px] bg-black" />
                <View className="bg-yellow py-4 px-16 border-2 border-black items-center">
                    <Text className="font-inter_bold text-black text-xl">{isLoading ? 'Resetting...' : 'Reset Password'}</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}