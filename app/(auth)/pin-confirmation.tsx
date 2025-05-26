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
import { useSignUpMutation } from "@/services/generated/graphql";

export default function PinConfirmationScreen() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const { name, nif, previousPin } = useLocalSearchParams<{
    name: string;
    nif: string;
    previousPin: string;
  }>();
  const { t } = useTranslation();
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const [signUp] = useSignUpMutation();

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

  const handleSignUp = useCallback(async () => {
    if (!validatePin()) return;

    if (pin !== previousPin) {
      setError(t("auth.errors.pinsDontMatch"));
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const { data } = await signUp({
        variables: {
          input: {
            name,
            nif,
            password: pin,
            email: `${nif}@cargochain.pt`, // Using NIF as email since it's required
            phoneNumber: "", // This will be updated later
            isAdmin: false,
            isMobile: true,
            deviceType: Platform.OS,
            deviceName: Platform.OS,
            deviceId: Platform.OS,
          },
        },
      });

      if (data?.signUp.success) {
        // Navigate to login screen after successful registration
        router.replace("/(auth)/login");
      } else {
        setError(t("auth.errors.registrationFailed"));
      }
    } catch (err) {
      console.error("Sign up error:", err);
      setError(t("auth.errors.registrationFailed"));
    } finally {
      setIsLoading(false);
    }
  }, [pin, previousPin, name, nif, t, validatePin, signUp]);

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
        style={[styles.container, { backgroundColor: colors.background }]}
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
