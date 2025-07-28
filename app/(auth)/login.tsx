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
import { useAuth } from "@/services/authContext";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  const { t, i18n } = useTranslation();
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const { login } = useAuth();

  const handleLogin = async () => {
    // Validate inputs
    if (!email) {
      setError(t("auth.errors.invalidEmail"));
      return;
    }

    if (!password) {
      setError(t("auth.errors.invalidPassword"));
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      await login(email.toLowerCase(), password);
    } catch (error) {
      console.log("error", error);
      setError(t("auth.errors.invalidCredentials"));
      setPassword("");
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
            <Input
              placeholder={t("auth.password")}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
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
