import { Slot, Stack } from "expo-router";

// Import your global CSS file
import "../../../../global.css";

export default function _layout() {



  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="createGroup" options={{ headerShown: false }} />
      <Stack.Screen name="groups/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="groups/addMember" options={{ presentation: 'modal', headerShown: false }} />
    </Stack>
  )
}