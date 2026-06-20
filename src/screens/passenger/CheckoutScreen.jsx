import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { createBooking } from "../../services/bookings.service";
import { payWithMobileMoney } from "../../services/payments.service";
import { COLORS, RADIUS, SHADOW, SPACING } from "../../constants/theme";

export default function CheckoutScreen({ route, navigation }) {
  const { schedule } = route.params;
  const [phone, setPhone] = useState("");
  const [provider, setProvider] = useState("MTN");
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    if (!phone) {
      Alert.alert("Error", "Please enter your phone number");
      return;
    }

    setLoading(true);
    try {
      const booking = await createBooking(schedule.id);

      const result = await payWithMobileMoney(
        booking.id,
        phone,
        schedule.price,
        provider
      );

      navigation.replace("Ticket", { bookingId: booking.id });
    } catch (error) {
      const message = error.response?.data?.message || "Payment failed";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: SPACING.lg, paddingTop: 50 }}>
      <Text style={styles.title}>Checkout</Text>

      <View style={[styles.summaryCard, SHADOW]}>
        <Text style={styles.routeText}>
          {schedule.route.fromStation.city} → {schedule.route.toStation.city}
        </Text>
        <Text style={styles.agencyText}>{schedule.agency.name}</Text>
        <Text style={styles.priceText}>{schedule.price.toLocaleString()} RWF</Text>
      </View>

      <Text style={styles.sectionLabel}>Payment Method</Text>
      <View style={styles.providerRow}>
        <TouchableOpacity
          style={[styles.providerButton, provider === "MTN" && styles.providerActive]}
          onPress={() => setProvider("MTN")}
        >
          <Text style={[styles.providerText, provider === "MTN" && styles.providerTextActive]}>
            MTN Mobile Money
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.providerButton, provider === "AIRTEL" && styles.providerActive]}
          onPress={() => setProvider("AIRTEL")}
        >
          <Text style={[styles.providerText, provider === "AIRTEL" && styles.providerTextActive]}>
            Airtel Money
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionLabel}>Phone Number</Text>
      <TextInput
        style={styles.input}
        placeholder="07XXXXXXXX"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <TouchableOpacity style={styles.payButton} onPress={handlePay} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.payButtonText}>
            Pay {schedule.price.toLocaleString()} RWF
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  title: { fontSize: 24, fontWeight: "800", marginBottom: SPACING.lg, color: COLORS.text },
  summaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  routeText: { fontSize: 18, fontWeight: "700", color: COLORS.text },
  agencyText: { fontSize: 14, color: COLORS.textMuted, marginTop: 4 },
  priceText: { fontSize: 22, fontWeight: "800", color: COLORS.primaryDark, marginTop: SPACING.sm },
  sectionLabel: { fontSize: 13, fontWeight: "700", color: COLORS.textMuted, marginBottom: SPACING.sm },
  providerRow: { flexDirection: "row", gap: SPACING.sm, marginBottom: SPACING.lg },
  providerButton: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.input,
    padding: SPACING.md,
    alignItems: "center",
  },
  providerActive: { borderColor: COLORS.primary, backgroundColor: "#E6FFFB" },
  providerText: { fontSize: 13, fontWeight: "600", color: COLORS.textMuted },
  providerTextActive: { color: COLORS.primaryDark },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.input,
    padding: 14,
    marginBottom: SPACING.xl,
    fontSize: 16,
    backgroundColor: COLORS.white,
  },
  payButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: RADIUS.pill,
    padding: 18,
    alignItems: "center",
  },
  payButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});