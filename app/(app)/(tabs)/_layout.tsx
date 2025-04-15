import { Tabs } from "expo-router";

// Import your global CSS file
import "../../../global.css"
import { FontAwesome } from "@expo/vector-icons";

export default function _layout() {
  return (
    <Tabs screenOptions={{tabBarActiveTintColor: 'blue'}}>
      <Tabs.Screen
        name="(groups)"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="user" color={color} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="(posts)"
        options={{
          title: 'Posts',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="circle" color={color} />,
        }}
      />
    </Tabs>
  )
}