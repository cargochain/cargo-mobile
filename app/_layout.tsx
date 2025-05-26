import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { ApolloProvider } from "@apollo/client";
import { Alert, Platform, Linking } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";

import "@/i18n"; // Import i18n configuration
import { client } from "@/services/apolloClient";
import { AuthProvider, useAuth } from "@/services/authContext";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import { checkBiometricSetup, setupBiometric } from "@/services/biometricSetup";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { user } = useAuth();

  useEffect(() => {
    const checkBiometric = async () => {
      console.log("checkBiometric");
      if (!user?.id) return;
      console.log("[@@user]", user);

      try {
        // Check if device supports biometric authentication
        const compatible = await LocalAuthentication.hasHardwareAsync();
        const enrolled = await LocalAuthentication.isEnrolledAsync();

        console.log("compatible", compatible);
        console.log("enrolled", enrolled);

        if (!compatible || !enrolled) {
          console.log(
            "Device does not support biometric authentication or user is not enrolled"
          );
          if (Platform.OS === "ios") {
            try {
              const result = await LocalAuthentication.authenticateAsync({
                promptMessage: "Enable Face ID for faster login",
                fallbackLabel: "Use passcode",
                disableDeviceFallback: false,
              });

              if (!result.success) {
                Alert.alert(
                  "Face ID Required",
                  "Face ID is required for biometric login. Please enable it in your device settings.",
                  [
                    {
                      text: "Open Settings",
                      onPress: () => {
                        Linking.openSettings();
                      },
                    },
                    {
                      text: "Cancel",
                      style: "cancel",
                    },
                  ]
                );
              }
            } catch (error) {
              console.error("Error requesting Face ID:", error);
            }
          } else {
            try {
              const result = await LocalAuthentication.authenticateAsync({
                promptMessage: "Enable fingerprint for faster login",
                fallbackLabel: "Use passcode",
                disableDeviceFallback: false,
              });

              if (!result.success) {
                Alert.alert(
                  "Fingerprint Required",
                  "Fingerprint authentication is required for biometric login. Please enable it in your device settings.",
                  [
                    {
                      text: "Open Settings",
                      onPress: () => {
                        Linking.openSettings();
                      },
                    },
                    {
                      text: "Cancel",
                      style: "cancel",
                    },
                  ]
                );
              }
            } catch (error) {
              console.error("Error requesting fingerprint:", error);
            }
          }
          return;
        }

        // For iOS, check Face ID permissions
        if (Platform.OS === "ios") {
          try {
            const result = await LocalAuthentication.authenticateAsync({
              promptMessage: "Authenticate to continue",
              fallbackLabel: "Use passcode",
              disableDeviceFallback: false,
            });

            if (!result.success) {
              console.log("Face ID permission denied or authentication failed");
              return;
            }
          } catch (error) {
            console.error("Error checking Face ID permissions:", error);
            return;
          }
        }

        const hasBiometricEnabled = await checkBiometricSetup(user.nif);
        if (!hasBiometricEnabled) {
          Alert.alert(
            "Enable Biometric Login",
            "Would you like to enable biometric login for faster access?",
            [
              {
                text: "Not Now",
                style: "cancel",
              },
              {
                text: "Enable",
                onPress: async () => {
                  try {
                    const success = await setupBiometric(user.nif);
                    if (!success) {
                      Alert.alert(
                        "Error",
                        "Failed to setup biometric authentication"
                      );
                    }
                  } catch (error) {
                    console.error("Error setting up biometric:", error);
                    Alert.alert(
                      "Error",
                      "Failed to setup biometric authentication"
                    );
                  }
                },
              },
            ]
          );
        }
      } catch (error) {
        console.error("Error checking biometric status:", error);
      }
    };

    checkBiometric();
  }, [user?.nif]);

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack screenOptions={{ navigationBarColor: "#ffffff" }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    "Geist-Thin": require("../assets/fonts/Geist-Thin.ttf"),
    "Geist-ExtraLight": require("../assets/fonts/Geist-ExtraLight.ttf"),
    "Geist-Light": require("../assets/fonts/Geist-Light.ttf"),
    "Geist-Regular": require("../assets/fonts/Geist-Regular.ttf"),
    "Geist-Medium": require("../assets/fonts/Geist-Medium.ttf"),
    "Geist-SemiBold": require("../assets/fonts/Geist-SemiBold.ttf"),
    "Geist-Bold": require("../assets/fonts/Geist-Bold.ttf"),
    "Geist-ExtraBold": require("../assets/fonts/Geist-ExtraBold.ttf"),
    "Geist-Black": require("../assets/fonts/Geist-Black.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Request permissions for image picker
  useEffect(() => {
    (async () => {
      if (Constants?.platform?.ios) {
        const cameraRollStatus =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
        if (
          cameraRollStatus.status !== "granted" ||
          cameraStatus.status !== "granted"
        ) {
          alert("Sorry, we need these permissions to make this work!");
        }
      }
    })();
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </ApolloProvider>
  );
}
