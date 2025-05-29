import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";
import React from "react";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.light.secondary },
        // animation: "slide_from_right",
        gestureEnabled: true,
      }}
    >
      <Stack.Screen
        name="welcome"
        options={{
          animationTypeForReplace: "pop",
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          animationTypeForReplace: "pop",
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          animationTypeForReplace: "pop",
        }}
      />
    </Stack>
  );
}
