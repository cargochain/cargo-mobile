import { View, Text, StyleSheet } from "react-native";
import { Button } from "@/shared/Button";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";

export default function SuccessRegistration() {
  const handleLoginPress = () => {
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.message}>Successfully Registered</Text>
      <Button
        title="Go to Login"
        onPress={handleLoginPress}
        variant="primary"
        size="large"
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: Colors.light.background,
  },
  message: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    color: Colors.light.text,
    textAlign: "center",
  },
  button: {
    width: "100%",
    maxWidth: 300,
  },
});
