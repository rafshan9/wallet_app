import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import api from '../../../utils/axios';
import { useAppStore } from '../../../src/store';
import { useAlert } from '../../components/AlertModal';
import { Feather } from '@expo/vector-icons';
import { useGoogleAuth } from '../../hooks/useGoogleAuth';
import GoogleAuthButton from '../../components/GoogleAuthButton';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function LoginScreen() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const showAlert = useAlert();
    const [showPassword, setShowPassword] = useState(false);
    const [loginFailed, setLoginFailed] = useState(false);
    const { handleGoogleAuth } = useGoogleAuth();

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${API_URL}/api/token/`, {
                username,
                password
            });
            await SecureStore.setItemAsync('accessToken', response.data.access);
            await SecureStore.setItemAsync('refreshToken', response.data.refresh);

            const profileRes = await api.get('/account/profile/');
            useAppStore.getState().setUser(profileRes.data);

            router.replace('/');
        } catch (error) {
            setLoginFailed(true);
            showAlert({ title: 'Error', message: 'Invalid credentials, or your email may not be verified yet.' });
        }
    };

    return (
        <View className="flex-1 bg-background_red justify-center px-6">
            <View className="bg-yellow mb-4 p-2 self-center">
                <Text className="text-4xl font-alfa text-black text-center">SPENDS</Text>
            </View>

            <TextInput
                placeholder="Username"
                autoCapitalize="none"
                value={username}
                onChangeText={setUsername}
                className="bg-white px-6 py-4 rounded-2xl border-2 border-black font-inter_medium text-lg mb-4 placeholder:text-gray-400"
            />
            <View className="relative mb-2">
                <TextInput
                    placeholder="Password"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                    className="bg-white text-black px-6 py-4 pr-14 rounded-2xl border-2 border-black font-inter_medium text-lg placeholder:text-gray-400"
                />
                <TouchableOpacity
                    className="absolute right-4 top-5"
                    onPress={() => setShowPassword(!showPassword)}
                >
                    <Feather name={showPassword ? "eye" : "eye-off"} size={24} color="gray" />
                </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => router.push('/')} className="mb-4">
                <Text className="text-right font-inter_medium text-white/70 underline">
                    Forgot password?
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                className="relative self-center mb-6"
                onPress={handleLogin}
                activeOpacity={0.8}
            >
                <View className="absolute top-1.5 left-1.5 right-[-6px] bottom-[-6px] bg-black" />
                <View className="bg-yellow py-4 px-16 border-2 border-black items-center">
                    <Text className="font-inter_bold text-xl">Login</Text>
                </View>
            </TouchableOpacity>

            <GoogleAuthButton onPress={handleGoogleAuth} />

            {loginFailed && (
                <TouchableOpacity onPress={() => router.push('/verify-pending')} className="mb-2">
                    <Text className="text-center font-inter_medium text-white/70 underline">
                        Didn't verify your email yet?
                    </Text>
                </TouchableOpacity>
            )}

            <TouchableOpacity onPress={() => router.push('/signup')}>
                <Text className="text-center font-inter_medium text-white/80">
                    Don't have an account? <Text className="text-white font-inter_bold underline">Sign Up</Text>
                </Text>
            </TouchableOpacity>
        </View>
    );
}