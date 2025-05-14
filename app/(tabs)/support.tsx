import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Linking,
  Platform,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

import { useTranslation } from "react-i18next";
import { Colors } from "@/constants/Colors";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedText } from "@/components/ThemedText";
import { useAuth } from "@/services/authContext";

export default function SupportScreen() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const handleWhatsAppPress = async () => {
    if (!user?.phoneNumber) {
      console.log("No phone number available");
      return;
    }

    const phoneNumber = user.phoneNumber;
    const message = encodeURIComponent(
      t("support.defaultMessage") || "Hello, I need help with CargoChain"
    );
    const whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${message}`;

    try {
      const supported = await Linking.canOpenURL(whatsappUrl);
      if (supported) {
        await Linking.openURL(whatsappUrl);
      } else {
        console.log("WhatsApp is not installed");
      }
    } catch (error) {
      console.error("Error opening WhatsApp:", error);
    }
  };

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
        <ThemedText type="subtitle">{t("support.instructions")}</ThemedText>
        <ThemedText type="default">{t("support.instructionsDesc")}</ThemedText>

        <TouchableOpacity
          style={styles.whatsappButton}
          onPress={handleWhatsAppPress}
        >
          <IconSymbol
            name="message.fill"
            size={20}
            color={Colors.light.white}
          />
          <Text style={styles.whatsappButtonText}>
            {t("support.contactWhatsApp")}
          </Text>
        </TouchableOpacity>
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
