import React, { useState, useCallback, useEffect } from "react";
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardEvent,
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
import { useAuth } from "@/services/authContext";

export default function PinConfirmationScreen() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const { name, previousPin, email } = useLocalSearchParams<{
    name: string;
    email: string;
    previousPin: string;
  }>();
  console.log("pin-confirmation", name, email, previousPin);
  const { t } = useTranslation();
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const { register } = useAuth();

  const handlePinChange = useCallback((value: string) => {
    setPin(value);
    setError("");
  }, []);

  const validatePin = useCallback(() => {
    console.log("Validating pin:", { pin, previousPin, pinLength: pin.length });

    if (pin.length !== 4) {
      console.log("Pin length validation failed");
      setError(t("auth.errors.invalidPin"));
      return false;
    }

    if (pin !== previousPin) {
      console.log("Pin match validation failed");
      setError(t("auth.errors.pinsDontMatch"));
      return false;
    }

    console.log("Pin validation successful");
    return true;
  }, [pin, previousPin, t]);

  const handleSignUp = useCallback(async () => {
    console.log("Starting sign up process...", {
      email,
      name,
      pinLength: pin.length,
    });
    if (!validatePin()) {
      console.log("Pin validation failed, aborting sign up");
      return;
    }

    console.log("Registering user...", { email, pin, name });
    try {
      setIsLoading(true);
      setError("");
      await register(email, pin, name);
      console.log("Registration successful, redirecting...");
      router.replace("/(auth)/sucessfull-registration");
    } catch (err) {
      console.error("Sign up error:", err);
      setError(t("auth.errors.registrationFailed"));
    } finally {
      setIsLoading(false);
    }
  }, [pin, previousPin, name, email, t, validatePin, register]);

  const dismissKeyboard = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  useEffect(() => {
    const keyboardWillShow = (event: KeyboardEvent) => {
      setKeyboardHeight(event.endCoordinates.height);
    };

    const keyboardWillHide = () => {
      setKeyboardHeight(0);
    };

    const showSubscription = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      keyboardWillShow
    );
    const hideSubscription = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      keyboardWillHide
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView
        style={[styles.container]}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        enabled
      >
        <View style={styles.headerContainer}>
          <TouchableWithoutFeedback onPress={() => router.back()}>
            <View style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={colors.primary} />
            </View>
          </TouchableWithoutFeedback>
        </View>

        <ThemedView
          style={[
            styles.content,
            Platform.OS === "ios" && { paddingBottom: keyboardHeight },
          ]}
        >
          <ThemedText
            type="title"
            style={[styles.title, { color: colors.text }]}
          >
            {t("auth.confirmPin")}
          </ThemedText>

          <ThemedText style={[styles.subtitle, { color: colors.text }]}>
            {t("auth.confirmPinDescription")}
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
              autoFocus={true}
              keyboardType="number-pad"
              maxLength={4}
              secureTextEntry={true}
              autoComplete="off"
              autoCorrect={false}
              spellCheck={false}
            />
          </View>

          <Button
            title={isLoading ? t("auth.registering") : t("common.continue")}
            onPress={handleSignUp}
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
    backgroundColor: Colors.light.secondary,
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
