import { Tabs } from "expo-router";

// Import your global CSS file
import "../../../global.css"
import { FontAwesome } from "@expo/vector-icons";
import { Text, Image, Pressable } from "react-native";
import { Children } from "react";
import TabBar from "@/components/navigation/TabBar";

export default function _layout() {
  return (
    <Tabs tabBar={props => <TabBar {...props} />}>
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          tabBarIcon: () => <Image source={require('@/assets/images/home-tab-icon.png')} style={{ width: 40, height: 40 }} />,
        }}
      />
      <Tabs.Screen
        name="(groups)"
        options={{
          headerShown: false,
          tabBarIcon: () => <Image source={require('@/assets/images/groups-tab-icon.png')} style={{ width: 40, height: 40 }} />,
        }}
      />
      <Tabs.Screen
        name="(addTraining)"
        options={{
          href: null,
          headerShown: false,
          title: 'Add training',
          tabBarIcon: () => <Text style={{ fontSize: 60, lineHeight: 53 }} className="font-thin">+</Text>,
        }}
      />
      <Tabs.Screen
        name="(posts)"
        options={{
          headerShown: false,
          title: 'Posts',
          tabBarIcon: () => <Image source={require('@/assets/images/achivements-tab-icon.png')} style={{ width: 40, height: 40 }} />,
        }}
      />
      <Tabs.Screen
        name="(gowno)"
        options={{
          headerShown: false,
          title: 'Posts',
          tabBarIcon: () => <Image source={require('@/assets/images/rewards-tab-icon.png')} style={{ width: 40, height: 40 }} />,
        }}
      />
    </Tabs>
  )
}