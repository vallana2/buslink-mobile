// src/screens/passenger/ScheduleDetailScreen.jsx
import { useState, useEffect } from "react";
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, ActivityIndicator
} from "react-native";
import api from "../../services/api";
import { COLORS, RADIUS, SHADOW, SPACING } from "../../constants/theme";

export default function ScheduleDetailScreen({ route, navigation }) {
  const { scheduleId } = route.params;
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchSchedule(); }, []);

  const fetchSchedule = async () => {
    try {
      const res = await api.get(`/schedules/${scheduleId}`);
      setSchedule(res.data.schedule);
    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = () => {
    // Build the shape CheckoutScreen expects (route.fromStation/toStation/agency, price, id)
    const scheduleForCheckout = {
      id: schedule.id,
      price: schedule.price,
      route: {
        fromStation: schedule.route?.fromStation,
        toStation: schedule.route?.toStation,
      },
      agency: schedule.route?.agency,
    };
    navigation.navigate("Checkout", { schedule: scheduleForCheckout });
  };

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );

  if (!schedule) return (
    <View style={styles.center}>
      <Text style={styles.errorText}>Schedule not found</Text>
    </View>
  );

  const departure = new Date(schedule.departureTime);
  const arrival = schedule.arrivalTime ? new Date(schedule.arrivalTime) : null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Trip Details</Text>
      </View>

      {/* Route Card */}
      <View style={[styles.routeCard, SHADOW]}>
        <View style={styles.routeRow}>
          <View style={styles.stationBox}>
            <Text style={styles.stationLabel}>FROM</Text>
            <Text style={styles.stationCity}>
              {schedule.route?.fromStation?.city}
            </Text>
            <Text style={styles.stationName}>
              {schedule.route?.fromStation?.name}
            </Text>
          </View>
          <View style={styles.routeMiddle}>
            <Text style={styles.routeArrow}>→</Text>
            {schedule.route?.distanceKm ? (
              <Text style={styles.distance}>{schedule.route.distanceKm} km</Text>
            ) : null}
          </View>
          <View style={[styles.stationBox, { alignItems: "flex-end" }]}>
            <Text style={styles.stationLabel}>TO</Text>
            <Text style={styles.stationCity}>
              {schedule.route?.toStation?.city}
            </Text>
            <Text style={styles.stationName}>
              {schedule.route?.toStation?.name}
            </Text>
          </View>
        </View>
      </View>

      {/* Time Card */}
      <View style={[styles.card, SHADOW]}>
        <Text style={styles.cardTitle}>🕐 Schedule</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Departure</Text>
          <Text style={styles.infoValue}>
            {departure.toLocaleDateString()} at {departure.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </Text>
        </View>
        {arrival ? (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Arrival</Text>
            <Text style={styles.infoValue}>
              {arrival.toLocaleDateString()} at {arrival.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </Text>
          </View>
        ) : null}
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Status</Text>
          <View style={[styles.statusBadge,
            { backgroundColor: schedule.status === "ACTIVE" ? "#E8F8EE" : "#FFF0E5" }]}>
            <Text style={[styles.statusText,
              { color: schedule.status === "ACTIVE" ? COLORS.success : COLORS.primaryDark }]}>
              {schedule.status || "ACTIVE"}
            </Text>
          </View>
        </View>
      </View>

      {/* Bus Card */}
      <View style={[styles.card, SHADOW]}>
        <Text style={styles.cardTitle}>🚌 Bus Details</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Agency</Text>
          <Text style={styles.infoValue}>{schedule.route?.agency?.name}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Plate Number</Text>
          <Text style={styles.infoValue}>{schedule.bus?.plateNumber}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Bus Type</Text>
          <Text style={styles.infoValue}>{schedule.bus?.busType || "STANDARD"}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Available Seats</Text>
          <Text style={[styles.infoValue, { color: COLORS.success, fontWeight: "800" }]}>
            {schedule.availableSeats} seats
          </Text>
        </View>
      </View>

      {/* Price Card */}
      <View style={[styles.priceCard, SHADOW]}>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Ticket Price</Text>
          <Text style={styles.priceValue}>{schedule.price?.toLocaleString()} RWF</Text>
        </View>
      </View>

      {/* Book Button -> goes to Checkout (payment), not direct booking */}
      {schedule.availableSeats > 0 ? (
        <TouchableOpacity style={styles.bookButton} onPress={handleBook}>
          <Text style={styles.bookButtonText}>🎫 BOOK THIS TRIP</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.fullButton}>
          <Text style={styles.fullButtonText}>❌ This bus is fully booked</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: COLORS.textMuted, fontSize: 16 },
  header: {
    backgroundColor: "rgba(29, 71, 240, 0.74)",
    paddingTop: 60, paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
  },
  backText: { color: COLORS.primary, fontSize: 15, fontWeight: "600", marginBottom: SPACING.sm },
  title: { fontSize: 22, fontWeight: "900", color: COLORS.white },
  routeCard: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.card,
    margin: SPACING.lg, marginTop: SPACING.md, padding: SPACING.lg,
  },
  routeRow: { flexDirection: "row", alignItems: "center" },
  stationBox: { flex: 1 },
  stationLabel: { fontSize: 10, fontWeight: "800", color: COLORS.textMuted, letterSpacing: 0.5 },
  stationCity: { fontSize: 18, fontWeight: "900", color: COLORS.text, marginTop: 2 },
  stationName: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  routeMiddle: { alignItems: "center", paddingHorizontal: SPACING.sm },
  routeArrow: { fontSize: 24, color: COLORS.primary },
  distance: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  card: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.card,
    marginHorizontal: SPACING.lg, marginBottom: SPACING.md, padding: SPACING.md,
  },
  cardTitle: { fontSize: 15, fontWeight: "700", color: COLORS.text, marginBottom: SPACING.sm },
  infoRow: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  infoLabel: { fontSize: 14, color: COLORS.textMuted },
  infoValue: { fontSize: 14, fontWeight: "600", color: COLORS.text },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.pill },
  statusText: { fontSize: 11, fontWeight: "800" },
  priceCard: {
    backgroundColor: COLORS.secondary, borderRadius: RADIUS.card,
    marginHorizontal: SPACING.lg, marginBottom: SPACING.md, padding: SPACING.lg,
  },
  priceRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  priceLabel: { fontSize: 15, color: COLORS.white, fontWeight: "600" },
  priceValue: { fontSize: 24, fontWeight: "900", color: COLORS.primary },
  bookButton: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.button,
    paddingVertical: 18, alignItems: "center",
    marginHorizontal: SPACING.lg, marginTop: SPACING.sm,
  },
  bookButtonText: { color: COLORS.white, fontWeight: "800", fontSize: 16, letterSpacing: 0.5 },
  fullButton: {
    backgroundColor: "#f0f0f0", borderRadius: RADIUS.button,
    paddingVertical: 18, alignItems: "center",
    marginHorizontal: SPACING.lg, marginTop: SPACING.sm,
  },
  fullButtonText: { color: COLORS.textMuted, fontWeight: "700", fontSize: 15 },
});