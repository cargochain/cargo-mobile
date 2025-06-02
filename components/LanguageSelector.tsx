import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { useTranslation } from "react-i18next";
import { getAvailableLanguages, changeLanguage } from "@/i18n";
import { Colors } from "@/constants/Colors";

interface LanguageSelectorProps {
  visible: boolean;
  onClose: () => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  visible,
  onClose,
}) => {
  const { t, i18n } = useTranslation();
  const [languages, setLanguages] = useState<string[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState<string>(i18n.language);

  useEffect(() => {
    setLanguages(getAvailableLanguages());
  }, []);

  const handleLanguageChange = async (language: string) => {
    await changeLanguage(language as any);
    setCurrentLanguage(language);
    onClose();
  };

  const renderLanguageItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.languageItem,
        currentLanguage === item && styles.selectedLanguage,
      ]}
      onPress={() => handleLanguageChange(item)}
    >
      <ThemedText
        style={[
          styles.languageText,
          currentLanguage === item && styles.selectedLanguageText,
        ]}
      >
        {item === "en" ? "English" : item === "es" ? "Español" : item}
      </ThemedText>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <ThemedView style={styles.modalContent}>
          <ThemedText type="title" style={styles.modalTitle}>
            {t("common.language")}
          </ThemedText>
          <FlatList
            data={languages}
            renderItem={renderLanguageItem}
            keyExtractor={(item) => item}
            style={styles.languageList}
          />
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <ThemedText>{t("common.cancel")}</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light.white,
  },
  modalContent: {
    width: "80%",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    backgroundColor: Colors.light.white,
  },
  modalTitle: {
    marginBottom: 20,
  },
  languageList: {
    width: "100%",
    maxHeight: 300,
  },
  languageItem: {
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
    alignItems: "center",
  },
  selectedLanguage: {
    backgroundColor: "#007AFF",
  },
  languageText: {
    fontSize: 16,
  },
  selectedLanguageText: {
    color: "white",
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
  },
});
