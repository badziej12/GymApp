import { Slot, Stack } from "expo-router";

// Import your global CSS file
import "../../global.css"
import { DateContextProvider } from "@/context/dateContext";

export default function _layout() {
  return (
    <DateContextProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{headerShown: false}} />
        <Stack.Screen name="addTraining" options={{headerShown: false}} />
      </Stack>
    </DateContextProvider>
  )
}