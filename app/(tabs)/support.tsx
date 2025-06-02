import { SafeAreaView, StyleSheet, View, Text, Platform } from "react-native";

import { useTranslation } from "react-i18next";
import { Colors } from "@/constants/Colors";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedText } from "@/components/ThemedText";

export default function SupportScreen() {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.wrapper}>
      {/* Screen Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <IconSymbol
            name="shippingbox.fill"
            size={20}
            color={`${Colors.light.primary}80`}
          />
        </View>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{t("common.support")}</Text>
          <Text style={styles.headerSubtitle}>{t("common.help_center")}</Text>
        </View>
      </View>
      <View style={styles.container}>
        <ThemedText type="title">{t("support.anyProblem")}</ThemedText>
        <ThemedText type="default">{t("support.description")}</ThemedText>
        <ThemedText type="subtitle">+351 938 373 944</ThemedText>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.light.white,
    paddingTop: Platform.select({
      android: 40,
      default: 0,
    }),
  },
  container: {
    flex: 1,
    gap: 16,
    padding: 16,
    backgroundColor: Colors.light.secondary,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderColor: `${Colors.light.primary}16`,
    gap: 16,
  },
  headerTitleContainer: {
    flexDirection: "column",
  },
  headerTitle: {
    fontSize: 18,
    color: Colors.light.primary,
    fontFamily: "SuisseBold",
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.light.text,
    fontFamily: "SuisseMedium",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.light.secondary,
    borderWidth: 1,
    borderColor: `${Colors.light.primary}10`,
  },
  whatsappButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#25D366", // WhatsApp brand color
    padding: 16,
    borderRadius: 8,
    gap: 8,
    marginTop: 16,
  },
  whatsappButtonText: {
    color: Colors.light.white,
    fontSize: 16,
    fontFamily: "SuisseMedium",
  },
});
