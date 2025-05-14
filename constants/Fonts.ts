export const Fonts = {
  inter: {
    regular: "Inter-Regular",
    medium: "Inter-Medium",
    semiBold: "Inter-SemiBold",
    bold: "Inter-Bold",
  },
  geist: {
    thin: "Geist-Thin",
    extraLight: "Geist-ExtraLight",
    light: "Geist-Light",
    regular: "Geist-Regular",
    medium: "Geist-Medium",
    semiBold: "Geist-SemiBold",
    bold: "Geist-Bold",
    extraBold: "Geist-ExtraBold",
    black: "Geist-Black",
  },
} as const;

export type FontFamily = keyof typeof Fonts;
export type FontWeight<T extends FontFamily = FontFamily> =
  keyof (typeof Fonts)[T];
