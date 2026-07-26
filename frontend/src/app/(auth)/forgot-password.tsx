import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async () => {
        if (!email.trim()) return;
        setIsLoading(true);
        try {
            await axios.post(`${API_URL}/api/auth/forgot-password/`, { email: email.trim() });
        } catch (error) {
            // fall through regardless — don't reveal whether the email exists
        } finally {
            setIsLoading(false);
            setSubmitted(true);
        }
    };

    if (submitted) {
        return (
            <View className="flex-1 bg-background_red justify-center px-6">
                <Text className="text-2xl font-inter_bold text-white text-center mb-4">Check your email</Text>
                <Text className="text-white/80 text-center font-inter_medium mb-8">
                    If an account exists for {email}, we've sent a link to reset your password.
                </Text>
                <TouchableOpacity onPress={() => router.replace('/login')}>
                    <Text className="text-white font-inter_bold text-center underline">Back to Login</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-background_red justify-center px-6">
            <Text className="text-3xl font-alfa text-white text-center mb-2">Forgot Password</Text>
            <Text className="text-white/80 text-center font-inter_medium mb-8">
                Enter your email and we'll send you a reset link.
            </Text>
            <TextInput
                placeholder="Email"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                className="bg-white px-6 py-4 rounded-2xl border-2 border-black font-inter_medium text-lg mb-6 placeholder:text-gray-400"
            />
            <TouchableOpacity
                className="relative self-center mb-6"
                onPress={handleSubmit}
                activeOpacity={0.8}
                disabled={isLoading}
            >
                <View className="absolute top-1.5 left-1.5 right-[-6px] bottom-[-6px] bg-black" />
                <View className="bg-yellow py-4 px-16 border-2 border-black items-center">
                    <Text className="font-inter_bold text-black text-xl">{isLoading ? 'Sending...' : 'Send Reset Link'}</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.back()}>
                <Text className="text-center font-inter_medium text-white/80 underline">Back</Text>
            </TouchableOpacity>
        </View>
    );
}