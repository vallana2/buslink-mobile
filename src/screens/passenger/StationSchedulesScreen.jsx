// src/screens/passenger/StationSchedulesScreen.jsx
import { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { searchSchedules } from "../../services/schedules.service";
import { COLORS, RADIUS, SHADOW, SPACING } from "../../constants/theme";

export default function StationSchedulesScreen({ route, navigation }) {
  const { station, agency } = route.params;
  const insets = useSafeAreaInsets();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const data = await searchSchedules(station.city, undefined, undefined, agency?.id);
      setSchedules(data);
    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
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
      <View style={[styles.headerBar, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backRow}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <View style={styles.headerRow}>
          <Ionicons name="business" size={22} color="#fff" />
          <Text style={styles.headerTitle}>{agency?.name}</Text>
        </View>
        <Text style={styles.headerSubtitle}>{schedules.length} buses from {station.city}</Text>
      </View>

      <FlatList
        data={schedules}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: SPACING.lg, paddingTop: SPACING.md }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, SHADOW]}
            onPress={() => navigation.navigate("ScheduleDetail", { scheduleId: item.id })}
          >
            <View style={styles.routeRow}>
              <Text style={styles.cityText}>{item.route.fromStation.city}</Text>
              <Ionicons name="arrow-forward" size={14} color={COLORS.primary} style={{ marginHorizontal: 8 }} />
              <Text style={styles.cityText}>{item.route.toStation.city}</Text>
              <View style={styles.seatsBadge}>
                <Text style={styles.seatsText}>{item.availableSeats} seats</Text>
              </View>
            </View>
            <View style={styles.cardMiddle}>
              <Text style={styles.timeText}>
                {new Date(item.departureTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </Text>
              <View style={styles.dashedLine} />
              <Text style={styles.busType}>{item.bus.busType || "Standard"}</Text>
            </View>
            <View style={styles.cardBottom}>
              <Text style={styles.dateText}>
                {new Date(item.departureTime).toLocaleDateString()}
              </Text>
              <Text style={styles.priceText}>{item.price.toLocaleString()} RWF</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="bus-outline" size={40} color="#CCC" />
            <Text style={styles.emptyText}>No buses currently scheduled with this agency from this station</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  headerBar: {
    backgroundColor: "#2E5BFF",
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backRow: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: SPACING.md },
  backText: { color: "#fff", fontSize: 14, fontWeight: "600" },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  headerTitle: { fontSize: 20, fontWeight: "700", color: COLORS.white },
  headerSubtitle: { fontSize: 13, color: COLORS.textOnDark, marginTop: 4 },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  routeRow: { flexDirection: "row", alignItems: "center" },
  cityText: { fontSize: 14, color: COLORS.text, fontWeight: "700" },
  seatsBadge: { marginLeft: "auto", backgroundColor: "#FFF0E5", paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.pill },
  seatsText: { fontSize: 11, color: COLORS.primaryDark, fontWeight: "700" },
  cardMiddle: { flexDirection: "row", alignItems: "center", marginTop: SPACING.sm },
  timeText: { fontSize: 18, fontWeight: "700", color: COLORS.text },
  dashedLine: { flex: 1, height: 1, borderStyle: "dashed", borderWidth: 1, borderColor: COLORS.border, marginHorizontal: 10 },
  busType: { fontSize: 12, color: COLORS.textMuted },
  cardBottom: { flexDirection: "row", justifyContent: "space-between", marginTop: SPACING.sm, paddingTop: SPACING.sm, borderTopWidth: 1, borderColor: COLORS.border },
  dateText: { fontSize: 13, color: COLORS.textMuted },
  priceText: { fontSize: 16, fontWeight: "800", color: COLORS.primaryDark },
  emptyState: { alignItems: "center", marginTop: 80, gap: 8 },
  emptyText: { color: COLORS.textMuted, textAlign: "center", paddingHorizontal: 40 },
});