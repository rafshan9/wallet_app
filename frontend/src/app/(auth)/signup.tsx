import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function SignUpScreen() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = async () => {
        try {
            // Remember to replace with your local IP address
            await axios.post(`${API_URL}/api/signup/`, {
                username,
                email,
                password
            });

            Alert.alert('Success', 'Account created! Please log in.');
            router.replace('/login');
        } catch (error: any) {
            // This will print the exact Django error to your VS Code terminal
            console.log("BACKEND ERROR:", error.response?.data || error.message);

            Alert.alert('Error', 'Could not create account. Check your details.');
        }
    };

    return (
        <View className="flex-1 bg-background_blue justify-center px-6">
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
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
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
                onPress={handleSignUp}
                activeOpacity={0.8}
            >
                {/* The Solid Shadow */}
                <View className="absolute top-1.5 left-1.5 right-[-6px] bottom-[-6px] bg-black" />

                {/* The Button */}
                <View className="bg-very_dark_blue py-4 px-16 border-2 border-black items-center">
                    <Text className="font-inter_bold text-white text-xl">Sign Up</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/login')}>
                <Text className="text-center font-inter_medium text-white">
                    Already have an account? <Text className="text-white font-inter_bold underline">Login</Text>
                </Text>
            </TouchableOpacity>
        </View>
    );
}