import { router, Slot, useSegments } from "expo-router";

// Import your global CSS file
import "../global.css"
import { AuthContextProvider, useAuth } from '@/context/authContext';
import { useEffect } from 'react';

const MainLayout = () => {
  const {isAuthenticated} = useAuth();
  const segments = useSegments();

  useEffect(() => {
    // check if user is authenticated or not
    if(typeof isAuthenticated == 'undefined') return;
    const inApp = segments[0] == '(app)';
    if (isAuthenticated && !inApp) {
      // redirect to home
      router.replace('/(app)');
    } else if(!isAuthenticated) {
      // redirect to sign
      router.replace('/signIn');
    }
  }, [isAuthenticated]);

  return <Slot />
}

export default function RootLayout() {
  return (
    <AuthContextProvider>
      <MainLayout />
    </AuthContextProvider>
  )
}