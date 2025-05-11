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
import { Button, Input, LanguageSimple, LanguageSelector } from "@/shared";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function LoginScreen() {
  const [nif, setNif] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  const { login } = useAuth();
  const { t, i18n } = useTranslation();
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  // Set Portuguese as the default language on first load
  useEffect(() => {
    if (i18n.language !== "pt") {
      i18n.changeLanguage("pt");
    }
  }, []);

  const handleLogin = async () => {
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

    try {
      setIsLoading(true);
      setError("");
      await login(nif, pin);
    } catch (err) {
      console.error("Login error:", err);
      setError(t("auth.errors.invalidCredentials"));
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

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.secondary }]}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
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

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <ThemedView style={styles.content}>
            <ThemedText
              type="title"
              style={[styles.title, { color: colors.text }]}
            >
              {t("auth.login")}
            </ThemedText>

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
              {/* <MaskedTextInput
                mask="999 999 999"
                onChangeText={(text, rawText) => {
                  setNif(rawText); // unmasked
                }}
                value={nif}
                keyboardType="numeric"
                placeholder={t("auth.nif")}
                style={{
                  borderColor: colors.primary,
                  borderWidth: 1,
                  borderRadius: 10,
                  height: 50,
                  paddingHorizontal: 15,
                }}
              /> */}

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
              title={isLoading ? t("auth.loggingIn") : t("auth.button.login")}
              onPress={handleLogin}
              loading={isLoading}
              disabled={isLoading}
              variant="primary"
              size="large"
              style={{ backgroundColor: colors.primary }}
            />

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
        </ScrollView>

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
