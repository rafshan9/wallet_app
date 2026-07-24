import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_700Bold, Inter_900Black } from '@expo-google-fonts/inter';
import { AlfaSlabOne_400Regular } from '@expo-google-fonts/alfa-slab-one';
import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import '../../global.css';
import { AlertModalProvider } from '../components/AlertModal';
import api from '../../utils/axios';
import { useAppStore } from '../../src/store';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
    Inter_900Black,
    AlfaSlabOne_400Regular,
  });

  // subscribe to the store — this must be a hook, not getState(), so
  // RootLayout re-renders (and Stack.Protected re-evaluates) whenever
  // the interceptor logs someone out mid-session
  const user = useAppStore((state) => state.user);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    });
  }, []);

  const [userLoaded, setUserLoaded] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const token = await SecureStore.getItemAsync('accessToken');
      if (token) {
        try {
          const res = await api.get('/account/profile/');
          useAppStore.getState().setUser(res.data);
        } catch (err: any) {
          if (err?.response?.status !== 401) {
            // network/server error, not an invalid token — don't wipe a possibly-valid session
            console.error('Failed to load user profile:', err);
          }
          // on a real 401, the axios interceptor already cleared tokens + setUser(null)
        }
      }
      setUserLoaded(true);
    };
    loadUser();
  }, []);

  useEffect(() => {
    if ((fontsLoaded || error) && userLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error, userLoaded]);

  if ((!fontsLoaded && !error) || !userLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AlertModalProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Protected guard={!!user}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="goal/[id]" />
            <Stack.Screen name="profile" />
          </Stack.Protected>

          <Stack.Protected guard={!user}>
            <Stack.Screen name="(auth)" />
          </Stack.Protected>
        </Stack>
      </AlertModalProvider>
    </QueryClientProvider>
  );
}