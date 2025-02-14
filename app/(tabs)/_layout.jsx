import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "./../../constants/Colors";

//layout to be followed by all tabs(at bottom)
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        //color for tabs
        tabBarActiveTintColor: Colors.PRIMARY,
      }}
    >
      {/*all tabs at bottom*/}
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: (
            { color } //icon for tabs imported
          ) => <Ionicons name="home" size={24} color={color} />, //color of icon is the system color
        }}
      />
      <Tabs.Screen
        name="favorite"
        options={{
          title: "Favorite",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="heart" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          title: "Inbox",
          headerShown: false,
          tabBarIcon: (
            { color } //icon for tabs imported
          ) => <Ionicons name="chatbubble" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: (
            { color } //icon for tabs imported
          ) => <Ionicons name="people-circle" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
