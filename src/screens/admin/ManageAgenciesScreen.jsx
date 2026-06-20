// src/screens/admin/ManageAgenciesScreen.jsx
import { useState, useEffect } from "react";
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert,
} from "react-native";
import { getAllAgencies, approveAgency } from "../../services/admin.service";
import { COLORS, RADIUS, SHADOW, SPACING } from "../../constants/theme";

export default function ManageAgenciesScreen({ navigation }) {
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState(null);

  useEffect(() => {
    fetchAgencies();
  }, []);

  const fetchAgencies = async () => {
    try {
      const data = await getAllAgencies();
      setAgencies(data);
    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id, name) => {
    Alert.alert("Approve Agency", `Approve "${name}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Approve",
        onPress: async () => {
          setApprovingId(id);
          try {
            await approveAgency(id);
            fetchAgencies();
          } catch (error) {
            Alert.alert("Error", error.response?.data?.message || "Failed to approve");
          } finally {
            setApprovingId(null);
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const pending = agencies.filter((a) => !a.isApproved);
  const approved = agencies.filter((a) => a.isApproved);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Manage Agencies</Text>
        <Text style={styles.subtitle}>
          {pending.length} pending · {approved.length} approved
        </Text>
      </View>

      <FlatList
        data={agencies}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: SPACING.lg, paddingTop: SPACING.md }}
        renderItem={({ item }) => (
          <View style={[styles.card, SHADOW]}>
            <View style={styles.cardTop}>
              <Text style={styles.agencyName}>{item.name}</Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: item.isApproved ? "#E8F8EE" : "#FFF0E5" },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    { color: item.isApproved ? COLORS.success : COLORS.primaryDark },
                  ]}
                >
                  {item.isApproved ? "APPROVED" : "PENDING"}
                </Text>
              </View>
            </View>
            <Text style={styles.detail}>📧 {item.email}</Text>
            <Text style={styles.detail}>📞 {item.phone}</Text>

            {!item.isApproved && (
              <TouchableOpacity
                style={styles.approveButton}
                onPress={() => handleApprove(item.id, item.name)}
                disabled={approvingId === item.id}
              >
                {approvingId === item.id ? (
                  <ActivityIndicator color={COLORS.white} size="small" />
                ) : (
                  <Text style={styles.approveText}>✓ APPROVE AGENCY</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🏢</Text>
            <Text style={styles.emptyText}>No agencies yet</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    backgroundColor: COLORS.secondary,
    paddingTop: 60,
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backText: { color: COLORS.primary, fontSize: 15, fontWeight: "600", marginBottom: SPACING.sm },
  title: { fontSize: 22, fontWeight: "900", color: COLORS.white },
  subtitle: { fontSize: 13, color: COLORS.textOnDark, marginTop: 4 },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  agencyName: { fontSize: 16, fontWeight: "700", color: COLORS.text, flex: 1 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.pill },
  statusText: { fontSize: 11, fontWeight: "800" },
  detail: { fontSize: 13, color: COLORS.textMuted, marginTop: SPACING.xs },
  approveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.button,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: SPACING.md,
  },
  approveText: { color: COLORS.white, fontWeight: "800", fontSize: 13, letterSpacing: 0.5 },
  emptyState: { alignItems: "center", marginTop: 80 },
  emptyEmoji: { fontSize: 40, marginBottom: 8 },
  emptyText: { color: COLORS.textMuted },
});