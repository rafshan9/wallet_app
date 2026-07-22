import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import axios from 'axios';
import { useAlert } from '../../components/AlertModal';
import PasswordValidator from '../../components/PasswordValidator';
import { Feather } from '@expo/vector-icons';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function SignUpScreen() {
    const router = useRouter();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const showAlert = useAlert();
    const [errorFields, setErrorFields] = useState<string[]>([]);

    const handleSignUp = async () => {
        if (!firstName.trim() || !lastName.trim() || !username.trim() || !email.trim() || !password || !confirmPassword) {
            showAlert({ title: 'Missing Info', message: 'Please fill in all fields.' });
            return;
        }

        if (password !== confirmPassword) {
            showAlert({ title: 'Error', message: 'Passwords do not match.' });
            return;
        }

        try {
            await axios.post(`${API_URL}/api/signup/`, {
                username,
                email,
                password,
                first_name: firstName.trim(),
                last_name: lastName.trim(),
            });

            showAlert({ title: 'Success', message: 'Account created! Please log in.' });
            router.replace('/login');
        } catch (error: any) {
            console.log("BACKEND ERROR:", error.response?.data || error.message);
            showAlert({ title: 'Error', message: 'Could not create account. Check your details.' });
        }
    };

    return (
        <View className="flex-1 bg-background_blue justify-center px-6">
            <View className="bg-yellow mb-4 p-2 self-center">
                <Text className="text-4xl font-alfa text-black text-center">SPENDS</Text>
            </View>

            <View className="flex-row gap-3 mb-4">
                <TextInput
                    placeholder="First Name"
                    autoCapitalize="words"
                    value={firstName}
                    onChangeText={setFirstName}
                    className="flex-1 bg-white px-6 py-4 rounded-2xl border-2 border-black font-inter_medium text-lg placeholder:text-gray-400"
                />
                <TextInput
                    placeholder="Last Name"
                    autoCapitalize="words"
                    value={lastName}
                    onChangeText={setLastName}
                    className="flex-1 bg-white px-6 py-4 rounded-2xl border-2 border-black font-inter_medium text-lg placeholder:text-gray-400"
                />
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
            <View className="relative mb-4">
                <TextInput
                    placeholder="Password"
                    secureTextEntry={!showPassword}
                    value={password}
                    autoCapitalize='none'
                    onChangeText={setPassword}
                    // Added pr-14, removed mb-8
                    className="bg-white text-black px-6 py-4 pr-14 rounded-2xl border-2 border-black font-inter_medium text-lg placeholder:text-gray-400"
                />
                <TouchableOpacity
                    className="absolute right-4 top-5 z-10"
                    onPress={() => setShowPassword(!showPassword)}
                >
                    <Feather name={showPassword ? "eye" : "eye-off"} size={24} color="gray" />
                </TouchableOpacity>
            </View>

            <PasswordValidator password={password} />

            <View className="relative mb-8">
                <TextInput
                    placeholder="Confirm Password"
                    secureTextEntry={!showConfirmPassword}
                    value={confirmPassword}
                    autoCapitalize="none"
                    onChangeText={setConfirmPassword}
                    // Added pr-14, removed mb-8
                    className="bg-white text-black px-6 py-4 pr-14 rounded-2xl border-2 border-black font-inter_medium text-lg placeholder:text-gray-400"
                />
                <TouchableOpacity
                    className="absolute right-4 top-5 z-10"
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                    <Feather name={showConfirmPassword ? "eye" : "eye-off"} size={24} color="gray" />
                </TouchableOpacity>
            </View>

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