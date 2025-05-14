import { RelativePathString, router, Slot, useSegments } from "expo-router";

// Import your global CSS file
import "../global.css"
import { AuthContextProvider, useAuth } from '@/context/authContext';
import { useEffect } from 'react';
import { useFonts } from "@expo-google-fonts/inter/useFonts";
import { Inter_500Medium } from "@expo-google-fonts/inter/500Medium";
import { Inter_100Thin } from "@expo-google-fonts/inter/100Thin";
import { Inter_400Regular } from "@expo-google-fonts/inter/400Regular";
import { Inter_700Bold } from "@expo-google-fonts/inter/700Bold";
import { ActivityIndicator, View } from "react-native";

const MainLayout = () => {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();

  let [fontsLoaded] = useFonts({
    Inter_700Bold,
    Inter_500Medium,
    Inter_400Regular,
    Inter_100Thin,
  });

  useEffect(() => {
    // check if user is authenticated or not
    if (!fontsLoaded || typeof isAuthenticated === 'undefined') return;

    const inApp = segments[0] == '(app)';
    if (isAuthenticated && !inApp) {
      // redirect to home
      router.replace('/(app)' as RelativePathString);
    } else if (!isAuthenticated && inApp) {
      // redirect to sign
      router.replace('/signIn');
    }
  }, [isAuthenticated, segments, fontsLoaded]);

  if (!fontsLoaded || typeof isAuthenticated === 'undefined') {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <ActivityIndicator color="white" />
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthContextProvider>
      <MainLayout />
    </AuthContextProvider>
  )
}