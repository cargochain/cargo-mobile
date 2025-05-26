import {
  SafeAreaView,
  StyleSheet,
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Platform,
} from "react-native";
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "expo-router";

import { ThemedText } from "@/components/ThemedText";
import { useTranslation } from "react-i18next";
import { Colors } from "@/constants/Colors";
import { SearchShipmentsQuery } from "@/services/generated/graphql";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useAuth } from "@/services/authContext";
import { useEffect, useMemo } from "react";
import { getDeviceMetadata } from "@/services/secureStorage";

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
      pollInterval: 5000,
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
        return "🕐 Pendente";
      case "IN_TRANSIT":
        return "🚚 Em trânsito";
      case "DELIVERED":
        return "🎉 Entregue";
      case "CANCELLED":
        return "❌ Cancelado";
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
      <View style={styles.container}>
        {loading ? (
          <ThemedText>{t("Loading...")}</ThemedText>
        ) : error ? (
          <ThemedText style={styles.error}>
            {t("Error loading shipments")}
          </ThemedText>
        ) : (
          <FlatList
            data={data?.shipments}
            renderItem={renderShipment}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              <ThemedText>{t("No shipments found")}</ThemedText>
            }
          />
        )}
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
  listContainer: {
    gap: 8,
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
  cardBodyValue: {
    fontSize: 18,
    color: `${Colors.light.primary}88`,
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
