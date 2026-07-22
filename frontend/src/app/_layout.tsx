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

SplashScreen.preventAutoHideAsync();

// Moved outside to prevent recreating on every render
const queryClient = new QueryClient();

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
    Inter_900Black,
    AlfaSlabOne_400Regular,
  });

  const [userLoaded, setUserLoaded] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const token = await SecureStore.getItemAsync('accessToken');
      if (token) {
        try {
          const res = await api.get('/account/profile/');
          useAppStore.getState().setUser(res.data);
        } catch (err) {
          console.error('Failed to load user profile:', err);
          await SecureStore.deleteItemAsync('accessToken');
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
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="goal/[id]" />
          <Stack.Screen name="profile" />
        </Stack>
      </AlertModalProvider>
    </QueryClientProvider>
  );
}