import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/shared";
import { PinInput } from "@/shared/PinInput";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Fonts } from "@/constants/Fonts";

export default function PinScreen() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { name, email } = useLocalSearchParams<{
    name: string;
    email: string;
  }>();
  const { t } = useTranslation();
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  const handlePinChange = useCallback((value: string) => {
    setPin(value);
    setError("");
  }, []);

  const validatePin = useCallback(() => {
    if (pin.length !== 4) {
      setError(t("auth.errors.invalidPin"));
      return false;
    }
    return true;
  }, [pin, t]);

  const handleContinue = useCallback(async () => {
    if (!validatePin()) return;

    try {
      router.push({
        pathname: "/(auth)/register-pin-confirmation",
        params: {
          name,
          email,
          previousPin: pin,
        },
      });
      // Registration successful, user will be automatically redirected by the auth context
    } catch (err) {
      console.error("Register error:", err);
      setError(t("auth.errors.registrationFailed"));
      setPin("");
    } finally {
      setIsLoading(false);
    }
  }, [pin, name, email, t, validatePin]);

  const dismissKeyboard = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView
        style={[styles.container]}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <View style={styles.headerContainer}>
          <TouchableWithoutFeedback onPress={() => router.back()}>
            <View style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={colors.primary} />
            </View>
          </TouchableWithoutFeedback>
        </View>

        <ThemedView style={styles.content}>
          <ThemedText
            type="title"
            style={[styles.title, { color: colors.text }]}
          >
            {t("auth.createPin")}
          </ThemedText>

          <ThemedText style={[styles.subtitle, { color: colors.text }]}>
            {t("auth.createPinDescription")}
          </ThemedText>

          {error ? (
            <ThemedText style={[styles.errorText, { color: colors.error }]}>
              {error}
            </ThemedText>
          ) : null}

          <View style={styles.pinContainer}>
            <PinInput
              value={pin}
              onChangeText={handlePinChange}
              error={!!error}
            />
          </View>

          <Button
            title={t("common.continue")}
            onPress={handleContinue}
            variant="primary"
            size="large"
            style={[styles.button, { backgroundColor: colors.primary }]}
            loading={isLoading}
            disabled={isLoading}
          />
        </ThemedView>
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
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 12,
    textAlign: "center",
    fontFamily: Fonts.geist.bold,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: "center",
    fontFamily: Fonts.geist.regular,
    opacity: 0.8,
  },
  pinContainer: {
    marginBottom: 32,
  },
  errorText: {
    marginBottom: 16,
    textAlign: "center",
    fontFamily: Fonts.geist.medium,
  },
  button: {
    marginTop: 16,
  },
});
