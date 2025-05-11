import { Colors } from "@/constants/Colors";
import { StyleSheet, View } from "react-native";

export const Card = ({ children }: { children: React.ReactNode }) => {
  return <View style={styles.card}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.white,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: `${Colors.light.primary}10`,
  },
});
