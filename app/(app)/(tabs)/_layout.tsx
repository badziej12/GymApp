import { Tabs } from "expo-router";

// Import your global CSS file
import "../../../global.css"
import { FontAwesome } from "@expo/vector-icons";
import { View } from "react-native";
import { Children } from "react";

export default function _layout() {
  return (
    <Tabs screenOptions={{
          tabBarActiveTintColor: 'white',
          tabBarStyle: {
            backgroundColor: '#D9D9D9',
          },
      }}>
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
          headerShown: false,
          title: 'Posts',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="circle" color={color} />,
        }}
      />
      <Tabs.Screen
        name="(addTraining)"
        options={{
          headerShown: false,
          title: 'Add training',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="circle" color={color} />,
        }}
       />
    </Tabs>
  )
}