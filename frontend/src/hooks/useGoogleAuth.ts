import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { GoogleSignin, isErrorWithCode, statusCodes } from '@react-native-google-signin/google-signin';
import api from '../../utils/axios';
import { useAppStore } from '../../src/store';
import { useAlert } from '../components/AlertModal';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export function useGoogleAuth() {
    const router = useRouter();
    const showAlert = useAlert();

    const handleGoogleAuth = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            await GoogleSignin.signOut(); // clears the cached session so the picker shows again
            const response = await GoogleSignin.signIn();

            if (response.type !== 'success' || !response.data?.idToken) return;

            const res = await axios.post(`${API_URL}/api/auth/google/`, {
                id_token: response.data.idToken,
            });

            await SecureStore.setItemAsync('accessToken', res.data.access);
            await SecureStore.setItemAsync('refreshToken', res.data.refresh);

            const profileRes = await api.get('/account/profile/');
            useAppStore.getState().setUser(profileRes.data);
            router.replace('/');
        } catch (error: any) {
            if (isErrorWithCode(error) && error.code === statusCodes.SIGN_IN_CANCELLED) return;
            console.log('Sign-in error code:', error?.code);
            console.log('Sign-in error message:', error?.message);
            showAlert({ title: 'Error', message: 'Google sign-in failed' });
        }
    };

    return { handleGoogleAuth };
}