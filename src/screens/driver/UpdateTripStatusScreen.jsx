// src/screens/driver/UpdateTripStatusScreen.jsx
import { useState } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert
} from "react-native";
import api from "../../services/api";
import { COLORS, RADIUS, SHADOW, SPACING } from "../../constants/theme";

const STATUSES = [
  { value: "BOARDING", label: "🚏 Boarding", desc: "Passengers are boarding the bus" },
  { value: "DEPARTED", label: "🚌 Departed", desc: "Bus has left the station" },
  { value: "ARRIVED", label: "✅ Arrived", desc: "Bus has reached the destination" },
  { value: "CANCELLED", label: "❌ Cancelled", desc: "Trip has been cancelled" },
];

export default function UpdateTripStatusScreen({ route, navigation }) {
  const { scheduleId, currentStatus } = route.params;
  const [selected, setSelected] = useState(currentStatus || "BOARDING");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await api.patch(`/drivers/trips/${scheduleId}/status`, { status: selected });
      Alert.alert("✅ Updated", `Trip status updated to ${selected}`, [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Update Trip Status</Text>
        <Text style={styles.subtitle}>Select the current status of your trip</Text>
      </View>

      <View style={styles.content}>
        {STATUSES.map((s) => (
          <TouchableOpacity
            key={s.value}
            style={[styles.statusCard, SHADOW, selected === s.value && styles.statusCardActive]}
            onPress={() => setSelected(s.value)}
          >
            <Text style={styles.statusLabel}>{s.label}</Text>
            <Text style={styles.statusDesc}>{s.desc}</Text>
            {selected === s.value && (
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[styles.updateBtn, loading && { opacity: 0.7 }]}
          onPress={handleUpdate}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color={COLORS.white} />
            : <Text style={styles.updateBtnText}>UPDATE STATUS</Text>
          }
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  header: {
    backgroundColor: COLORS.secondary, paddingTop: 60,
    paddingBottom: SPACING.lg, paddingHorizontal: SPACING.lg,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
  },
  backText: { color: COLORS.primary, fontSize: 15, fontWeight: "600", marginBottom: SPACING.sm },
  title: { fontSize: 22, fontWeight: "900", color: COLORS.white },
  subtitle: { fontSize: 13, color: COLORS.textOnDark, marginTop: 4 },
  content: { padding: SPACING.lg },
  statusCard: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.card,
    padding: SPACING.md, marginBottom: SPACING.md,
    borderWidth: 2, borderColor: "transparent",
    position: "relative",
  },
  statusCardActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight },
  statusLabel: { fontSize: 16, fontWeight: "700", color: COLORS.text },
  statusDesc: { fontSize: 13, color: COLORS.textMuted, marginTop: 4 },
  checkmark: {
    position: "absolute", top: SPACING.md, right: SPACING.md,
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: "center", alignItems: "center",
  },
  checkmarkText: { color: COLORS.white, fontWeight: "800", fontSize: 14 },
  updateBtn: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.button,
    paddingVertical: 16, alignItems: "center", marginTop: SPACING.md,
  },
  updateBtnText: { color: COLORS.white, fontWeight: "800", fontSize: 14, letterSpacing: 0.5 },
});