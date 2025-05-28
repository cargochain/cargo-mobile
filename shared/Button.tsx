import { Colors } from "@/constants/Colors";
import React, { ReactNode, forwardRef } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleProp,
  View,
} from "react-native";

export type ButtonVariant = "primary" | "secondary" | "outline" | "text";
export type ButtonSize = "small" | "medium" | "large";

export interface ButtonProps {
  /**
   * The text to display inside the button
   */
  title?: string;
  /**
   * Function to call when the button is pressed
   */
  onPress: () => void;
  /**
   * Whether the button is in a loading state
   */
  loading?: boolean;
  /**
   * Whether the button is disabled
   */
  disabled?: boolean;
  /**
   * The visual style of the button
   */
  variant?: ButtonVariant;
  /**
   * The size of the button
   */
  size?: ButtonSize;
  /**
   * Additional styles to apply to the button container
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Additional styles to apply to the button text
   */
  textStyle?: StyleProp<TextStyle>;
  /**
   * Whether to show a loading indicator when loading
   */
  showLoadingIndicator?: boolean;
  /**
   * Children elements to render inside the button (for icons)
   */
  children?: ReactNode;
}

const ButtonComponent = forwardRef<View, ButtonProps>((props, ref) => {
  const {
    title,
    onPress,
    loading = false,
    disabled = false,
    variant = "primary",
    size = "medium",
    style,
    textStyle,
    showLoadingIndicator = true,
    children,
  } = props;

  const getButtonStyle = () => {
    const baseStyle = styles.button;
    const variantStyle = styles[`${variant}Button`];
    const sizeStyle = styles[`${size}Button`];
    const disabledStyle = disabled ? styles.disabledButton : {};

    return [baseStyle, variantStyle, sizeStyle, disabledStyle, style];
  };

  const getTextStyle = () => {
    const baseStyle = styles.text;
    const variantStyle = styles[`${variant}Text`];
    const sizeStyle = styles[`${size}Text`];
    const disabledStyle = disabled ? styles.disabledText : {};

    return [baseStyle, variantStyle, sizeStyle, disabledStyle, textStyle];
  };

  return (
    <TouchableOpacity
      ref={ref}
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading && showLoadingIndicator ? (
        <ActivityIndicator
          size="small"
          color={
            variant === "outline" || variant === "text" ? "#007AFF" : "white"
          }
        />
      ) : (
        <View style={styles.contentContainer}>
          {children}
          {title && <Text style={getTextStyle()}>{title}</Text>}
        </View>
      )}
    </TouchableOpacity>
  );
});

ButtonComponent.displayName = "Button";

export const Button = ButtonComponent;

const styles = StyleSheet.create({
  button: {
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  // Variants
  primaryButton: {
    backgroundColor: Colors.light.primary,
  },
  secondaryButton: {
    backgroundColor: "#f9dcf8",
    borderWidth: 1,
    borderColor: Colors.light.primary,
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.light.primary,
  },
  textButton: {
    backgroundColor: "transparent",
  },
  // Sizes
  smallButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  mediumButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  largeButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  // Text styles
  text: {
    fontFamily: "Suisse",
  },
  primaryText: {
    color: "white",
  },
  secondaryText: {
    color: Colors.light.primary,
  },
  outlineText: {
    color: Colors.light.primary,
  },
  textText: {
    color: Colors.light.primary,
  },
  // Text sizes
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  // Disabled styles
  disabledButton: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.5,
  },
});
