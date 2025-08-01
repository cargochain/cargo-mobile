import {
  SafeAreaView,
  StyleSheet,
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";

import { ThemedText } from "@/components/ThemedText";
import { useTranslation } from "react-i18next";
import { Colors } from "@/constants/Colors";
import { IconSymbol } from "@/components/ui/IconSymbol";
import useSWR from "swr";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { components } from "@/lib/rest-api.types";
import { fetcher } from "@/shared";

export default function ShipmentsScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const { data, error, isLoading } = useSWR<
    components["schemas"]["PaginatedShipmentList"]
  >(`${process.env.EXPO_PUBLIC_API_URL}/api/v1/shipments/`, fetcher, {
    refreshInterval: 5000,
  });

  const renderShipment = ({
    item,
  }: {
    item: components["schemas"]["Shipment"];
  }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/shipment/${item.uuid}`)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderTitleContainer}>
          <Text style={styles.cardHeaderTitle}>{item.cmr_code}</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.cardBodyItem}>
          <Text style={styles.cardBodyLabel}>SHIPPER</Text>
          <Text style={styles.cardBodyValue}>{item.user.name}</Text>
        </View>
        <View style={styles.cardBodyItem}>
          <Text style={styles.cardBodyLabel}>BUYER</Text>
          <Text style={styles.cardBodyValue}>{item.company.name}</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.cardFooterLabel}>
          {t("shipments.createdAt")}{" "}
          {new Date(item.created_at).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaProvider>
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
            <Text style={styles.headerTitle}>{t("shipments.title")}</Text>
            <Text style={styles.headerSubtitle}>
              {t("shipments.description")}
            </Text>
          </View>
        </View>
        {isLoading ? (
          <View style={styles.centerContent}>
            <ThemedText>{t("common.loading")}</ThemedText>
          </View>
        ) : error ? (
          <View style={styles.centerContent}>
            <ThemedText style={styles.error}>
              {t("common.errorLoadingShipments")}
            </ThemedText>
          </View>
        ) : (
          <FlatList
            data={data?.results}
            renderItem={renderShipment}
            keyExtractor={(item) => item.uuid}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              <View style={styles.centerContent}>
                <ThemedText>{t("common.noShipments")}</ThemedText>
              </View>
            }
            style={styles.list}
          />
        )}
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
  list: {
    flex: 1,
    backgroundColor: Colors.light.secondary,
  },
  listContainer: {
    padding: 16,
    gap: 8,
    paddingBottom: 100,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light.secondary,
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
  cardHeaderTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  cardHeaderTitle: {
    fontSize: 16,
    fontFamily: "SuisseBold",
    textTransform: "uppercase",
  },
  cardBody: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  cardBodyItem: {
    flexDirection: "column",
  },
  cardBodyLabel: {
    fontSize: 11,
    color: Colors.light.text,
    textTransform: "uppercase",
  },
  cardBodyValue: {
    fontSize: 12,
    color: Colors.light.primary,
  },
  card: {
    backgroundColor: Colors.light.background,
    padding: 16,
    gap: 8,
    borderColor: `${Colors.light.primary}10`,
    borderRadius: 8,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardFooterLabel: {
    fontSize: 12,
    color: `${Colors.light.text}88`,
    fontFamily: "SuisseMedium",
  },
  error: {
    color: Colors.light.error,
    textAlign: "center",
  },
});
