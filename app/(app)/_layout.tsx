import { Stack } from "expo-router";

// Import your global CSS file
import "../../global.css"
import { DateContextProvider } from "@/context/dateContext";
import { GroupsProvider } from "@/context/groupsContext";
import { HomeHeader } from "@/components/HomeHeader";
import { useAuth } from "@/context/authContext";

export default function _layout() {
  const { user } = useAuth();

  return (
    <DateContextProvider>
      <GroupsProvider>
        <Stack
          screenOptions={{
            header: props => <HomeHeader userName={user?.username} />,
          }}
        >
          <Stack.Screen name="(tabs)" />
        </Stack>
      </GroupsProvider>
    </DateContextProvider>
  )
}