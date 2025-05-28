import { RelativePathString, router, Slot, useSegments } from "expo-router";
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';

// Import your global CSS file
import "../global.css"
import { useEffect } from 'react';
import { useFonts } from "@expo-google-fonts/inter/useFonts";
import { Inter_500Medium } from "@expo-google-fonts/inter/500Medium";
import { Inter_100Thin } from "@expo-google-fonts/inter/100Thin";
import { Inter_400Regular } from "@expo-google-fonts/inter/400Regular";
import { Inter_700Bold } from "@expo-google-fonts/inter/700Bold";
import { Rubik_400Regular_Italic, Rubik_700Bold_Italic, Rubik_600SemiBold_Italic } from "@expo-google-fonts/rubik";
import { Montserrat_700Bold_Italic, Montserrat_700Bold } from "@expo-google-fonts/montserrat";
import { Roboto_700Bold, Roboto_400Regular } from "@expo-google-fonts/roboto";
import { ActivityIndicator, View } from "react-native";
import store, { useAppDispatch, useAppSelector } from "@/store/store";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { updateUserDataAction } from "@/store/auth/auth-actions/update-user-data";
import { authActions } from "@/store/auth/auth-slice";

const MainLayout = () => {
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  const segments = useSegments();
  const dispatch = useAppDispatch();

  let [fontsLoaded] = useFonts({
    Inter_700Bold,
    Inter_500Medium,
    Inter_400Regular,
    Inter_100Thin,
    Rubik_700Bold_Italic,
    Rubik_600SemiBold_Italic,
    Rubik_400Regular_Italic,
    Montserrat_700Bold_Italic,
    Montserrat_700Bold,
    Roboto_700Bold,
    Roboto_400Regular
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user: User | null) => {

      if (user) {
        dispatch(authActions.setIsAuthenticated(true));
        dispatch(updateUserDataAction(user.uid));
      } else {
        dispatch(authActions.setIsAuthenticated(false));
        dispatch(authActions.setUser(null));
      }
    });
    return unsub;
  }, []);

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
    <Provider store={store}>
      <GestureHandlerRootView>
        <MainLayout />
      </GestureHandlerRootView>
    </Provider>
  )
}