import { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import QRCode from "react-native-qrcode-svg";
import api from "../../services/api";
import { COLORS, RADIUS, SHADOW, SPACING } from "../../constants/theme";

export default function TicketScreen({ route }) {
  const { bookingId } = route.params;
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTicket();
  }, []);

  const fetchTicket = async () => {
    try {
      const res = await api.get(`/tickets/${bookingId}`);
      setTicket(res.data.ticket);
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

  if (!ticket) {
    return (
      <View style={styles.center}>
        <Text>Ticket not found</Text>
      </View>
    );
  }

  const trip = ticket.booking.schedule;
  const passenger = ticket.booking.passenger;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: SPACING.lg, paddingTop: 50 }}>
      <View style={styles.successBanner}>
        <Text style={styles.successText}>✅ Booking Confirmed</Text>
      </View>

      <View style={[styles.card, SHADOW]}>
        <View style={styles.headerBar}>
          <Text style={styles.headerText}>🚌 BusLink Ticket</Text>
          <Text style={styles.headerStatus}>
            {ticket.isValidated ? "USED" : "VALID"}
          </Text>
        </View>

        <View style={styles.routeRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.routeLabel}>FROM</Text>
            <Text style={styles.cityText}>{trip.route.fromStation.city}</Text>
            <Text style={styles.stationText}>{trip.route.fromStation.name}</Text>
          </View>
          <Text style={styles.arrow}>→</Text>
          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <Text style={styles.routeLabel}>TO</Text>
            <Text style={styles.cityText}>{trip.route.toStation.city}</Text>
            <Text style={styles.stationText}>{trip.route.toStation.name}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailGrid}>
          <DetailItem label="Agency" value={trip.route.agency.name} />
          <DetailItem label="Bus" value={trip.bus.plateNumber} />
          <DetailItem
            label="Date"
            value={new Date(trip.departureTime).toLocaleDateString()}
          />
          <DetailItem
            label="Time"
            value={new Date(trip.departureTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          />
          <DetailItem label="Passenger" value={passenger.name} />
          <DetailItem label="Phone" value={passenger.phone} />
        </View>

        <View style={styles.divider} />

        <View style={styles.qrSection}>
          <QRCode value={ticket.qrCode} size={170} />
          <Text style={styles.qrCodeText}>{ticket.qrCode}</Text>
          <Text style={styles.qrHint}>Show this QR code to the driver to board</Text>
        </View>
      </View>
    </ScrollView>
  );
}

function DetailItem({ label, value }) {
  return (
    <View style={styles.detailItem}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  successBanner: {
    backgroundColor: "#E6FFFB",
    borderRadius: RADIUS.input,
    padding: SPACING.md,
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  successText: { color: COLORS.primaryDark, fontWeight: "700" },
  card: { backgroundColor: COLORS.white, borderRadius: RADIUS.card, overflow: "hidden" },
  headerBar: {
    backgroundColor: COLORS.text,
    padding: SPACING.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  headerStatus: { color: COLORS.secondary, fontWeight: "700", fontSize: 12 },
  routeRow: { flexDirection: "row", alignItems: "flex-start", padding: SPACING.lg },
  routeLabel: { fontSize: 10, color: COLORS.textMuted, fontWeight: "700" },
  cityText: { fontSize: 20, fontWeight: "800", color: COLORS.text, marginTop: 2 },
  stationText: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  arrow: { fontSize: 20, color: COLORS.primary, marginHorizontal: 12, marginTop: 14 },
  divider: { height: 1, backgroundColor: COLORS.border, marginHorizontal: SPACING.lg },
  detailGrid: { flexDirection: "row", flexWrap: "wrap", padding: SPACING.lg },
  detailItem: { width: "50%", marginBottom: SPACING.md },
  detailLabel: { fontSize: 11, color: COLORS.textMuted },
  detailValue: { fontSize: 14, fontWeight: "700", color: COLORS.text, marginTop: 2 },
  qrSection: { alignItems: "center", padding: SPACING.xl },
  qrCodeText: { fontSize: 10, color: COLORS.textMuted, marginTop: SPACING.md },
  qrHint: { fontSize: 12, color: COLORS.textMuted, marginTop: 4, textAlign: "center" },
});