import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import api from '../../utils/axios';
import { useAppStore } from '../../src/store';
import { useAlert } from '../components/AlertModal';
import PasswordValidator from '../components/PasswordValidator';
import CurrencyPickerModal from '../components/CurrencyComponents/CurrencyPickerModal';
import { CURRENCIES } from '../../src/constants/currencies';

export default function AccountSettingsScreen() {
    const router = useRouter();
    const { user, preferredCurrency, setPreferredCurrency } = useAppStore();
    const showAlert = useAlert();
    const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);

    // Change name state
    const [showChangeName, setShowChangeName] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [isSavingName, setIsSavingName] = useState(false);

    // Change username state
    const [showChangeUsername, setShowChangeUsername] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
    const [usernameError, setUsernameError] = useState('');
    const [usernameSuggestions, setUsernameSuggestions] = useState<string[]>([]);
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSavingUsername, setIsSavingUsername] = useState(false);

    // Change password state
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    // Debounced username availability check
    useEffect(() => {
        setUsernameAvailable(null);
        setUsernameError('');
        setUsernameSuggestions([]);

        if (!newUsername.trim() || newUsername.trim().length < 3) return;

        const timer = setTimeout(async () => {
            setIsCheckingUsername(true);
            try {
                const res = await api.get('/account/check-username/', {
                    params: { username: newUsername.trim() },
                });
                setUsernameAvailable(res.data.available);
                if (!res.data.available) {
                    setUsernameError('Username is taken.');
                }
            } catch {
                // silently fail
            } finally {
                setIsCheckingUsername(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [newUsername]);

    const handleChangeName = async () => {
        const trimmedFirst = firstName.trim();
        const trimmedLast = lastName.trim();

        if (!trimmedFirst) {
            showAlert({ title: 'Error', message: 'First name is required.' });
            return;
        }

        setIsSavingName(true);
        try {
            const res = await api.post('/account/change-name/', {
                first_name: trimmedFirst,
                last_name: trimmedLast
            });
            showAlert({ title: 'Success', message: 'Name updated.' });
            const currentUser = useAppStore.getState().user;
            if (currentUser) {
                useAppStore.getState().setUser({
                    ...currentUser,
                    first_name: res.data.first_name,
                    last_name: res.data.last_name
                });
            }
            setShowChangeName(false);
            setFirstName('');
            setLastName('');
        } catch (error: any) {
            const message = error.response?.data?.error || 'Could not change name.';
            showAlert({ title: 'Error', message });
        } finally {
            setIsSavingName(false);
        }
    };

    const handleChangeUsername = async () => {
        const trimmed = newUsername.trim();
        if (!trimmed) {
            showAlert({ title: 'Error', message: 'Please enter a username.' });
            return;
        }

        setIsSavingUsername(true);
        try {
            const res = await api.post('/account/change-username/', { username: trimmed });
            showAlert({ title: 'Success', message: 'Username updated.' });
            const currentUser = useAppStore.getState().user;
            if (currentUser) {
                useAppStore.getState().setUser({ ...currentUser, username: res.data.username });
            }
            setShowChangeUsername(false);
            setNewUsername('');
        } catch (error: any) {
            const data = error.response?.data;
            const message = data?.error || 'Could not change username.';
            if (data?.suggestions?.length) {
                setUsernameSuggestions(data.suggestions);
            }
            showAlert({ title: 'Error', message });
        } finally {
            setIsSavingUsername(false);
        }
    };

    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            showAlert({ title: 'Error', message: 'Please fill in all fields.' });
            return;
        }
        if (newPassword !== confirmPassword) {
            showAlert({ title: 'Error', message: 'New passwords do not match.' });
            return;
        }

        setIsChangingPassword(true);
        try {
            await api.post('/account/change-password/', {
                old_password: oldPassword,
                new_password: newPassword,
            });
            showAlert({ title: 'Success', message: 'Your password has been changed.' });
            setShowChangePassword(false);
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            const message = error.response?.data?.error || 'Could not change password.';
            showAlert({ title: 'Error', message: Array.isArray(message) ? message.join('\n') : message });
        } finally {
            setIsChangingPassword(false);
        }
    };

    const handleLogout = async () => {
        try {
            await SecureStore.deleteItemAsync('accessToken');
            useAppStore.getState().setUser(null);
            router.replace('/login');
        } catch (error) {
            console.error("Failed to log out:", error);
        }
    };

    const handleDeleteAccount = () => {
        showAlert({
            title: "Delete Account",
            message: "Are you sure? This will permanently delete your account and all your data. This action cannot be undone.",
            buttons: [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await api.delete('/account/delete/');
                            await SecureStore.deleteItemAsync('accessToken');
                            useAppStore.getState().setUser(null);
                            router.replace('/login');
                        } catch (error) {
                            console.error("Failed to delete account:", error);
                        }
                    }
                }
            ]
        });
    };

    const SettingsRow = ({ icon, label, onPress, rightElement, destructive }: {
        icon: string;
        label: string;
        onPress?: () => void;
        rightElement?: React.ReactNode;
        destructive?: boolean;
    }) => (
        <TouchableOpacity
            className="flex-row items-center justify-between bg-white p-5 rounded-2xl border-2 border-black"
            onPress={onPress}
            activeOpacity={onPress ? 0.7 : 1}
        >
            <View className="flex-row items-center flex-1">
                <Feather name={icon as any} size={22} color={destructive ? '#DC2626' : 'black'} />
                <Text className={`ml-4 text-lg font-jb_mono_medium ${destructive ? 'text-red-600' : 'text-black'}`}>{label}</Text>
            </View>
            {rightElement || (onPress && <Feather name="chevron-right" size={22} color="gray" />)}
        </TouchableOpacity>
    );

    return (
        <>
        <ScrollView className="flex-1 bg-background pt-16 px-6" contentContainerStyle={{ paddingBottom: 60 }}>

            {/* Top Bar */}
            <View className="flex-row items-center mb-8">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-12 h-12 bg-yellow border-2 border-black rounded-full items-center justify-center shadow-sm"
                >
                    <Feather name="arrow-left" size={24} color="black" />
                </TouchableOpacity>
                <Text className="text-2xl font-jb_mono_bold ml-4 text-black">Account Settings</Text>
            </View>

            {/* Account Info Section */}
            <Text className="text-black/60 font-jb_mono_bold text-sm uppercase tracking-wider mb-3 ml-1">Account</Text>
            <View className="gap-y-3 mb-8">
                {/* Name Row */}
                <SettingsRow
                    icon="user"
                    label={`Name: ${user ? `${user.first_name} ${user.last_name}` : '—'}`}
                    onPress={() => {
                        setShowChangeName(!showChangeName);
                        if (!showChangeName) {
                            setFirstName(user?.first_name || '');
                            setLastName(user?.last_name || '');
                        }
                    }}
                />

                {/* Change Name Expandable */}
                {showChangeName && (
                    <View className="bg-white/10 p-5 rounded-2xl border-2 border-white/20">
                        <View className="mb-4 gap-y-3">
                            <TextInput
                                placeholder="First Name"
                                value={firstName}
                                onChangeText={setFirstName}
                                className="bg-white text-black px-6 py-4 rounded-2xl border-2 border-black font-jb_mono_medium text-lg placeholder:text-gray-400"
                            />
                            <TextInput
                                placeholder="Last Name (Optional)"
                                value={lastName}
                                onChangeText={setLastName}
                                className="bg-white text-black px-6 py-4 rounded-2xl border-2 border-black font-jb_mono_medium text-lg placeholder:text-gray-400"
                            />
                        </View>

                        <TouchableOpacity
                            className="relative self-center"
                            onPress={handleChangeName}
                            activeOpacity={0.8}
                            disabled={isSavingName}
                        >
                            <View className="absolute top-1.5 left-1.5 right-[-6px] bottom-[-6px] bg-black" />
                            <View className="bg-yellow py-3 px-12 border-2 border-black items-center">
                                <Text className="font-jb_mono_bold text-black text-lg">
                                    {isSavingName ? 'Saving...' : 'Update Name'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                )}

                <View className="bg-white p-5 rounded-2xl border-2 border-black">
                    <Text className="text-sm font-jb_mono_medium text-gray-500 mb-1">Email</Text>
                    <Text className="text-lg font-jb_mono_bold text-black">
                        {user?.email || '—'}
                    </Text>
                </View>

                {/* Username Row */}
                <SettingsRow
                    icon="at-sign"
                    label={`Username: ${user?.username || '—'}`}
                    onPress={() => {
                        setShowChangeUsername(!showChangeUsername);
                        if (!showChangeUsername) setNewUsername('');
                    }}
                />

                {/* Change Username Expandable */}
                {showChangeUsername && (
                    <View className="bg-white/10 p-5 rounded-2xl border-2 border-white/20">
                        <View className="relative mb-2">
                            <TextInput
                                placeholder="New username"
                                autoCapitalize="none"
                                autoCorrect={false}
                                value={newUsername}
                                onChangeText={setNewUsername}
                                className="bg-white text-black px-6 py-4 pr-14 rounded-2xl border-2 border-black font-jb_mono_medium text-lg placeholder:text-gray-400"
                            />
                            {/* Availability indicator */}
                            <View className="absolute right-4 top-5 z-10">
                                {isCheckingUsername ? (
                                    <ActivityIndicator size="small" color="gray" />
                                ) : usernameAvailable === true ? (
                                    <Feather name="check-circle" size={24} color="#22C55E" />
                                ) : usernameAvailable === false ? (
                                    <Feather name="x-circle" size={24} color="#EF4444" />
                                ) : null}
                            </View>
                        </View>

                        {/* Availability message */}
                        {usernameAvailable === true && newUsername.trim().length >= 3 && (
                            <Text className="text-green-400 font-jb_mono_medium text-sm mb-3 ml-1">Username is available!</Text>
                        )}
                        {usernameError ? (
                            <Text className="text-red-400 font-jb_mono_medium text-sm mb-3 ml-1">{usernameError}</Text>
                        ) : null}

                        {/* Suggestions */}
                        {usernameSuggestions.length > 0 && (
                            <View className="mb-4">
                                <Text className="text-white/70 font-jb_mono_medium text-sm mb-2 ml-1">Try one of these:</Text>
                                <View className="flex-row flex-wrap gap-2">
                                    {usernameSuggestions.map((s) => (
                                        <TouchableOpacity
                                            key={s}
                                            className="bg-yellow/90 px-4 py-2 rounded-xl border-2 border-black"
                                            onPress={() => {
                                                setNewUsername(s);
                                                setUsernameSuggestions([]);
                                                setUsernameError('');
                                            }}
                                        >
                                            <Text className="font-jb_mono_bold text-black">{s}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        )}

                        {/* Validation hints */}
                        <Text className="text-white/40 font-jb_mono_medium text-xs mb-4 ml-1">
                            3–30 characters. Letters, numbers, and underscores only.
                        </Text>

                        {/* Submit Button */}
                        <TouchableOpacity
                            className="relative self-center"
                            onPress={handleChangeUsername}
                            activeOpacity={0.8}
                            disabled={isSavingUsername || usernameAvailable === false}
                        >
                            <View className="absolute top-1.5 left-1.5 right-[-6px] bottom-[-6px] bg-black" />
                            <View className={`py-3 px-12 border-2 border-black items-center ${usernameAvailable === false ? 'bg-gray-400' : 'bg-yellow'}`}>
                                <Text className="font-jb_mono_bold text-black text-lg">
                                    {isSavingUsername ? 'Saving...' : 'Update Username'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* Preferences Section */}
            <Text className="text-black/60 font-jb_mono_bold text-sm uppercase tracking-wider mb-3 ml-1">Preferences</Text>
            <View className="gap-y-3 mb-8">
                <SettingsRow
                    icon="globe"
                    label={`Currency: ${preferredCurrency}`}
                    onPress={() => setShowCurrencyPicker(true)}
                />
            </View>

            {/* Security Section */}
            <Text className="text-black/60 font-jb_mono_bold text-sm uppercase tracking-wider mb-3 ml-1">Security</Text>
            <View className="gap-y-3 mb-8">
                <SettingsRow
                    icon="lock"
                    label="Change Password"
                    onPress={() => setShowChangePassword(!showChangePassword)}
                />

                {/* Change Password Expandable Section */}
                {showChangePassword && (
                    <View className="bg-white/10 p-5 rounded-2xl border-2 border-white/20">
                        {/* Old Password */}
                        <View className="relative mb-4">
                            <TextInput
                                placeholder="Current password"
                                secureTextEntry={!showOldPassword}
                                value={oldPassword}
                                autoCapitalize="none"
                                onChangeText={setOldPassword}
                                className="bg-white text-black px-6 py-4 pr-14 rounded-2xl border-2 border-black font-jb_mono_medium text-lg placeholder:text-gray-400"
                            />
                            <TouchableOpacity
                                className="absolute right-4 top-5 z-10"
                                onPress={() => setShowOldPassword(!showOldPassword)}
                            >
                                <Feather name={showOldPassword ? "eye" : "eye-off"} size={24} color="gray" />
                            </TouchableOpacity>
                        </View>

                        {/* New Password */}
                        <View className="relative mb-4">
                            <TextInput
                                placeholder="New password"
                                secureTextEntry={!showNewPassword}
                                value={newPassword}
                                autoCapitalize="none"
                                onChangeText={setNewPassword}
                                className="bg-white text-black px-6 py-4 pr-14 rounded-2xl border-2 border-black font-jb_mono_medium text-lg placeholder:text-gray-400"
                            />
                            <TouchableOpacity
                                className="absolute right-4 top-5 z-10"
                                onPress={() => setShowNewPassword(!showNewPassword)}
                            >
                                <Feather name={showNewPassword ? "eye" : "eye-off"} size={24} color="gray" />
                            </TouchableOpacity>
                        </View>

                        <PasswordValidator password={newPassword} />

                        {/* Confirm New Password */}
                        <View className="relative mb-6">
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

                        {/* Submit Button */}
                        <TouchableOpacity
                            className="relative self-center"
                            onPress={handleChangePassword}
                            activeOpacity={0.8}
                            disabled={isChangingPassword}
                        >
                            <View className="absolute top-1.5 left-1.5 right-[-6px] bottom-[-6px] bg-black" />
                            <View className="bg-yellow py-3 px-12 border-2 border-black items-center">
                                <Text className="font-jb_mono_bold text-black text-lg">
                                    {isChangingPassword ? 'Saving...' : 'Update Password'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                )}

            </View>

            {/* Support Section */}
            <Text className="text-black/60 font-jb_mono_bold text-sm uppercase tracking-wider mb-3 ml-1">Support</Text>
            <View className="gap-y-3 mb-8">
                <SettingsRow
                    icon="help-circle"
                    label="Help & FAQ"
                />
                <SettingsRow
                    icon="message-circle"
                    label="Contact Support"
                />
                <SettingsRow
                    icon="file-text"
                    label="Terms of Service"
                />
                <SettingsRow
                    icon="shield"
                    label="Privacy Policy"
                />
            </View>

            {/* Danger Zone */}
            <Text className="text-red-400/60 font-jb_mono_bold text-sm uppercase tracking-wider mb-3 ml-1">Danger Zone</Text>
            <View className="gap-y-3 mb-8">
                {/* Logout Button */}
                <TouchableOpacity
                    className="flex-row rounded-xl items-center justify-center gap-4 bg-yellow py-4 px-16 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6"
                    onPress={handleLogout}
                    activeOpacity={1}
                >
                    <Feather name="log-out" size={24} color="black" />
                    <Text className="font-jb_mono_bold text-black text-xl">Log Out</Text>
                </TouchableOpacity>

                {/* Delete Account Button */}
                <TouchableOpacity
                    className="flex-row rounded-xl items-center justify-center gap-4 bg-background_red py-4 px-16 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-12"
                    onPress={handleDeleteAccount}
                    activeOpacity={1}
                >
                    <Feather name="trash-2" size={24} color="black" />
                    <Text className="font-jb_mono_bold text-black text-xl">Delete Account</Text>
                </TouchableOpacity>
            </View>

            {/* App Version */}
            <Text className="text-center text-white/30 font-jb_mono_medium text-sm mb-4">Spends v1.0.0</Text>
        </ScrollView>

        <CurrencyPickerModal
            visible={showCurrencyPicker}
            onClose={() => setShowCurrencyPicker(false)}
            onSelect={(code) => setPreferredCurrency(code)}
            selected={preferredCurrency}
            title="Preferred Currency"
        />
        </>
    );
}
