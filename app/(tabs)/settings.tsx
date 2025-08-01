import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";

import { useTranslation } from "react-i18next";
import { Colors } from "@/constants/Colors";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { changeLanguage, getAvailableLanguages } from "@/i18n";
import { useAuth } from "@/services/authContext";
import { FontAwesome } from "@expo/vector-icons";
import { apiDelete } from "@/services/apiClient";

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const availableLanguages = getAvailableLanguages();
  const { logout } = useAuth();

  const getLanguageFlag = (lang: string) => {
    const flags: { [key: string]: string } = {
      en: "🇬🇧",
      es: "🇪🇸",
      pt: "🇵🇹",
    };
    return flags[lang] || lang.toUpperCase();
  };

  const handleLanguageChange = async (language: string) => {
    await changeLanguage(language as any);
  };

  const handleLogout = async () => {
    await logout();
  };

  const deleteAccount = async () => {
    const response = await apiDelete(
      `${process.env.EXPO_PUBLIC_API_URL}/api/v1/users/delete-account/`
    );
    if (response.ok) {
      await logout();
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      t("settings.deleteAccount"),
      t("settings.deleteAccountConfirmation"),
      [
        {
          text: t("common.cancel"),
          style: "cancel",
        },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAccount();
              await logout();
            } catch {
              Alert.alert(t("common.error"), t("settings.deleteAccountError"));
            }
          },
        },
      ]
    );
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
          <Text style={styles.headerTitle}>{t("settings.title")}</Text>
          <Text style={styles.headerSubtitle}>{t("settings.description")}</Text>
        </View>
      </View>
      <View style={styles.container}>
        {/* Language Selection Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("settings.language")}</Text>
          <View style={styles.languageList}>
            {availableLanguages.map((lang) => (
              <TouchableOpacity
                key={lang}
                style={[
                  styles.languageOption,
                  i18n.language === lang && styles.selectedLanguage,
                ]}
                onPress={() => handleLanguageChange(lang)}
              >
                <Text
                  style={[
                    styles.languageText,
                    i18n.language === lang && styles.selectedLanguageText,
                  ]}
                >
                  {getLanguageFlag(lang)} {lang.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.section}>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <FontAwesome
              name="sign-out"
              size={24}
              color={Colors.light.primary}
            />
            <Text style={styles.sectionTitle}>{t("settings.logout")}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          <TouchableOpacity
            onPress={handleDeleteAccount}
            style={styles.deleteButton}
          >
            <FontAwesome name="trash" size={24} color={Colors.light.error} />
            <Text style={[styles.sectionTitle, styles.deleteText]}>
              {t("settings.deleteAccount")}
            </Text>
          </TouchableOpacity>
        </View>
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
  section: {
    backgroundColor: Colors.light.white,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "SuisseMedium",
    color: Colors.light.text,
  },
  languageList: {
    flexDirection: "row",
    gap: 8,
  },
  languageOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: `${Colors.light.primary}30`,
    backgroundColor: Colors.light.white,
  },
  selectedLanguage: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  languageText: {
    fontSize: 14,
    fontFamily: "SuisseMedium",
    color: Colors.light.text,
  },
  selectedLanguageText: {
    color: Colors.light.white,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  deleteText: {
    color: Colors.light.error,
  },
});
