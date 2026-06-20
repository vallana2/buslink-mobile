// src/screens/admin/DashboardScreen.jsx
import { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { getPlatformOverview } from "../../services/admin.service";
import { COLORS, RADIUS, SHADOW, SPACING } from "../../constants/theme";

export default function DashboardScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    try {
      const data = await getPlatformOverview();
      setStats(data);
    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: COLORS.secondary }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const cards = [
    { label: "Total Agencies", value: stats?.totalAgencies ?? 0, icon: "🏢" },
    { label: "Total Users", value: stats?.totalUsers ?? 0, icon: "👥" },
    { label: "Total Bookings", value: stats?.totalBookings ?? 0, icon: "🎫" },
    { label: "Total Revenue", value: `${(stats?.totalRevenue ?? 0).toLocaleString()} RWF`, icon: "💰" },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.header}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>SYSTEM ADMIN</Text>
        </View>
        <Text style={styles.title}>Hi, {user?.name?.split(" ")[0]}</Text>
        <Text style={styles.subtitle}>Platform overview at a glance</Text>
      </View>

      <View style={styles.statsGrid}>
        {cards.map((c) => (
          <View key={c.label} style={[styles.statCard, SHADOW]}>
            <Text style={styles.statIcon}>{c.icon}</Text>
            <Text style={styles.statValue}>{c.value}</Text>
            <Text style={styles.statLabel}>{c.label}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Manage Platform</Text>

      <TouchableOpacity
        style={[styles.actionCard, SHADOW]}
        onPress={() => navigation.navigate("ManageAgencies")}
      >
        <Text style={styles.actionIcon}>🏢</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.actionTitle}>Manage Agencies</Text>
          <Text style={styles.actionSubtitle}>Approve new agencies, edit details</Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionCard, SHADOW]}
        onPress={() => navigation.navigate("ManageUsers")}
      >
        <Text style={styles.actionIcon}>👥</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.actionTitle}>Manage Users</Text>
          <Text style={styles.actionSubtitle}>View all registered users</Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>LOG OUT</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    backgroundColor: COLORS.secondary,
    paddingTop: 70,
    paddingBottom: 56,
    paddingHorizontal: SPACING.lg,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.secondaryLight,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.pill,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: SPACING.md,
  },
  badgeText: { color: COLORS.primary, fontSize: 11, fontWeight: "800", letterSpacing: 0.5 },
  title: { fontSize: 26, fontWeight: "900", color: COLORS.white },
  subtitle: { fontSize: 14, color: COLORS.textOnDark, marginTop: 4 },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: SPACING.lg,
    marginTop: -32,
    gap: SPACING.md,
  },
  statCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    padding: SPACING.md,
    width: "47%",
  },
  statIcon: { fontSize: 24, marginBottom: SPACING.xs },
  statValue: { fontSize: 20, fontWeight: "900", color: COLORS.text },
  statLabel: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: SPACING.xl,
    marginHorizontal: SPACING.lg,
    color: COLORS.text,
  },
  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    padding: SPACING.md,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    gap: SPACING.md,
  },
  actionIcon: { fontSize: 28 },
  actionTitle: { fontSize: 15, fontWeight: "700", color: COLORS.text },
  actionSubtitle: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  chevron: { fontSize: 24, color: COLORS.textMuted },
  logoutButton: {
    backgroundColor: COLORS.danger,
    borderRadius: RADIUS.button,
    paddingVertical: 16,
    alignItems: "center",
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.xl,
  },
  logoutText: { color: COLORS.white, fontWeight: "800", fontSize: 14, letterSpacing: 0.5 },
});