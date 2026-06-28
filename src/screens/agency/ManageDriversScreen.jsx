// src/screens/agency/ManageDriversScreen.jsx
import { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import api from "../../services/api";
import { RADIUS, SHADOW, SPACING } from "../../constants/theme";

export default function ManageDriversScreen({ navigation }) {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", fetchDrivers);
    return unsubscribe;
  }, [navigation]);

  const fetchDrivers = async () => {
    try {
      const res = await api.get("/drivers");
      setDrivers(res.data.drivers || []);
    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2E5BFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#0B1A3D", "#1E3A8A", "#2E5BFF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.title}>Manage Drivers</Text>
        <Text style={styles.subtitle}>{drivers.length} driver(s)</Text>
      </LinearGradient>

      <View style={{ paddingHorizontal: SPACING.lg, marginTop: SPACING.lg }}>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate("AddDriver")}
        >
          <Ionicons name="add-circle" size={18} color="#fff" />
          <Text style={styles.addBtnText}>Add New Driver</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={drivers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg, paddingBottom: SPACING.lg }}
        renderItem={({ item }) => (
          <View style={[styles.card, SHADOW]}>
            <View style={styles.avatarWrap}>
              <Ionicons name="person" size={22} color="#2E5BFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.driverName}>{item.user?.name}</Text>
              <View style={styles.detailRow}>
                <Ionicons name="call-outline" size={14} color="#888" />
                <Text style={styles.detail}>{item.user?.phone}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="mail-outline" size={14} color="#888" />
                <Text style={styles.detail}>{item.user?.email}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="card-outline" size={14} color="#888" />
                <Text style={styles.detail}>{item.licenseNumber}</Text>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={40} color="#CCC" />
            <Text style={styles.empty}>No drivers yet</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: SPACING.lg,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  title: { fontSize: 24, fontWeight: "900", color: "#fff" },
  subtitle: { fontSize: 13, color: "rgba(255,255,255,0.75)", marginTop: 4 },
  addBtn: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: "rgba(7, 51, 229, 0.74)",
    borderRadius: RADIUS.button,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  addBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: RADIUS.card,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    gap: SPACING.md,
  },
  avatarWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E8EEFF",
    alignItems: "center",
    justifyContent: "center",
  },
  driverName: { fontSize: 16, fontWeight: "700", color: "#1A1A1A", marginBottom: 4 },
  detailRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 },
  detail: { fontSize: 13, color: "#777" },
  emptyState: { alignItems: "center", marginTop: 60, gap: 8 },
  empty: { color: "#999", fontSize: 14 },
});