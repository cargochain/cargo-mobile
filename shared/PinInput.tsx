import React, {
  useRef,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import {
  View,
  TextInput,
  StyleSheet,
  ViewStyle,
  StyleProp,
  TextInputProps,
  TouchableOpacity,
  Platform,
  Keyboard,
} from "react-native";
import { Colors } from "@/constants/Colors";

interface PinInputProps extends Omit<TextInputProps, "style"> {
  length?: number;
  value: string;
  onChangeText: (value: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<ViewStyle>;
  error?: boolean;
}

export const PinInput: React.FC<PinInputProps> = ({
  length = 4,
  value,
  onChangeText,
  containerStyle,
  inputStyle,
  error,
  ...rest
}) => {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    // Cleanup function to dismiss keyboard when component unmounts
    return () => {
      Keyboard.dismiss();
    };
  }, []);

  const handleChangeText = useCallback(
    (text: string, index: number) => {
      if (text.length > 1) {
        text = text[text.length - 1];
      }

      const newValue = value.split("");
      newValue[index] = text;
      const newValueStr = newValue.join("");

      onChangeText(newValueStr);

      // Auto-focus next input
      if (text && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [value, length, onChangeText]
  );

  const handleKeyPress = useCallback(
    (e: any, index: number) => {
      if (e.nativeEvent.key === "Backspace" && !value[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [value]
  );

  const handleFocus = useCallback((index: number) => {
    setFocusedIndex(index);
  }, []);

  const handleBlur = useCallback(() => {
    setFocusedIndex(null);
  }, []);

  const renderInputs = useMemo(() => {
    return Array.from({ length }).map((_, index) => {
      const isFocused = focusedIndex === index;
      const hasValue = !!value[index];

      return (
        <TouchableOpacity
          key={index}
          activeOpacity={1}
          style={[styles.dotContainer, inputStyle]}
          onPress={() => {
            if (Platform.OS === "ios") {
              // On iOS, we need to ensure the keyboard is properly shown
              setTimeout(() => {
                inputRefs.current[index]?.focus();
              }, 50);
            } else {
              inputRefs.current[index]?.focus();
            }
          }}
        >
          <TextInput
            ref={(ref) => (inputRefs.current[index] = ref)}
            style={styles.hiddenInput}
            maxLength={1}
            keyboardType="number-pad"
            value={value[index] || ""}
            onChangeText={(text) => handleChangeText(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            onFocus={() => handleFocus(index)}
            onBlur={handleBlur}
            secureTextEntry={true}
            autoComplete="off"
            autoCorrect={false}
            spellCheck={false}
            textContentType="oneTimeCode"
            {...rest}
          />
          <View
            pointerEvents="none"
            style={[
              styles.dot,
              hasValue && styles.filledDot,
              isFocused && styles.focusedDotOutline,
              error && styles.errorDotOutline,
            ]}
          />
        </TouchableOpacity>
      );
    });
  }, [
    length,
    value,
    focusedIndex,
    error,
    inputStyle,
    handleChangeText,
    handleKeyPress,
    handleFocus,
    handleBlur,
    rest,
  ]);

  return <View style={[styles.container, containerStyle]}>{renderInputs}</View>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 24,
  },
  dotContainer: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  hiddenInput: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0.01,
    zIndex: 1,
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.light.primary,
    backgroundColor: "transparent",
    zIndex: 0,
  },
  filledDot: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  focusedDotOutline: {
    borderColor: Colors.light.primary,
    borderWidth: 3,
  },
  errorDotOutline: {
    borderColor: Colors.light.error,
  },
});
