import {
  SafeAreaView,
  StyleSheet,
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Platform,
  ScrollView,
} from "react-native";
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "expo-router";

import { ThemedText } from "@/components/ThemedText";
import { useTranslation } from "react-i18next";
import { Colors } from "@/constants/Colors";
import { SearchShipmentsQuery } from "@/services/generated/graphql";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useAuth } from "@/services/authContext";
import { useEffect } from "react";
import { getDeviceMetadata } from "@/services/secureStorage";
import { SafeAreaProvider } from "react-native-safe-area-context";

const GET_SHIPMENTS = gql`
  query SearchShipments($input: ShipmentSearchInput!) {
    shipments(input: $input) {
      id
      trackingCode
      status
      createdAt
      updatedAt
      company {
        name
      }
      user {
        name
      }
    }
  }
`;

export default function ShipmentsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuth();
  const { data, loading, error, refetch } = useQuery<SearchShipmentsQuery>(
    GET_SHIPMENTS,
    {
      pollInterval: 1000,
      variables: {
        input: {
          driverId: user?.id,
        },
      },
    }
  );

  useEffect(() => {
    getDeviceMetadata().then((metadata) => {
      console.log("metadata", metadata);
    });
  }, []);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ASSIGNED":
        return `${t("common.pending")} 🕐`;
      case "IN_TRANSIT":
        return `${t("common.inTransit")} 🚚`;
      case "DELIVERED":
        return `${t("common.delivered")} 🎉`;
      case "CANCELLED":
        return `❌ ${t("common.cancelled")}`;
      default:
        return status;
    }
  };

  const renderShipment = ({
    item,
  }: {
    item: SearchShipmentsQuery["shipments"][0];
  }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/shipment/${item.trackingCode}`)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderTitleContainer}>
          <Text style={styles.cardHeaderTitle}>{item.trackingCode}</Text>
        </View>
        <Text style={styles.cardHeaderStatus}>
          {getStatusLabel(item.status)}
        </Text>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.cardBodyItem}>
          <Text style={styles.cardBodyLabel}>{item.user.name}</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.cardFooterLabel}>
          {t("shipments.createdAt")}{" "}
          {new Date(item.createdAt).toLocaleDateString("pt-BR", {
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
        {loading ? (
          <View style={styles.centerContent}>
            <ThemedText>{t("Loading...")}</ThemedText>
          </View>
        ) : error ? (
          <View style={styles.centerContent}>
            <ThemedText style={styles.error}>
              {t("Error loading shipments")}
            </ThemedText>
          </View>
        ) : (
          <FlatList
            data={data?.shipments}
            renderItem={renderShipment}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              <View style={styles.centerContent}>
                <ThemedText>{t("No shipments found")}</ThemedText>
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
    gap: 8,
  },
  cardBodyItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardBodyLabel: {
    fontSize: 12,
    color: Colors.light.text,
    fontFamily: "SuisseMedium",
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
