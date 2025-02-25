import { Slot, Stack } from "expo-router";

// Import your global CSS file
import "../../../../global.css";

export default function _layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{headerShown: false}} />
    </Stack>
  )
}