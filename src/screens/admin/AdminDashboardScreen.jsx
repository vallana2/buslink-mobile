import { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { getPlatformOverview } from "../../services/admin.service";
import { COLORS, RADIUS, SHADOW, SPACING } from "../../constants/theme";

export default function AdminDashboardScreen({ navigation }) {
  const { user } = useAuth();
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchOverview(); }, []);

  const fetchOverview = async () => {
    try {
      const data = await getPlatformOverview();
      setOverview(data);
    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome back, {user?.name?.split(" ")[0]} 👋</Text>
        <Text style={styles.subtitle}>System overview</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
      ) : (
        <View style={styles.statsGrid}>
          <StatCard label="Agencies" value={overview?.totalAgencies} icon="🏢" />
          <StatCard label="Users" value={overview?.totalUsers} icon="👥" />
          <StatCard label="Bookings" value={overview?.totalBookings} icon="🎫" />
          <StatCard
            label="Revenue"
            value={`${(overview?.totalRevenue || 0).toLocaleString()} RWF`}
            icon="💰"
            wide
          />
        </View>
      )}

      <Text style={styles.sectionTitle}>Quick Actions</Text>

      <TouchableOpacity
        style={[styles.actionCard, SHADOW]}
        onPress={() => navigation.navigate("Stations")}
      >
        <Text style={styles.actionIcon}>🏢</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.actionTitle}>Manage Stations</Text>
          <Text style={styles.actionSubtitle}>Add or view bus stations</Text>
        </View>
        <Text style={styles.actionArrow}>→</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionCard, SHADOW]}
        onPress={() => navigation.navigate("Agencies")}
      >
        <Text style={styles.actionIcon}>🚌</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.actionTitle}>Manage Agencies</Text>
          <Text style={styles.actionSubtitle}>Add agencies, link stations, create admins</Text>
        </View>
        <Text style={styles.actionArrow}>→</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function StatCard({ label, value, icon, wide }) {
  return (
    <View style={[styles.statCard, SHADOW, wide && styles.statCardWide]}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statValue}>{value ?? "—"}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  header: {
    backgroundColor: COLORS.text,
    paddingTop: 60,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  welcomeText: { fontSize: 22, fontWeight: "800", color: "#fff" },
  subtitle: { fontSize: 13, color: "#aaa", marginTop: 4 },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: SPACING.lg,
    marginTop: -28,
    gap: SPACING.sm,
  },
  statCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    padding: SPACING.md,
    width: "47%",
  },
  statCardWide: { width: "100%" },
  statIcon: { fontSize: 22 },
  statValue: { fontSize: 20, fontWeight: "800", color: COLORS.text, marginTop: 4 },
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
  },
  actionIcon: { fontSize: 28, marginRight: SPACING.md },
  actionTitle: { fontSize: 15, fontWeight: "700", color: COLORS.text },
  actionSubtitle: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  actionArrow: { fontSize: 18, color: COLORS.primary },
});