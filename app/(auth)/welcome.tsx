import { View, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Colors } from "@/constants/Colors";
import { Button } from "@/shared";

export default function WelcomeScreen() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Cargo</Text>
        <Text style={styles.subtitle}>{t("welcome.subtitle")}</Text>

        <View style={styles.buttonContainer}>
          <Button
            title={t("welcome.login")}
            onPress={() => router.push("/login")}
            variant="primary"
            size="large"
          />
          <Button
            title={t("welcome.register")}
            onPress={() => router.push("/register")}
            variant="outline"
            size="large"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light.secondary,
  },
  card: {
    padding: 10,
    width: "90%",
    maxWidth: 340,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontFamily: "SuisseBold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 40,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 300,
    gap: 20,
  },
  button: {
    backgroundColor: Colors.light.primary,
    padding: 15,
    borderRadius: 24,
    marginBottom: 15,
    alignItems: "center",
  },
  outlineButton: {
    backgroundColor: Colors.light.secondary,
    borderWidth: 1,
    borderColor: Colors.light.primary,
    padding: 15,
    color: Colors.light.primary,
    borderRadius: 24,
    marginBottom: 15,
    alignItems: "center",
  },
  outlineButtonText: {
    color: Colors.light.primary,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  registerButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: Colors.light.primary,
  },
  registerButtonText: {
    color: Colors.light.primary,
  },
  orText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 15,
    textAlign: "center",
  },
});
