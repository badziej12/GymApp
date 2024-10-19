import { Slot, Stack } from "expo-router";

// Import your global CSS file
import "../../global.css"
import { View } from 'react-native';
import { HomeHeader } from '@/components/HomeHeader';

export default function _layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{header: () => <HomeHeader title="Posts" />}} />
      <Stack.Screen name="createPost" options={{ header: () => <HomeHeader title="Create posts" /> }} />
    </Stack>
  )
}