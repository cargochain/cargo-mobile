import React, { useReducer, useCallback, useMemo, memo } from "react";
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
import debounce from "lodash/debounce";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/services/authContext";
import { Button, Input, LanguageSimple } from "@/shared";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Fonts } from "@/constants/Fonts";
import { formatNIF, unformatNumber } from "@/shared/utils/format";

type FormState = {
  name: string;
  nif: string;
  pin: string;
  confirmPin: string;
  phoneNumber: string;
  errors: {
    name?: string;
    nif?: string;
    pin?: string;
    confirmPin?: string;
    phoneNumber?: string;
  };
};

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
    case "RESET":
      return {
        name: "",
        nif: "",
        pin: "",
        confirmPin: "",
        phoneNumber: "",
        errors: {},
      };
    default:
      return state;
  }
};

const initialFormState: FormState = {
  name: "",
  nif: "",
  pin: "",
  confirmPin: "",
  phoneNumber: "",
  errors: {},
};

const RegisterScreen = () => {
  const [formData, dispatch] = useReducer(formReducer, initialFormState);
  const [isLoading, setIsLoading] = React.useState(false);
  const [languageModalVisible, setLanguageModalVisible] = React.useState(false);

  const { register } = useAuth();
  const { t, i18n } = useTranslation();
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  const validateField = useCallback(
    (field: keyof Omit<FormState, "errors">, value: string) => {
      switch (field) {
        case "nif":
          // Get unformatted value for validation
          const unformattedNif = unformatNumber(value);
          if (
            unformattedNif.length > 0 &&
            (unformattedNif.length !== 9 || !/^\d+$/.test(unformattedNif))
          ) {
            return t("auth.errors.invalidNif");
          }
          break;
        case "name":
          if (!value) {
            return t("auth.errors.fillAllFields");
          }
          break;
        case "phoneNumber":
          if (!value) {
            return t("auth.errors.fillAllFields");
          }
          break;
      }
      return undefined;
    },
    [formData.pin, formData.confirmPin, t]
  );

  const handleInputChange = useCallback(
    (field: keyof Omit<FormState, "errors">, value: string) => {
      // Format input based on field type
      let formattedValue = value;
      if (field === "nif") {
        formattedValue = formatNIF(value);
      }

      dispatch({ type: "SET_FIELD", field, value: formattedValue });

      // Only validate if the field has a value
      if (value) {
        const error = validateField(field, value);
        if (error) {
          dispatch({ type: "SET_ERROR", field, error });
        } else {
          // Clear error if validation passes
          dispatch({ type: "SET_ERROR", field, error: undefined });
        }
      } else {
        // Clear error if field is empty
        dispatch({ type: "SET_ERROR", field, error: undefined });
      }
    },
    [validateField]
  );

  const validateForm = useCallback(() => {
    const fields: Array<keyof Omit<FormState, "errors">> = ["name", "nif"];
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

  const handleContinue = useCallback(() => {
    if (!validateForm()) {
      return;
    }

    // Navigate to PIN screen with unformatted NIF
    router.push({
      pathname: "/(auth)/pin",
      params: {
        name: formData.name,
        nif: unformatNumber(formData.nif),
      },
    });
  }, [formData, validateForm]);

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
    setLanguageModalVisible(true);
  }, []);

  const closeLanguageSelector = useCallback(() => {
    setLanguageModalVisible(false);
  }, []);

  const changeLanguage = useCallback(
    (languageCode: string) => {
      i18n.changeLanguage(languageCode);
    },
    [i18n]
  );

  const renderInput = useCallback(
    (field: keyof Omit<FormState, "errors">, props: any) => (
      <Input
        value={formData[field]}
        onChangeText={(value) => handleInputChange(field, value)}
        disabled={isLoading}
        required
        error={formData.errors[field]}
        label={t(`auth.labels.${field}`)}
        // Optimize numeric input props
        keyboardType={
          field === "nif" || field === "phoneNumber" ? "numeric" : "default"
        }
        maxLength={
          field === "nif" ? 9 : field === "phoneNumber" ? 9 : undefined
        }
        {...props}
      />
    ),
    [formData, handleInputChange, isLoading, t]
  );

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

            {renderInput("nif", {
              placeholder: t("auth.nif"),
              keyboardType: "numeric",
              maxLength: 11, // 9 digits + 2 spaces
              clearable: true,
            })}

            {renderInput("phoneNumber", {
              placeholder: t("auth.phoneNumber"),
              keyboardType: "numeric",
              clearable: true,
            })}
          </View>

          <Button
            title={t("common.continue")}
            onPress={handleContinue}
            variant="primary"
            size="large"
            style={[styles.button, { backgroundColor: colors.primary }]}
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
