export const Fonts = {
  inter: {
    regular: "Inter-Regular",
    medium: "Inter-Medium",
    semiBold: "Inter-SemiBold",
    bold: "Inter-Bold",
  },
  suisse: {
    regular: "SuisseIntl-Regular-WebM",
    medium: "SuisseIntl-Medium-WebM",
    semiBold: "SuisseIntl-Bold-WebM",
    bold: "SuisseIntl-Bold-WebM",
  },
} as const;

export type FontFamily = keyof typeof Fonts;
export type FontWeight<T extends FontFamily = FontFamily> =
  keyof (typeof Fonts)[T];
