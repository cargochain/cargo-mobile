import { SafeAreaView, StyleSheet, View, Text, Platform } from "react-native";

import { useTranslation } from "react-i18next";
import { Colors } from "@/constants/Colors";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";

export default function HomeScreen() {
  const { t } = useTranslation();

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.wrapper}>
        {/* Screen Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <IconSymbol
              name="house.fill"
              size={20}
              color={`${Colors.light.primary}80`}
            />
          </View>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>{t("home.title")}</Text>
            <Text style={styles.headerSubtitle}>{t("home.description")}</Text>
          </View>
        </View>
        <View style={styles.content}>
          <ThemedText type="subtitle">{t("home.notifications")}</ThemedText>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderColor: `${Colors.light.primary}16`,
    gap: 16,
    backgroundColor: Colors.light.white,
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
  cardHeaderStatus: {
    fontSize: 14,
    color: Colors.light.text,
    fontFamily: "SuisseMedium",
  },
  content: {
    flex: 1,
    backgroundColor: Colors.light.secondary,
    padding: 20,
  },
  error: {
    color: Colors.light.error,
    textAlign: "center",
  },
});
