import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { useTranslation } from "react-i18next";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].primary,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="settings"
        options={{
          title: t("settings.title"),
          tabBarIcon: ({ color }: { color: string }) => (
            <IconSymbol size={28} name="gearshape.fill" color={color} />
          ),
        }}
      />
      {/* <Tabs.Screen
        name="index"
        options={{
          title: t("home.title"),
          tabBarIcon: ({ color }: { color: string }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      /> */}
      <Tabs.Screen
        name="index"
        options={{
          title: t("shipments.title"),
          tabBarIcon: ({ color }: { color: string }) => (
            <IconSymbol size={28} name="shippingbox.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="support"
        options={{
          title: t("support.title"),
          tabBarIcon: ({ color }: { color: string }) => (
            <IconSymbol size={28} name="person.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
