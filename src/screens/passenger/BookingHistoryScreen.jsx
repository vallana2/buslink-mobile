// src/screens/passenger/BookingHistoryScreen.jsx
import { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import api from "../../services/api";
import { COLORS, RADIUS, SHADOW, SPACING } from "../../constants/theme";

export default function BookingHistoryScreen() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings/my");
      setBookings(res.data.bookings);
    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (status) => {
    if (status === "CONFIRMED") return COLORS.success;
    if (status === "CANCELLED") return COLORS.danger;
    if (status === "USED") return COLORS.primary;
    return COLORS.warning;
  };

  const handleCancel = async (id) => {
    Alert.alert("Cancel Booking", "Are you sure you want to cancel this booking?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes, Cancel",
        style: "destructive",
        onPress: async () => {
          try {
            await api.patch(`/bookings/${id}/cancel`);
            fetchBookings();
          } catch (error) {
            Alert.alert("Error", error.response?.data?.message || "Failed to cancel");
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Bookings</Text>
        <Text style={styles.subtitle}>{bookings.length} trip(s)</Text>
      </View>

      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: SPACING.lg, paddingTop: SPACING.md }}
        renderItem={({ item }) => (
          <View style={[styles.card, SHADOW]}>
            <View style={styles.cardTop}>
              <Text style={styles.route}>
                {item.schedule.route.fromStation.city} → {item.schedule.route.toStation.city}
              </Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: `${statusColor(item.status)}1A` },
                ]}
              >
                <Text style={[styles.statusText, { color: statusColor(item.status) }]}>
                  {item.status}
                </Text>
              </View>
            </View>
            <Text style={styles.detail}>🚌 {item.schedule.route.agency.name}</Text>
            <Text style={styles.detail}>
              🕐 {new Date(item.schedule.departureTime).toLocaleString()}
            </Text>
            <Text style={styles.detail}>💰 {item.schedule.price?.toLocaleString()} RWF</Text>

            {item.status === "PENDING" || item.status === "CONFIRMED" ? (
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => handleCancel(item.id)}
              >
                <Text style={styles.cancelBtnText}>✕ Cancel Booking</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🎫</Text>
            <Text style={styles.empty}>No bookings yet</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    backgroundColor: "rgba(7, 51, 229, 0.74)",
    paddingTop: 60,
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  title: { fontSize: 24, fontWeight: "900", color: COLORS.white },
  subtitle: { fontSize: 13, color: COLORS.textOnDark, marginTop: 4 },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  route: { fontSize: 16, fontWeight: "700", color: COLORS.text, flex: 1 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.pill },
  statusText: { fontSize: 11, fontWeight: "700" },
  detail: { fontSize: 13, color: COLORS.textMuted, marginTop: SPACING.xs },
  cancelBtn: {
    marginTop: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.danger,
    borderRadius: RADIUS.button,
    paddingVertical: 10,
    alignItems: "center",
  },
  cancelBtnText: { color: COLORS.danger, fontWeight: "700", fontSize: 13 },
  emptyState: { alignItems: "center", marginTop: 80 },
  emptyEmoji: { fontSize: 40, marginBottom: 8 },
  empty: { textAlign: "center", color: COLORS.textMuted },
});