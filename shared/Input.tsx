import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
  StyleProp,
  TouchableOpacity,
} from "react-native";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";

export interface InputProps extends Omit<TextInputProps, "style"> {
  /**
   * Label text to display above the input
   */
  label?: string;
  /**
   * Error message to display below the input
   */
  error?: string;
  /**
   * Helper text to display below the input
   */
  helper?: string;
  /**
   * Whether the input is in a loading state
   */
  loading?: boolean;
  /**
   * Whether the input is disabled
   */
  disabled?: boolean;
  /**
   * Whether to show a clear button when the input has text
   */
  clearable?: boolean;
  /**
   * Whether the input is required
   */
  required?: boolean;
  /**
   * Additional styles to apply to the container
   */
  containerStyle?: StyleProp<ViewStyle>;
  /**
   * Additional styles to apply to the input
   */
  inputStyle?: StyleProp<TextStyle>;
  /**
   * Additional styles to apply to the label
   */
  labelStyle?: StyleProp<TextStyle>;
  /**
   * Additional styles to apply to the error message
   */
  errorStyle?: StyleProp<TextStyle>;
  /**
   * Additional styles to apply to the helper text
   */
  helperStyle?: StyleProp<TextStyle>;
  /**
   * Function to call when the clear button is pressed
   */
  onClear?: () => void;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helper,
  loading = false,
  disabled = false,
  clearable = false,
  required = false,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  helperStyle,
  onClear,
  value,
  onChangeText,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const showClearButton =
    clearable && value && value.length > 0 && !disabled && !loading;

  const handleClear = () => {
    if (onChangeText) {
      onChangeText("");
    }
    if (onClear) {
      onClear();
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={[styles.label, labelStyle]}>
            {label}
            {required && <Text style={styles.required}> *</Text>}
          </Text>
        </View>
      )}

      <View
        style={[
          styles.inputContainer,
          isFocused && styles.focusedInput,
          error && styles.errorInput,
          disabled && styles.disabledInput,
        ]}
      >
        <TextInput
          style={[styles.input, disabled && styles.disabledText, inputStyle]}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          editable={!disabled && !loading}
          placeholderTextColor="#999"
          {...rest}
        />

        {showClearButton && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClear}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <IconSymbol name="xmark.circle.fill" size={18} color="#999" />
          </TouchableOpacity>
        )}

        {loading && (
          <View style={styles.loadingContainer}>
            <IconSymbol name="arrow.clockwise" size={18} color="#999" />
          </View>
        )}
      </View>

      {(error || helper) && (
        <View style={styles.messageContainer}>
          {error && <Text style={[styles.error, errorStyle]}>{error}</Text>}
          {helper && !error && (
            <Text style={[styles.helper, helperStyle]}>{helper}</Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
  },
  labelContainer: {
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  required: {
    color: "#ff3b30",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.light.primary,
    borderRadius: 10,
    backgroundColor: Colors.light.secondary,
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#333",
    fontFamily: "SuisseMedium",
  },
  focusedInput: {
    borderColor: Colors.light.primary,
  },
  errorInput: {
    borderColor: "#ff3b30",
  },
  disabledInput: {
    backgroundColor: "#f5f5f5",
    borderColor: "#ddd",
  },
  disabledText: {
    color: "#999",
  },
  clearButton: {
    padding: 10,
  },
  loadingContainer: {
    padding: 10,
  },
  messageContainer: {
    marginTop: 4,
  },
  error: {
    color: "#ff3b30",
    fontSize: 12,
  },
  helper: {
    color: "#666",
    fontSize: 12,
  },
});
