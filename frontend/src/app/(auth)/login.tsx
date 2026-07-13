import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

export default function LoginScreen() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://10.0.2.2:8000/api/token/', {
                username,
                password
            });
            await SecureStore.setItemAsync('accessToken', response.data.access);
            await SecureStore.setItemAsync('refreshToken', response.data.refresh);

            router.replace('/');
        } catch (error) {
            Alert.alert('Error', 'Invalid credentials');
        }
    };

    return (
        <View className="flex-1 bg-background justify-center px-6">
            <Text className="text-4xl font-rubik_bold mb-8 text-center">Welcome Back</Text>

            <TextInput
                placeholder="Username"
                autoCapitalize="none"
                value={username}
                onChangeText={setUsername}
                className="bg-white px-6 py-4 rounded-2xl border-2 border-black font-rubik_medium text-lg mb-4"
            />
            <TextInput
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                className="bg-white px-6 py-4 rounded-2xl border-2 border-black font-rubik_medium text-lg mb-8"
            />

            <TouchableOpacity
                className="bg-yellow py-4 rounded-full border-2 border-black items-center shadow-md mb-6"
                onPress={handleLogin}
            >
                <Text className="font-rubik_bold text-xl">Login</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/signup')}>
                <Text className="text-center font-rubik_medium text-gray-600">
                    Don't have an account? <Text className="text-black font-rubik_bold underline">Sign Up</Text>
                </Text>
            </TouchableOpacity>
        </View>
    );
}