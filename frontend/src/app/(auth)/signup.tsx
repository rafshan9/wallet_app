import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import axios from 'axios';

export default function SignUpScreen() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = async () => {
        try {
            // Remember to replace with your local IP address
            await axios.post('http://10.0.2.2:8000/api/signup/', {
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
        <View className="flex-1 bg-background justify-center px-6">
            <Text className="text-4xl font-rubik_bold mb-8 text-center">Create Account</Text>

            <TextInput
                placeholder="Username"
                autoCapitalize="none"
                value={username}
                onChangeText={setUsername}
                className="bg-white px-6 py-4 rounded-2xl border-2 border-black font-rubik_medium text-lg mb-4"
            />
            <TextInput
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
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
                onPress={handleSignUp}
                className="bg-green py-4 rounded-full border-2 border-black items-center shadow-md mb-6"
            >
                <Text className="text-black font-rubik_bold text-xl">Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/login')}>
                <Text className="text-center font-rubik_medium text-gray-600">
                    Already have an account? <Text className="text-black font-rubik_bold underline">Login</Text>
                </Text>
            </TouchableOpacity>
        </View>
    );
}