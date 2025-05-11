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
} from "react-native";
import { Link, router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/services/authContext";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Button, Input, LanguageSimple } from "@/shared";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Fonts } from "@/constants/Fonts";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [nif, setNif] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  const { register } = useAuth();
  const { t, i18n } = useTranslation();
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

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

  const handleRegister = async () => {
    // Validate required fields
    if (!name || !nif || !pin || !confirmPin) {
      setError(t("auth.errors.fillAllFields"));
      return;
    }

    // Validate NIF (9 digits)
    if (!nif || nif.length !== 9 || !/^\d{9}$/.test(nif)) {
      setError(t("auth.errors.invalidNif"));
      return;
    }

    // Validate PIN (4 digits)
    if (!pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      setError(t("auth.errors.invalidPin"));
      return;
    }

    if (pin !== confirmPin) {
      setError(t("auth.errors.pinsDontMatch"));
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      await register(nif, pin, name);
    } catch (err) {
      console.error("Register error:", err);
      setError(t("auth.errors.registrationFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.background }]}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.replace("/welcome")}
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

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <ThemedView style={styles.content}>
            <View style={styles.logoContainer}>
              <IconSymbol size={80} color={colors.primary} name="truck" />
            </View>

            <ThemedText
              type="title"
              style={[styles.title, { color: colors.text }]}
            >
              {t("auth.register")}
            </ThemedText>

            {error ? (
              <ThemedText style={[styles.errorText, { color: colors.error }]}>
                {error}
              </ThemedText>
            ) : null}

            <View style={styles.inputContainer}>
              <Input
                placeholder={t("auth.name")}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                disabled={isLoading}
                clearable
                required
                containerStyle={{ borderColor: colors.primary }}
              />

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

              <Input
                placeholder={t("auth.pin")}
                value={pin}
                onChangeText={setPin}
                secureTextEntry
                keyboardType="numeric"
                maxLength={4}
                disabled={isLoading}
                required
                containerStyle={{ borderColor: colors.primary }}
              />
            </View>

            <Button
              title={isLoading ? t("auth.registering") : t("auth.register")}
              onPress={handleRegister}
              loading={isLoading}
              disabled={isLoading}
              variant="primary"
              size="large"
              style={{ backgroundColor: colors.primary }}
            />

            <View style={styles.footer}>
              <ThemedText style={{ color: colors.text }}>
                {t("auth.haveAccount")}{" "}
              </ThemedText>
              <Link href="/(auth)/login" replace asChild>
                <Button
                  title={t("auth.login")}
                  onPress={() => {}}
                  variant="text"
                  size="medium"
                  textStyle={{ color: colors.primary }}
                />
              </Link>
            </View>
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    fontFamily: Fonts.suisse.bold,
  },
  inputContainer: {
    marginBottom: 20,
    gap: 10,
  },
  errorText: {
    marginBottom: 15,
    textAlign: "center",
    fontFamily: Fonts.suisse.medium,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
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
});
