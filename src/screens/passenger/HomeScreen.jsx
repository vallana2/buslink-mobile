// src/screens/passenger/HomeScreen.jsx
import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useAuth } from "../../context/AuthContext";
import { getStations } from "../../services/stations.service";
import { COLORS, RADIUS, SHADOW, SPACING } from "../../constants/theme";

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const [stations, setStations] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      const data = await getStations();
      setStations(data);
      const cities = [...new Set(data.map((s) => s.city))];
      if (cities.length > 0) setFrom(cities[0]);
      if (cities.length > 1) setTo(cities[1]);
    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const swapCities = () => {
    setFrom(to);
    setTo(from);
  };

  const handleSearch = () => {
    if (!from || !to) {
      Alert.alert("Error", "Please select both From and To cities");
      return;
    }
    if (from === to) {
      Alert.alert("Error", "From and To cannot be the same");
      return;
    }
    navigation.navigate("SearchResults", { from, to });
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: COLORS.secondary }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const cities = [...new Set(stations.map((s) => s.city))];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Navy Hero Banner */}
      <View style={styles.heroBanner}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>⚡ AI-POWERED TRANSPORT</Text>
        </View>
        <Text style={styles.heroTitle}>
          Hi, {user?.name?.split(" ")[0]}!{"\n"}
          <Text style={styles.heroTitleAccent}>Where to?</Text>
        </Text>
        <Text style={styles.heroSubtitle}>
          Search routes, book tickets, and board with a QR code — no station visit needed.
        </Text>
      </View>

      {/* Floating Search Card */}
      <View style={[styles.searchCard, SHADOW]}>
        <Text style={styles.cardLabel}>FIND A ROUTE</Text>

        <View style={styles.routeRow}>
          <View style={styles.routeField}>
            <Text style={styles.routeLabel}>From</Text>
            <Picker selectedValue={from} onValueChange={setFrom} style={styles.picker}>
              {cities.map((city) => (
                <Picker.Item key={city} label={city} value={city} />
              ))}
            </Picker>
          </View>

          <TouchableOpacity style={styles.swapButton} onPress={swapCities}>
            <Text style={styles.swapIcon}>⇄</Text>
          </TouchableOpacity>

          <View style={styles.routeField}>
            <Text style={styles.routeLabel}>To</Text>
            <Picker selectedValue={to} onValueChange={setTo} style={styles.picker}>
              {cities.map((city) => (
                <Picker.Item key={city} label={city} value={city} />
              ))}
            </Picker>
          </View>
        </View>

        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>🔍  SEARCH AVAILABLE BUSES</Text>
        </TouchableOpacity>
      </View>

      {/* Stats strip (orange, like website) */}
      <View style={styles.statsStrip}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>200+</Text>
          <Text style={styles.statLabel}>Routes</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>98%</Text>
          <Text style={styles.statLabel}>On-time</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>3min</Text>
          <Text style={styles.statLabel}>Avg Booking</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Popular Routes</Text>
      <View style={styles.quickRoutes}>
        {cities.slice(0, 4).map((city) => (
          <TouchableOpacity
            key={city}
            style={[styles.routeChip, SHADOW]}
            onPress={() => setTo(city)}
          >
            <Text style={styles.routeChipText}>📍 {city}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  heroBanner: {
    backgroundColor: COLORS.secondary,
    paddingTop: 70,
    paddingBottom: 56,
    paddingHorizontal: SPACING.lg,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.secondaryLight,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.pill,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: SPACING.md,
  },
  badgeText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: COLORS.white,
    lineHeight: 34,
  },
  heroTitleAccent: { color: COLORS.primary },
  heroSubtitle: {
    fontSize: 14,
    color: COLORS.textOnDark,
    marginTop: SPACING.sm,
    lineHeight: 20,
  },

  searchCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    marginHorizontal: SPACING.lg,
    marginTop: -32,
    padding: SPACING.lg,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.textMuted,
    letterSpacing: 1,
    marginBottom: SPACING.sm,
  },
  routeRow: { flexDirection: "row", alignItems: "center" },
  routeField: { flex: 1 },
  routeLabel: { fontSize: 12, color: COLORS.textMuted, fontWeight: "600", marginBottom: 2 },
  picker: { marginLeft: -8 },
  swapButton: {
    backgroundColor: COLORS.surface,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
  },
  swapIcon: { fontSize: 16, color: COLORS.primary },
  searchButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.button,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: SPACING.md,
  },
  searchButtonText: {
    color: COLORS.white,
    fontWeight: "800",
    fontSize: 14,
    letterSpacing: 0.5,
  },

  statsStrip: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    borderRadius: RADIUS.card,
    paddingVertical: SPACING.lg,
  },
  statItem: { flex: 1, alignItems: "center" },
  statDivider: { width: 1, backgroundColor: "rgba(255,255,255,0.3)" },
  statNumber: { color: COLORS.white, fontSize: 20, fontWeight: "900" },
  statLabel: { color: "#FFE3CC", fontSize: 11, marginTop: 2, fontWeight: "600" },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: SPACING.xl,
    marginHorizontal: SPACING.lg,
    color: COLORS.text,
  },
  quickRoutes: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    gap: SPACING.sm,
  },
  routeChip: {
    backgroundColor: COLORS.white,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: RADIUS.pill,
  },
  routeChipText: { fontSize: 13, fontWeight: "600", color: COLORS.text },
});