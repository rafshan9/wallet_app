import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import axios from 'axios';
import { useAlert } from '../../components/AlertModal';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function VerifyPendingScreen() {
    const { email: emailParam } = useLocalSearchParams<{ email?: string }>();
    const router = useRouter();
    const showAlert = useAlert();
    const [email, setEmail] = useState(emailParam ?? '');
    const [resending, setResending] = useState(false);

    const handleResend = async () => {
        if (!email.trim()) {
            showAlert({ title: 'Error', message: 'Enter the email you signed up with.' });
            return;
        }
        setResending(true);
        try {
            await axios.post(`${API_URL}/api/auth/resend-verification/`, { email: email.trim() });
            showAlert({ title: 'Check your email', message: 'If that email needs verifying, a new link has been sent.' });
        } catch {
            showAlert({ title: 'Error', message: 'Something went wrong. Try again.' });
        } finally {
            setResending(false);
        }
    };

    return (
        <View className="flex-1 bg-background_red justify-center px-6">
            <Text className="text-2xl font-inter_bold text-white text-center mb-4">Check your email</Text>

            {emailParam ? (
                <Text className="text-white/80 text-center mb-8">
                    We sent a verification link to {emailParam}. Tap it, then come back and log in.
                </Text>
            ) : (
                <TextInput
                    placeholder="Email you signed up with"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                    className="bg-white px-6 py-4 rounded-2xl border-2 border-black font-inter_medium text-lg mb-6 placeholder:text-gray-400"
                />
            )}

            <TouchableOpacity onPress={handleResend} disabled={resending} className="mb-6">
                <Text className="text-center font-inter_medium text-white/80 underline">
                    {resending ? 'Sending...' : "Didn't get it? Resend"}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.replace('/login')}>
                <Text className="text-center font-inter_bold text-white underline">Go to Login</Text>
            </TouchableOpacity>
        </View>
    );
}