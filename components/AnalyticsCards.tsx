import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { useTranslation } from "react-i18next";
import { Card } from "./Card";
import { ThemedText } from "./ThemedText";
import { Colors } from "@/constants/Colors";
import { apiGet } from "@/services/apiClient";
import { IconSymbol } from "./ui/IconSymbol";

interface DriverStats {
  total_assigned: number;
  total_in_progress: number;
  total_completed: number;
}

interface StatCardProps {
  title: string;
  value: number;
  icon: string;
  color: string;
  backgroundColor: string;
}

const StatCard = ({
  title,
  value,
  icon,
  color,
  backgroundColor,
}: StatCardProps) => (
  <Card>
    <View style={styles.statCard}>
      <View style={[styles.iconContainer, { backgroundColor }]}>
        <IconSymbol name={icon as any} size={24} color={color} />
      </View>
      <View style={styles.statContent}>
        <ThemedText type="defaultSemiBold" style={styles.statValue}>
          {value}
        </ThemedText>
        <ThemedText style={styles.statTitle}>{title}</ThemedText>
      </View>
    </View>
  </Card>
);

export const AnalyticsCards = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState<DriverStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDriverStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiGet(
        `${process.env.EXPO_PUBLIC_API_URL}/api/v1/shipments/driver-statistics/`
      );

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        setError(t("home.analytics.errorLoading"));
      }
    } catch (err) {
      console.error("Error fetching driver stats:", err);
      setError(t("home.analytics.errorLoading"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchDriverStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <Card>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
          <ThemedText style={styles.loadingText}>
            {t("common.loading")}
          </ThemedText>
        </View>
      </Card>
    );
  }

  if (error || !stats) {
    return (
      <Card>
        <View style={styles.errorContainer}>
          <IconSymbol
            name="exclamationmark.triangle"
            size={24}
            color={Colors.light.error}
          />
          <ThemedText style={styles.errorText}>
            {error || t("home.analytics.errorLoading")}
          </ThemedText>
        </View>
      </Card>
    );
  }

  return (
    <View style={styles.container}>
      <ThemedText type="subtitle" style={styles.sectionTitle}>
        {t("home.analytics.title")}
      </ThemedText>

      <View style={styles.statsGrid}>
        <StatCard
          title={t("home.analytics.totalAssigned")}
          value={stats.total_assigned}
          icon="tray.and.arrow.down"
          color={Colors.light.info}
          backgroundColor={`${Colors.light.info}15`}
        />

        <StatCard
          title={t("home.analytics.totalInProgress")}
          value={stats.total_in_progress}
          icon="arrow.clockwise"
          color={Colors.light.warning}
          backgroundColor={`${Colors.light.warning}15`}
        />

        <StatCard
          title={t("home.analytics.totalCompleted")}
          value={stats.total_completed}
          icon="checkmark.circle"
          color={Colors.light.success}
          backgroundColor={`${Colors.light.success}15`}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
    color: Colors.light.primary,
  },
  statsGrid: {
    gap: 12,
  },
  statCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 22,
    color: Colors.light.primary,
    fontFamily: "SuisseBold",
  },
  statTitle: {
    fontSize: 14,
    color: Colors.light.text,
    fontFamily: "SuisseMedium",
    marginTop: 2,
  },
  loadingContainer: {
    alignItems: "center",
    padding: 24,
    gap: 12,
  },
  loadingText: {
    color: Colors.light.text,
    fontFamily: "SuisseMedium",
  },
  errorContainer: {
    alignItems: "center",
    padding: 24,
    gap: 12,
  },
  errorText: {
    color: Colors.light.error,
    textAlign: "center",
    fontFamily: "SuisseMedium",
  },
});
