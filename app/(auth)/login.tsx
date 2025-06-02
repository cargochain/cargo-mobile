import React, { useState } from "react";
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Text,
} from "react-native";
import { Link, router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button, Input, LanguageSimple, LanguageSelector } from "@/shared";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  // const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);

  const { t, i18n } = useTranslation();
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  // Check if biometric authentication is available
  // useEffect(() => {
  //   const checkBiometrics = async () => {
  //     try {
  //       const compatible = await LocalAuthentication.hasHardwareAsync();
  //       const enrolled = await LocalAuthentication.isEnrolledAsync();

  //       const supportedTypes =
  //         await LocalAuthentication.supportedAuthenticationTypesAsync();

  //       // Check if device has any supported biometric type
  //       const hasSupportedBiometric =
  //         supportedTypes.includes(
  //           LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
  //         ) ||
  //         supportedTypes.includes(
  //           LocalAuthentication.AuthenticationType.FINGERPRINT
  //         );

  //       setIsBiometricAvailable(
  //         compatible && enrolled && hasSupportedBiometric
  //       );
  //     } catch (error) {
  //       console.error("Error checking biometric availability:", error);
  //       setIsBiometricAvailable(false);
  //     }
  //   };
  //   checkBiometrics();
  // }, []);

  const handleContinue = () => {
    // Validate email
    if (!email) {
      setError(t("auth.errors.invalidEmail"));
      return;
    }

    // Navigate to login PIN screen
    router.push({
      pathname: "/(auth)/login-pin",
      params: { email },
    });
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const openLanguageSelector = () => {
    setLanguageModalVisible(true);
  };

  const closeLanguageSelector = () => {
    setLanguageModalVisible(false);
  };

  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView
        style={[styles.container]}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.replace("/(auth)/welcome")}
          >
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.languageButton}
            onPress={openLanguageSelector}
          >
            <LanguageSimple size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <ThemedView style={styles.content}>
          <Text style={styles.title}>{t("auth.login")}</Text>

          {error ? (
            <ThemedText style={[styles.errorText, { color: colors.error }]}>
              {error}
            </ThemedText>
          ) : null}

          <View style={styles.inputContainer}>
            <Input
              placeholder={t("auth.email")}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              maxLength={50}
              disabled={isLoading}
              clearable
              required
              containerStyle={{ borderColor: colors.primary }}
            />
          </View>

          <Button
            title={t("common.continue")}
            onPress={handleContinue}
            loading={isLoading}
            disabled={isLoading}
            variant="primary"
            size="large"
            style={{ backgroundColor: colors.primary }}
          />

          {/* {isBiometricAvailable && (
            <Button
              title={
                Platform.OS === "ios"
                  ? t("auth.loginWithAppleID")
                  : t("auth.loginWithBiometrics")
              }
              onPress={handleBiometricLogin}
              loading={isLoading}
              disabled={isLoading}
              variant="outline"
              size="large"
              style={{ marginTop: 10, borderColor: colors.primary }}
              textStyle={{ color: colors.primary }}
            >
              <Ionicons
                name={Platform.OS === "ios" ? "logo-apple" : "finger-print"}
                size={24}
                color={colors.primary}
                style={{ marginRight: 8 }}
              />
            </Button>
          )} */}

          <View style={styles.footer}>
            <Link href="/(auth)/register" replace asChild>
              <Button
                title={t("auth.createAccount")}
                onPress={() => {}}
                variant="text"
                size="medium"
                textStyle={{ color: colors.primary }}
              />
            </Link>
          </View>
        </ThemedView>

        <LanguageSelector
          visible={languageModalVisible}
          onClose={closeLanguageSelector}
          onSelectLanguage={changeLanguage}
          currentLanguage={i18n.language}
        />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.secondary,
  },
  headerContainer: {
    position: "absolute",
    top: 40,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
  },
  backButton: {
    padding: 8,
  },
  languageButton: {
    padding: 8,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: Colors.light.secondary,
  },
  title: {
    fontSize: 32,
    marginBottom: 20,
    textAlign: "left",
    fontFamily: "SuisseBold",
    color: Colors.light.primary,
  },
  inputContainer: {
    marginBottom: 20,
    gap: 10,
  },
  errorText: {
    marginBottom: 15,
    textAlign: "center",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
});
