import { View, Text, Button, StyleSheet } from "react-native";
import { useCameraPermissions } from "@/utils/permissions";

export function CameraPermissionCheck() {
  const { status, requestPermission, isGranted } = useCameraPermissions();

  if (status === null) {
    return <Text>Checking permissions…</Text>;
  }

  if (!isGranted) {
    return (
      <View style={styles.center}>
        <Text>We need camera permission to continue</Text>
        <Button title="Grant permission" onPress={requestPermission} />
      </View>
    );
  }

  return null; // or your camera component
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
});
