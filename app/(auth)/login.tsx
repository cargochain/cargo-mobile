import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Text,
} from "react-native";
import { Link, router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import * as LocalAuthentication from "expo-local-authentication";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/services/authContext";
import { Button, Input, LanguageSimple, LanguageSelector } from "@/shared";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function LoginScreen() {
  const [nif, setNif] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);

  const { biometricLogin } = useAuth();
  const { t, i18n } = useTranslation();
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  // Check if biometric authentication is available
  useEffect(() => {
    const checkBiometrics = async () => {
      try {
        const compatible = await LocalAuthentication.hasHardwareAsync();
        const enrolled = await LocalAuthentication.isEnrolledAsync();

        const supportedTypes =
          await LocalAuthentication.supportedAuthenticationTypesAsync();

        // Check if device has any supported biometric type
        const hasSupportedBiometric =
          supportedTypes.includes(
            LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
          ) ||
          supportedTypes.includes(
            LocalAuthentication.AuthenticationType.FINGERPRINT
          );

        console.log("compatible", compatible);
        console.log("enrolled", enrolled);
        console.log("supportedTypes", supportedTypes);
        console.log("hasSupportedBiometric", hasSupportedBiometric);

        setIsBiometricAvailable(
          compatible && enrolled && hasSupportedBiometric
        );
      } catch (error) {
        console.error("Error checking biometric availability:", error);
        setIsBiometricAvailable(false);
      }
    };
    checkBiometrics();
  }, []);

  // Set Portuguese as the default language on first load
  useEffect(() => {
    if (i18n.language !== "pt") {
      i18n.changeLanguage("pt");
    }
  }, []);

  const handleContinue = () => {
    // Validate NIF (9 digits)
    if (!nif || nif.length !== 9 || !/^\d{9}$/.test(nif)) {
      setError(t("auth.errors.invalidNif"));
      return;
    }

    // Navigate to login PIN screen
    router.push({
      pathname: "/(auth)/login-pin",
      params: { nif },
    });
  };

  const handleBiometricLogin = async () => {
    try {
      setIsLoading(true);
      setError("");
      await biometricLogin();
    } catch (err) {
      console.error("Biometric login error:", err);
      setError(t("auth.errors.biometricFailed"));
    } finally {
      setIsLoading(false);
    }
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

  console.log("isBiometricAvailable", isBiometricAvailable);

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.secondary }]}
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
              placeholder={t("auth.nif")}
              value={nif}
              onChangeText={setNif}
              keyboardType="numeric"
              maxLength={9}
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

          {isBiometricAvailable && (
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
          )}

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
