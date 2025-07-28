import React, { useReducer, useCallback, useMemo, memo } from "react";
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import { Link, router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import debounce from "lodash/debounce";
import { useState } from "react";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button, Input, LanguageSimple } from "@/shared";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Fonts } from "@/constants/Fonts";
import { useAuth } from "@/services/authContext";

interface FormState {
  name: string;
  email: string;
  confirmEmail: string;
  password: string;
  confirmPassword: string;
  errors: {
    name?: string;
    email?: string;
    confirmEmail?: string;
    password?: string;
    confirmPassword?: string;
  };
}

type FormAction =
  | {
      type: "SET_FIELD";
      field: keyof Omit<FormState, "errors">;
      value: string;
    }
  | {
      type: "SET_ERROR";
      field: keyof Omit<FormState, "errors">;
      error?: string;
    }
  | {
      type: "CLEAR_ERROR";
      field: keyof Omit<FormState, "errors">;
    }
  | {
      type: "RESET";
    };

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        [action.field]: action.value,
        errors: {
          ...state.errors,
          [action.field]: undefined, // Clear error when field is updated
        },
      };
    case "SET_ERROR":
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.field]: action.error,
        },
      };
    case "CLEAR_ERROR":
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.field]: undefined,
        },
      };
    case "RESET":
      return {
        name: "",
        email: "",
        confirmEmail: "",
        password: "",
        confirmPassword: "",
        errors: {},
      };
    default:
      return state;
  }
};

const RegisterScreen = () => {
  const [formData, dispatch] = useReducer(formReducer, {
    name: "",
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
    errors: {},
  });
  const [isLoading, setIsLoading] = useState(false);

  const { t } = useTranslation();
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const { register } = useAuth();

  const validateField = useCallback(
    (field: keyof Omit<FormState, "errors">, value: string): string | null => {
      switch (field) {
        case "name":
          return value.trim().length < 2 ? t("auth.errors.nameTooShort") : null;
        case "email":
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return !emailRegex.test(value) ? t("auth.errors.invalidEmail") : null;
        case "confirmEmail":
          return value !== formData.email
            ? t("auth.errors.emailsDontMatch")
            : null;
        case "password":
          return value.length < 6 ? t("auth.errors.passwordTooShort") : null;
        case "confirmPassword":
          return value !== formData.password
            ? t("auth.errors.passwordsDontMatch")
            : null;
        default:
          return null;
      }
    },
    [formData.email, formData.password, t]
  );

  const handleInputChange = useCallback(
    (field: keyof Omit<FormState, "errors">, value: string) => {
      dispatch({ type: "SET_FIELD", field, value });

      // Clear error when user starts typing
      if (formData.errors[field]) {
        dispatch({ type: "CLEAR_ERROR", field });
      }
    },
    [formData.errors]
  );

  const validateForm = useCallback(() => {
    const fields: (keyof Omit<FormState, "errors">)[] = [
      "name",
      "email",
      "confirmEmail",
      "password",
      "confirmPassword",
    ];
    let isValid = true;

    fields.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        dispatch({ type: "SET_ERROR", field, error });
        isValid = false;
      }
    });

    return isValid;
  }, [formData, validateField]);

  const handleContinue = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      await register(formData.email, formData.password, formData.name);
      router.replace("/(auth)/sucessfull-registration");
    } catch (error) {
      console.error("Registration error:", error);
      // Handle registration error
    } finally {
      setIsLoading(false);
    }
  }, [formData, validateForm, register]);

  const debouncedValidate = useMemo(
    () =>
      debounce(() => {
        validateForm();
      }, 300),
    [validateForm]
  );

  // Cleanup debounced function
  React.useEffect(() => {
    return () => {
      debouncedValidate.cancel();
    };
  }, [debouncedValidate]);

  const dismissKeyboard = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  const openLanguageSelector = useCallback(() => {
    // setLanguageModalVisible(true); // This line was removed as per the edit hint
  }, []);

  const renderInput = useCallback(
    (field: keyof Omit<FormState, "errors">, props: any) => (
      <Input
        value={formData[field]}
        onChangeText={(value) => handleInputChange(field, value)}
        disabled={isLoading}
        required
        error={formData.errors[field]}
        label={t(`auth.labels.${field}`)}
        // Optimize input props
        keyboardType={
          field === "email" || field === "confirmEmail"
            ? "email-address"
            : "default"
        }
        maxLength={
          field === "email" || field === "confirmEmail" ? 50 : undefined
        }
        secureTextEntry={field === "password" || field === "confirmPassword"}
        {...props}
      />
    ),
    [formData, handleInputChange, isLoading, t]
  );

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: Colors.light.secondary }]}
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

        <ThemedView style={styles.content}>
          <ThemedText
            type="title"
            style={[styles.title, { color: colors.text }]}
          >
            {t("auth.register")}
          </ThemedText>

          <View style={styles.inputContainer}>
            {renderInput("name", {
              placeholder: t("auth.name"),
              autoCapitalize: "words",
              clearable: true,
            })}

            {renderInput("email", {
              placeholder: t("auth.email"),
              keyboardType: "email-address",
              autoCapitalize: "none",
              clearable: true,
            })}

            {renderInput("confirmEmail", {
              placeholder: t("auth.confirmEmail"),
              keyboardType: "email-address",
              autoCapitalize: "none",
              clearable: true,
            })}

            {renderInput("password", {
              placeholder: t("auth.password"),
              secureTextEntry: true,
            })}

            {renderInput("confirmPassword", {
              placeholder: t("auth.confirmPassword"),
              secureTextEntry: true,
            })}
          </View>

          <Button
            title={isLoading ? t("auth.registering") : t("common.continue")}
            onPress={handleContinue}
            variant="primary"
            size="large"
            style={[styles.button, { backgroundColor: colors.primary }]}
            loading={isLoading}
            disabled={isLoading}
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
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default memo(RegisterScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.secondary,
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
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    fontFamily: Fonts.geist.bold,
  },
  inputContainer: {
    marginBottom: 20,
    gap: 16,
  },
  errorText: {
    marginBottom: 15,
    textAlign: "center",
    fontFamily: Fonts.geist.medium,
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
  button: {
    marginTop: 20,
  },
});
