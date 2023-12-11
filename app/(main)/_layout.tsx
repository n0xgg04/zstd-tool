import { Tabs } from "expo-router";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Layout() {
  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: true,
        }}
        initialRouteName="index"
        sceneContainerStyle={{
          backgroundColor: "#fff",
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            headerShown: false,
            title: "Nén/Giải nén",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="repeat" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="main"
          options={{
            title: "Từ điển",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="ios-book" color={color} size={size} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
