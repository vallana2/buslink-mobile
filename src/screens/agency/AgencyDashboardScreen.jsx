// src/screens/agency/AgencyDashboardScreen.jsx
import { useState, useEffect } from "react";
import {
  View, Text, StyleSheet, ScrollView,
  ActivityIndicator, TouchableOpacity
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { getBookingReport, getRevenueReport } from "../../services/agency.service";
import { COLORS, RADIUS, SHADOW, SPACING } from "../../constants/theme";

export default function AgencyDashboardScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState(null);
  const [revenue, setRevenue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const [b, r] = await Promise.all([getBookingReport(), getRevenueReport()]);
      setBookings(b);
      setRevenue(r);
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

  const stats = [
    { label: "Total Bookings", value: bookings?.totalBookings ?? 0, icon: "🎫" },
    { label: "Confirmed", value: bookings?.confirmed ?? 0, icon: "✅" },
    { label: "Cancelled", value: bookings?.cancelled ?? 0, icon: "❌" },
    { label: "Total Revenue", value: `${(revenue?.totalRevenue ?? 0).toLocaleString()} RWF`, icon: "💰" },
  ];

  const actions = [
    { label: "Manage Buses", subtitle: "Add & view your fleet", icon: "🚌", screen: "ManageBuses" },
    { label: "Manage Routes", subtitle: "Create & view routes", icon: "🗺️", screen: "ManageRoutes" },
    { label: "Manage Schedules", subtitle: "Set departure times", icon: "📅", screen: "ManageSchedules" },
    { label: "Manage Drivers", subtitle: "Add & view your drivers", icon: "🧑‍✈️", screen: "ManageDrivers" },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.header}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>⚡ AGENCY ADMIN</Text>
        </View>
        <Text style={styles.title}>Hi, {user?.name?.split(" ")[0]}</Text>
        <Text style={styles.subtitle}>Manage your agency operations</Text>
      </View>

      <View style={styles.statsGrid}>
        {stats.map((s) => (
          <View key={s.label} style={[styles.statCard, SHADOW]}>
            <Text style={styles.statIcon}>{s.icon}</Text>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Operations</Text>

      {actions.map((a) => (
        <TouchableOpacity
          key={a.screen}
          style={[styles.actionCard, SHADOW]}
          onPress={() => navigation.navigate(a.screen)}
        >
          <Text style={styles.actionIcon}>{a.icon}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.actionTitle}>{a.label}</Text>
            <Text style={styles.actionSubtitle}>{a.subtitle}</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      ))}

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
    backgroundColor: "rgba(7, 51, 229, 0.74)",
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
  badgeText: { color: COLORS.white, fontSize: 11, fontWeight: "800", letterSpacing: 0.5 },
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
    fontSize: 16, fontWeight: "700",
    marginTop: SPACING.xl, marginHorizontal: SPACING.lg,
    color: COLORS.text,
  },
  actionCard: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: COLORS.white, borderRadius: RADIUS.card,
    padding: SPACING.md, marginHorizontal: SPACING.lg,
    marginTop: SPACING.md, gap: SPACING.md,
  },
  actionIcon: { fontSize: 28 },
  actionTitle: { fontSize: 15, fontWeight: "700", color: COLORS.text },
  actionSubtitle: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  chevron: { fontSize: 24, color: COLORS.textMuted },
  logoutButton: {
    backgroundColor: "rgba(7, 51, 229, 0.74)", borderRadius: RADIUS.button,
    paddingVertical: 16, alignItems: "center",
    marginHorizontal: SPACING.lg, marginTop: SPACING.xl,
  },
  logoutText: { color: COLORS.white, fontWeight: "800", fontSize: 14, letterSpacing: 0.5 },
});