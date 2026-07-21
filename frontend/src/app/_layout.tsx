import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_700Bold, Inter_900Black } from '@expo-google-fonts/inter';
import { AlfaSlabOne_400Regular } from '@expo-google-fonts/alfa-slab-one';
import { useEffect } from 'react';
import '../../global.css';
import { AlertModalProvider } from '../components/AlertModal';

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

  useEffect(() => {
    if (fontsLoaded || error) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) {
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