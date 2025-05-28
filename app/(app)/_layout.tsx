import { Stack } from "expo-router";

// Import your global CSS file
import "../../global.css"
import { DateContextProvider } from "@/context/dateContext";
import { GroupsProvider } from "@/context/groupsContext";
import { HomeHeader } from "@/components/navigation/HomeHeader";
import { useAppSelector } from "@/store/store";

export default function _layout() {
  const user = useAppSelector(state => state.auth.user);

  return (
    <DateContextProvider>
      <GroupsProvider>
        <Stack
          screenOptions={{
            header: props => <HomeHeader userName={user?.username} />,
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="addTraining" options={{ headerShown: false, presentation: 'modal' }} />
        </Stack>
      </GroupsProvider>
    </DateContextProvider>
  )
}