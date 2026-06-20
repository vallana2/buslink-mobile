// src/screens/passenger/SearchResultsScreen.jsx
import { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { searchSchedules } from "../../services/schedules.service";
import { COLORS, RADIUS, SHADOW, SPACING } from "../../constants/theme";

export default function SearchResultsScreen({ route, navigation }) {
  const { from, to } = route.params;
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const data = await searchSchedules(from, to);
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
      <View style={styles.routeHeaderBar}>
        <View style={styles.routeHeader}>
          <Text style={styles.routeText}>{from}</Text>
          <Text style={styles.routeArrow}>→</Text>
          <Text style={styles.routeText}>{to}</Text>
        </View>
        <Text style={styles.resultCount}>{schedules.length} buses found</Text>
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
            <View style={styles.cardTop}>
              <Text style={styles.agencyName}>{item.agency.name}</Text>
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
            <Text style={styles.emptyEmoji}>🚌</Text>
            <Text style={styles.emptyText}>No buses found for this route</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  routeHeaderBar: {
    backgroundColor: COLORS.secondary,
    paddingTop: 60,
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  routeHeader: { flexDirection: "row", alignItems: "center" },
  routeText: { fontSize: 20, fontWeight: "700", color: COLORS.white },
  routeArrow: { fontSize: 18, marginHorizontal: 10, color: COLORS.primary },
  resultCount: { fontSize: 13, color: COLORS.textOnDark, marginTop: 4 },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  agencyName: { fontSize: 16, fontWeight: "700", color: COLORS.text },
  seatsBadge: { backgroundColor: "#FFF0E5", paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.pill },
  seatsText: { fontSize: 11, color: COLORS.primaryDark, fontWeight: "700" },
  cardMiddle: { flexDirection: "row", alignItems: "center", marginTop: SPACING.sm },
  timeText: { fontSize: 18, fontWeight: "700", color: COLORS.text },
  dashedLine: { flex: 1, height: 1, borderStyle: "dashed", borderWidth: 1, borderColor: COLORS.border, marginHorizontal: 10 },
  busType: { fontSize: 12, color: COLORS.textMuted },
  cardBottom: { flexDirection: "row", justifyContent: "space-between", marginTop: SPACING.sm, paddingTop: SPACING.sm, borderTopWidth: 1, borderColor: COLORS.border },
  dateText: { fontSize: 13, color: COLORS.textMuted },
  priceText: { fontSize: 16, fontWeight: "800", color: COLORS.primaryDark },
  emptyState: { alignItems: "center", marginTop: 80 },
  emptyEmoji: { fontSize: 40, marginBottom: 8 },
  emptyText: { color: COLORS.textMuted },
});