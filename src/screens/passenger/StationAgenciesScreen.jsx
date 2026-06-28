// src/screens/passenger/StationAgenciesScreen.jsx
import { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import api from "../../services/api";
import { COLORS, RADIUS, SHADOW, SPACING } from "../../constants/theme";

export default function StationAgenciesScreen({ route, navigation }) {
  const { station } = route.params;
  const insets = useSafeAreaInsets();
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgencies();
  }, []);

  const fetchAgencies = async () => {
    try {
      const res = await api.get(`/stations/${station.id}`);
      const list = (res.data.station.agencyStations || []).map((as) => as.agency);
      setAgencies(list);
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
          <Ionicons name="location" size={22} color="#fff" />
          <Text style={styles.headerTitle}>{station.name}</Text>
        </View>
        <Text style={styles.headerSubtitle}>{agencies.length} agencies operating here</Text>
      </View>

      <FlatList
        data={agencies}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: SPACING.lg, paddingTop: SPACING.md }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, SHADOW]}
            onPress={() => navigation.navigate("StationSchedules", { station, agency: item })}
          >
            <View style={styles.agencyIcon}>
              <Ionicons name="business" size={20} color={COLORS.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.agencyName}>{item.name}</Text>
              <Text style={styles.agencyHint}>Tap to see available buses</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="business-outline" size={40} color="#CCC" />
            <Text style={styles.emptyText}>No agencies operating from this station yet</Text>
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
    backgroundColor:"#2E5BFF",
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2E5BFF",
    borderRadius: RADIUS.card,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    gap: SPACING.md,
  },
  agencyIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center", alignItems: "center",
  },
  agencyName: { fontSize: 15, fontWeight: "700", color: COLORS.text },
  agencyHint: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  emptyState: { alignItems: "center", marginTop: 80, gap: 8 },
  emptyText: { color: COLORS.textMuted, textAlign: "center", paddingHorizontal: 40 },
});