import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { Colors } from "@/constants/Colors";
import { useTranslation } from "react-i18next";
import { ThemedText } from "@/components/ThemedText";
import { FontAwesome6 } from "@expo/vector-icons";
import { components } from "@/lib/rest-api.types";
import useSWR from "swr";
import { getAccessToken } from "@/services/secureStorage";

const fetcher = async (url: string) => {
  const token = await getAccessToken();
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};

export default function ShipmentDetailsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<{ shipmentUuid: string }>();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const {
    data: shipment,
    error,
    isLoading,
  } = useSWR<components["schemas"]["Shipment"]>(
    `${process.env.EXPO_PUBLIC_API_URL}/api/v1/shipments/${params.shipmentUuid}/`,
    fetcher
  );

  const {
    data: attachments,
    error: attachmentsError,
    isLoading: attachmentsLoading,
  } = useSWR<components["schemas"]["ListAttachment"][]>(
    `${process.env.EXPO_PUBLIC_API_URL}/api/v1/shipments/${params.shipmentUuid}/attachments/`,
    fetcher
  );

  if (isLoading || attachmentsLoading) {
    return <ThemedText>{t("Loading...")}</ThemedText>;
  }

  if (error || attachmentsError) {
    return <ThemedText>{t("Error loading shipment details")}</ThemedText>;
  }

  if (!shipment) {
    return <ThemedText>{t("Shipment not found")}</ThemedText>;
  }

  return (
    <SafeAreaView style={styles.wrapper}>
      {false && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.light.white} />
          <ThemedText style={styles.loadingText}>
            {t("Uploading files...")}
          </ThemedText>
        </View>
      )}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <FontAwesome6
            name="chevron-left"
            size={16}
            color={Colors.light.primary}
          />
          <ThemedText type="default">{t("common.back")}</ThemedText>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <View>
            <Text style={styles.headerTitleLabel}>CMR</Text>
            <Text style={styles.headerTitleValue}>{shipment.cmr_code}</Text>
          </View>
          <View>
            <Text style={styles.headerTitleLabel}>SHIPPER</Text>
            <Text style={styles.headerTitleValue}>{shipment.user.name}</Text>
          </View>
          <View>
            <Text style={styles.headerTitleLabel}>BUYER</Text>
            <Text style={styles.headerTitleValue}>{shipment.company.name}</Text>
          </View>
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.photos}>
          <FlatList
            data={attachments}
            renderItem={({ item }) => (
              <View style={styles.photoItem} key={item.file}>
                <Image
                  source={{ uri: item.file }}
                  style={styles.photoItemImage}
                />
              </View>
            )}
            numColumns={3}
            keyExtractor={(item) => item.file}
          />
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          onPress={() => router.push(`/shipment/upload/${params.shipmentUuid}`)}
          style={{
            width: "100%",
            height: 50,
            backgroundColor: Colors.light.primary,
            borderRadius: 10,
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            justifyContent: "center",
          }}
        >
          <FontAwesome6 name="upload" size={18} color={Colors.light.white} />
          <Text style={styles.addPhotosButtonText}>
            {t("common.addPhotos")}
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
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderColor: `${Colors.light.primary}16`,
    gap: 16,
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
  },
  headerTitleLabel: {
    fontSize: 11,
    color: Colors.light.text,
  },
  headerTitleValue: {
    fontSize: 16,
    color: Colors.light.primary,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    backgroundColor: Colors.light.secondary,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusLabel: {
    fontSize: 14,
    color: Colors.light.text,
    fontFamily: "SuisseMedium",
  },
  statusValue: {
    fontSize: 18,
    color: Colors.light.primary,
    fontFamily: "SuisseBold",
  },
  photos: {
    flex: 1,
  },
  photosHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    marginBottom: 16,
  },
  photosHeaderText: {
    fontSize: 18,
    color: Colors.light.text,
    fontFamily: "SuisseBold",
  },
  photosBody: {
    gap: 1,
  },
  photosButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  photosButtonText: {
    fontSize: 14,
    color: Colors.light.text,
    fontFamily: "SuisseMedium",
  },
  photoItem: {
    width: "33.33%", // 3 columns with some spacing
    aspectRatio: 1, // Square images
    overflow: "hidden",
    padding: 1,
  },
  photoItemImage: {
    width: "100%",
    height: "100%",
  },
  actionButton: {
    color: Colors.light.info,
    fontSize: 16,
    fontFamily: "SuisseIntl-Medium",
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: Colors.light.white,
    borderTopWidth: 1,
    borderTopColor: `${Colors.light.primary}33`,
  },
  addPhotosButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.light.info,
    padding: 10,
    borderRadius: 10,
    color: Colors.light.white,
  },
  addPhotosButtonText: {
    color: Colors.light.white,
    fontSize: 16,
  },
  statusText: {
    fontSize: 16,
    color: Colors.light.primary,
    textAlign: "center",
  },
  imageSelectorModalWrapper: {
    flex: 1,
    backgroundColor: Colors.light.white,
    gap: 16,
  },

  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loadingText: {
    color: Colors.light.white,
    marginTop: 12,
    fontSize: 16,
  },
});
