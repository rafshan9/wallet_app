import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import api from '../../../utils/axios';
import { useAppStore } from '../../../src/store';


const API_URL = process.env.EXPO_PUBLIC_API_URL;
export default function LoginScreen() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

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
            Alert.alert('Error', 'Invalid credentials');
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
            <TextInput
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                className="bg-white px-6 py-4 rounded-2xl border-2 border-black font-inter_medium text-lg mb-8 placeholder:text-gray-400"
            />

            <TouchableOpacity
                className="relative self-center mb-6"
                onPress={handleLogin}
                activeOpacity={0.8}
            >
                {/* The Solid Shadow */}
                <View className="absolute top-1.5 left-1.5 right-[-6px] bottom-[-6px] bg-black" />

                {/* The Button */}
                <View className="bg-yellow py-4 px-16 border-2 border-black items-center">
                    <Text className="font-inter_bold text-xl">Login</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/signup')}>
                <Text className="text-center font-inter_medium text-white/80">
                    Don't have an account? <Text className="text-white font-inter_bold underline">Sign Up</Text>
                </Text>
            </TouchableOpacity>
        </View>
    );
}