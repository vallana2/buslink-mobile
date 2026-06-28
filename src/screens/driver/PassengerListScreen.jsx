// src/screens/driver/PassengerListScreen.jsx
import { useState, useEffect } from "react";
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator
} from "react-native";
import api from "../../services/api";
import { COLORS, RADIUS, SHADOW, SPACING } from "../../constants/theme";

export default function PassengerListScreen({ route, navigation }) {
  const { scheduleId } = route.params;
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchPassengers(); }, []);

  const fetchPassengers = async () => {
    try {
      const res = await api.get(`/drivers/trips/${scheduleId}/passengers`);
      setBookings(res.data.bookings || []);
    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Passenger List</Text>
        <Text style={styles.subtitle}>{bookings.length} passenger(s)</Text>
      </View>

      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: SPACING.lg, paddingTop: SPACING.md }}
        renderItem={({ item }) => (
          <View style={[styles.card, SHADOW]}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {item.passenger?.name?.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.passenger?.name}</Text>
              <Text style={styles.phone}>{item.passenger?.phone}</Text>
            </View>
            <View style={[styles.statusBadge,
              { backgroundColor: item.status === "CONFIRMED" ? "#E8F8EE" : "#FFF0E5" }]}>
              <Text style={[styles.statusText,
                { color: item.status === "CONFIRMED" ? COLORS.success : COLORS.warning }]}>
                {item.status}
              </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>👥</Text>
            <Text style={styles.emptyText}>No passengers yet</Text>
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
    backgroundColor: COLORS.secondary, paddingTop: 60,
    paddingBottom: SPACING.lg, paddingHorizontal: SPACING.lg,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
  },
  backText: { color: COLORS.primary, fontSize: 15, fontWeight: "600", marginBottom: SPACING.sm },
  title: { fontSize: 22, fontWeight: "900", color: COLORS.white },
  subtitle: { fontSize: 13, color: COLORS.textOnDark, marginTop: 4 },
  card: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: COLORS.white, borderRadius: RADIUS.card,
    padding: SPACING.md, marginBottom: SPACING.md, gap: SPACING.md,
  },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: "center", alignItems: "center",
  },
  avatarText: { color: COLORS.white, fontWeight: "800", fontSize: 18 },
  name: { fontSize: 15, fontWeight: "700", color: COLORS.text },
  phone: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.pill },
  statusText: { fontSize: 11, fontWeight: "800" },
  emptyState: { alignItems: "center", marginTop: 80 },
  emptyEmoji: { fontSize: 40, marginBottom: 8 },
  emptyText: { color: COLORS.textMuted },
});