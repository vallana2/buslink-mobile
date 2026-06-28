// src/screens/passenger/HomeScreen.jsx
import { useState, useEffect } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet,
  ActivityIndicator, ScrollView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { getStations } from "../../services/stations.service";
import { COLORS, RADIUS, SHADOW, SPACING } from "../../constants/theme";

const FEATURES = [
  { icon: "shield-checkmark", title: "Safe & Secure", subtitle: "Your safety is our priority" },
  { icon: "checkmark-circle", title: "Best Price", subtitle: "Get the best deals always" },
  { icon: "headset", title: "24/7 Support", subtitle: "We're here to help you" },
  { icon: "ticket", title: "Easy Booking", subtitle: "Quick and hassle-free" },
];

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStations(); }, []);

  const fetchStations = async () => {
    try {
      const data = await getStations();
      setStations(data);
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
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: "#0B1A3D" }} />
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* Hero Section */}
        <View style={styles.hero}>
          <LinearGradient
            colors={["#0B1A3D", "#1E3A8A", "#2E5BFF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroBg}
          />

          {/* Illustrated bus shape */}
          <View style={styles.busIllustration} pointerEvents="none">
            <View style={styles.busBody}>
              <View style={styles.busWindowsRow}>
                <View style={styles.busWindow} />
                <View style={styles.busWindow} />
                <View style={styles.busWindow} />
                <View style={styles.busWindow} />
              </View>
            </View>
            <View style={styles.busWheelLeft} />
            <View style={styles.busWheelRight} />
          </View>

          <View style={styles.heroContent}>
            <View style={styles.heroBadge}>
              <View style={styles.heroBadgeDot} />
              <Text style={styles.heroBadgeText}>Online booking available 24/7</Text>
            </View>
            <Text style={styles.heroTitle}>Book Bus Tickets</Text>
            <Text style={styles.heroAccent}>Anytime, Anywhere</Text>
            <Text style={styles.heroSubtitle}>
              Tap a station below to see available buses and book your trip.
            </Text>
          </View>
        </View>

        {/* Features Strip */}
        <View style={styles.featuresStrip}>
          {FEATURES.map((f) => (
            <View key={f.title} style={styles.featureItem}>
              <Ionicons name={f.icon} size={24} color={COLORS.primary} style={{ marginBottom: SPACING.xs }} />
              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureSubtitle}>{f.subtitle}</Text>
            </View>
          ))}
        </View>

        {/* Bus Stations */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Bus Stations</Text>
            <Text style={styles.sectionHint}>Tap a station to see buses</Text>
          </View>
          {stations.map((station) => (
            <TouchableOpacity
              key={station.id}
              style={[styles.stationRow, SHADOW]}
              onPress={() => navigation.navigate("StationAgencies", { station })}
            >
              <View style={styles.stationIcon}>
                <Ionicons name="location" size={18} color={COLORS.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.stationName}>{station.name}</Text>
                <Text style={styles.stationCity}>{station.city}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          ))}
          {stations.length === 0 ? (
            <Text style={styles.emptyText}>No stations available yet</Text>
          ) : null}
        </View>

        {/* About */}
        <View style={styles.aboutSection}>
          <Text style={styles.aboutTitle}>About BusLink</Text>
          <Text style={styles.aboutText}>
            BusLink is your trusted travel partner for bus ticket bookings across Rwanda.
            We offer a wide range of bus services, easy booking experience, and dedicated
            customer support to make your journey smooth and hassle-free.
          </Text>
          <View style={styles.statsRow}>
            {[
              { value: "200+", label: "Routes" },
              { value: "50+", label: "Bus Operators" },
              { value: "10K+", label: "Happy Customers" },
              { value: "24/7", label: "Support" },
            ].map((s) => (
              <View key={s.label} style={styles.statItem}>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>

      {/* Floating AI Chat Button */}
      <TouchableOpacity
        style={styles.fabButton}
        onPress={() => navigation.navigate("Chat")}
      >
        <Ionicons name="chatbubble-ellipses" size={26} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  // Hero
  hero: { height: 240, position: "relative", overflow: "hidden" },
  heroBg: { position: "absolute", width: "100%", height: "100%" },
  heroContent: { padding: SPACING.lg, paddingTop: 24, position: "relative" },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: SPACING.md,
  },
  heroBadgeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#4ADE80", marginRight: 8 },
  heroBadgeText: { color: "#E5E9F5", fontSize: 11, fontWeight: "500" },
  heroTitle: { fontSize: 28, fontWeight: "800", color: COLORS.white },
  heroAccent: { fontSize: 28, fontWeight: "900", color: "#8AB4FF", marginBottom: SPACING.sm },
  heroSubtitle: { fontSize: 14, color: "rgba(255,255,255,0.85)", lineHeight: 20, maxWidth: "80%" },

  // Bus illustration
  busIllustration: {
    position: "absolute",
    right: -20,
    bottom: 20,
    width: 200,
    height: 110,
  },
  busBody: {
    width: 200,
    height: 60,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  busWindowsRow: { flexDirection: "row", gap: 8 },
  busWindow: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: "rgba(70,100,200,0.55)",
  },
  busWheelLeft: {
    position: "absolute",
    left: 24,
    bottom: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(20,30,70,0.4)",
  },
  busWheelRight: {
    position: "absolute",
    right: 24,
    bottom: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(20,30,70,0.4)",
  },

  // Features
  featuresStrip: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    gap: SPACING.sm,
  },
  featureItem: {
    width: "47%",
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  featureTitle: { fontSize: 13, fontWeight: "700", color: COLORS.text },
  featureSubtitle: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },

  // Stations
  section: { marginHorizontal: SPACING.lg, marginTop: SPACING.xl },
  sectionHeader: { marginBottom: SPACING.md },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: COLORS.text },
  sectionHint: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  stationRow: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: COLORS.white, borderRadius: RADIUS.card,
    padding: SPACING.md, marginBottom: SPACING.sm,
    gap: SPACING.md,
  },
  stationIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center", alignItems: "center",
  },
  stationName: { fontSize: 14, fontWeight: "600", color: COLORS.text },
  stationCity: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  emptyText: { textAlign: "center", color: COLORS.textMuted, marginTop: 20 },

  // About
  aboutSection: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.xl,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  aboutTitle: { fontSize: 18, fontWeight: "700", color: COLORS.text, marginBottom: SPACING.sm },
  aboutText: { fontSize: 14, color: COLORS.textMuted, lineHeight: 22, marginBottom: SPACING.lg },
  statsRow: { flexDirection: "row", justifyContent: "space-between" },
  statItem: { alignItems: "center" },
  statValue: { fontSize: 18, fontWeight: "900", color: COLORS.primary },
  statLabel: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },

  // Floating chat button
  fabButton: {
    position: "absolute",
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2E5BFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
});