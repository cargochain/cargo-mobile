/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#E53E3E"; // A vibrant red
const tintColorDark = "#FC8181"; // A lighter red for dark mode

export const Colors = {
  light: {
    text: "#4A5568",
    background: "#fff",
    tint: tintColorLight,
    icon: "#E53E3E",
    tabIconDefault: "#CBD5E0",
    tabIconSelected: tintColorLight,
    primary: "#1f1f1f", // Apple Blue
    secondary: "#faf4ee",
    tertiary: "#f9dcf8",
    accent: "#FEB2B2",
    error: "#C53030",
    white: "#fff",
    info: "#007AFF",
    warning: "#FFA500",
    success: "#008000",
  },
  dark: {
    text: "#F7FAFC",
    background: "#1A202C",
    tint: tintColorDark,
    icon: "#FC8181",
    tabIconDefault: "#718096",
    tabIconSelected: tintColorDark,
    primary: "#1f1f1f", // Apple Blue
    secondary: "#FFE9CE",
    tertiary: "#f9dcf8",
    accent: "#FED7D7",
    error: "#F56565",
    white: "#fff",
    info: "#007AFF",
    warning: "#FFA500",
    success: "#008000",
  },
};
