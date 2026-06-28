// src/screens/driver/DriverHomeScreen.jsx
import { useState, useEffect } from "react";
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator
} from "react-native";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { COLORS, RADIUS, SHADOW, SPACING } from "../../constants/theme";

export default function DriverHomeScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchTrips(); }, []);

  const fetchTrips = async () => {
    try {
      const res = await api.get("/drivers/my-trips");
      setTrips(res.data.trips || []);
    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (status) => {
    if (status === "DEPARTED") return COLORS.primary;
    if (status === "ARRIVED") return COLORS.success;
    if (status === "BOARDING") return COLORS.warning;
    return COLORS.textMuted;
  };

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.name?.split(" ")[0]} 👋</Text>
          <Text style={styles.subtitle}>Your trips for today</Text>
        </View>
        <TouchableOpacity style={styles.scanBtn}
          onPress={() => navigation.navigate("QRScanner")}>
          <Text style={styles.scanBtnText}>📷 Scan</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={trips}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: SPACING.lg, paddingTop: SPACING.md }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, SHADOW]}
            onPress={() => navigation.navigate("PassengerList", { scheduleId: item.id })}
          >
            <View style={styles.cardTop}>
              <Text style={styles.route}>
                {item.route?.fromStation?.city} → {item.route?.toStation?.city}
              </Text>
              <View style={[styles.statusBadge, { backgroundColor: `${statusColor(item.status)}1A` }]}>
                <Text style={[styles.statusText, { color: statusColor(item.status) }]}>
                  {item.status || "SCHEDULED"}
                </Text>
              </View>
            </View>
            <Text style={styles.detail}>
              🕐 {new Date(item.departureTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </Text>
            <Text style={styles.detail}>🚌 {item.bus?.plateNumber}</Text>
            <Text style={styles.detail}>💺 {item.availableSeats} seats remaining</Text>
            <TouchableOpacity
              style={styles.updateBtn}
              onPress={() => navigation.navigate("UpdateTripStatus", { scheduleId: item.id, currentStatus: item.status })}
            >
              <Text style={styles.updateBtnText}>Update Status →</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🚌</Text>
            <Text style={styles.emptyTitle}>No trips assigned</Text>
            <Text style={styles.emptyText}>You have no trips scheduled for today</Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    backgroundColor: COLORS.secondary,
    paddingTop: 60, paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end",
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
  },
  greeting: { fontSize: 22, fontWeight: "900", color: COLORS.white },
  subtitle: { fontSize: 13, color: COLORS.textOnDark, marginTop: 4 },
  scanBtn: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.pill,
    paddingHorizontal: 16, paddingVertical: 8,
  },
  scanBtnText: { color: COLORS.white, fontWeight: "700", fontSize: 13 },
  card: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.card,
    padding: SPACING.md, marginBottom: SPACING.md,
  },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: SPACING.sm },
  route: { fontSize: 16, fontWeight: "700", color: COLORS.text, flex: 1 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.pill },
  statusText: { fontSize: 11, fontWeight: "800" },
  detail: { fontSize: 13, color: COLORS.textMuted, marginTop: 4 },
  updateBtn: { marginTop: SPACING.sm },
  updateBtnText: { color: COLORS.primary, fontWeight: "600", fontSize: 13 },
  emptyState: { alignItems: "center", marginTop: 80 },
  emptyEmoji: { fontSize: 48, marginBottom: SPACING.md },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: COLORS.text },
  emptyText: { fontSize: 14, color: COLORS.textMuted, marginTop: 4 },
  logoutBtn: {
    margin: SPACING.lg, borderWidth: 1, borderColor: COLORS.danger,
    borderRadius: RADIUS.button, paddingVertical: 14, alignItems: "center",
  },
  logoutText: { color: COLORS.danger, fontWeight: "700" },
});