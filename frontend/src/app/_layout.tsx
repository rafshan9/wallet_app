import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Rubik_400Regular, Rubik_500Medium, Rubik_700Bold } from '@expo-google-fonts/rubik';
import { useEffect } from 'react';
import '../../global.css';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    Rubik_400Regular,
    Rubik_500Medium,
    Rubik_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || error) {
      // Hide the splash screen once fonts are ready
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  // Prevent rendering the app until the fonts are successfully loaded
  if (!fontsLoaded && !error) {
    return null;
  }

  return <Slot />;
}