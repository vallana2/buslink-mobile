// src/screens/agency/ManageBusesScreen.jsx
import { useState, useEffect } from "react";
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert, TextInput, Modal
} from "react-native";
import { getAgencyBuses, createBus, deleteBus } from "../../services/agency.service";
import { COLORS, RADIUS, SHADOW, SPACING } from "../../constants/theme";

export default function ManageBusesScreen({ navigation }) {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({ plateNumber: "", capacity: "", busType: "STANDARD" });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchBuses(); }, []);

  const fetchBuses = async () => {
    try {
      const data = await getAgencyBuses();
      setBuses(data);
    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!form.plateNumber || !form.capacity) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    setSaving(true);
    try {
      await createBus({ ...form, capacity: Number(form.capacity) });
      setModalVisible(false);
      setForm({ plateNumber: "", capacity: "", busType: "STANDARD" });
      fetchBuses();
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Failed to create bus");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id, plate) => {
    Alert.alert("Delete Bus", `Delete bus "${plate}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete", style: "destructive",
        onPress: async () => {
          try {
            await deleteBus(id);
            fetchBuses();
          } catch (error) {
            Alert.alert("Error", error.response?.data?.message || "Failed to delete");
          }
        }
      }
    ]);
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Manage Buses</Text>
        <Text style={styles.subtitle}>{buses.length} bus(es) in fleet</Text>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+ ADD NEW BUS</Text>
      </TouchableOpacity>

      <FlatList
        data={buses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: SPACING.lg, paddingTop: SPACING.sm }}
        renderItem={({ item }) => (
          <View style={[styles.card, SHADOW]}>
            <View style={styles.cardTop}>
              <Text style={styles.plate}>{item.plateNumber}</Text>
              <View style={styles.typeBadge}>
                <Text style={styles.typeText}>{item.busType || "STANDARD"}</Text>
              </View>
            </View>
            <Text style={styles.detail}>👥 Capacity: {item.capacity} seats</Text>
            <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id, item.plateNumber)}>
              <Text style={styles.deleteBtnText}>🗑 Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🚌</Text>
            <Text style={styles.emptyText}>No buses yet. Add your first bus!</Text>
          </View>
        }
      />

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Add New Bus</Text>
            <Text style={styles.label}>PLATE NUMBER</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. RAB 123 A"
              value={form.plateNumber}
              onChangeText={(v) => setForm({ ...form, plateNumber: v })}
              placeholderTextColor={COLORS.textMuted}
            />
            <Text style={styles.label}>CAPACITY (SEATS)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 45"
              value={form.capacity}
              onChangeText={(v) => setForm({ ...form, capacity: v })}
              keyboardType="numeric"
              placeholderTextColor={COLORS.textMuted}
            />
            <Text style={styles.label}>BUS TYPE</Text>
            <View style={styles.typeRow}>
              {["STANDARD", "EXPRESS", "VIP"].map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.typeBtn, form.busType === t && styles.typeBtnActive]}
                  onPress={() => setForm({ ...form, busType: t })}
                >
                  <Text style={[styles.typeBtnText, form.busType === t && styles.typeBtnTextActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.saveBtn} onPress={handleCreate} disabled={saving}>
              {saving ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.saveBtnText}>SAVE BUS</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    backgroundColor: COLORS.secondary, paddingTop: 60,
    paddingBottom: SPACING.lg, paddingHorizontal: SPACING.lg,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
  },
  backText: { color: COLORS.primary, fontSize: 15, fontWeight: "600", marginBottom: SPACING.sm },
  title: { fontSize: 22, fontWeight: "900", color: COLORS.white },
  subtitle: { fontSize: 13, color: COLORS.textOnDark, marginTop: 4 },
  addButton: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.button,
    paddingVertical: 14, alignItems: "center",
    marginHorizontal: SPACING.lg, marginTop: SPACING.lg,
  },
  addButtonText: { color: COLORS.white, fontWeight: "800", fontSize: 14, letterSpacing: 0.5 },
  card: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.card,
    padding: SPACING.md, marginBottom: SPACING.md,
  },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  plate: { fontSize: 16, fontWeight: "700", color: COLORS.text },
  typeBadge: { backgroundColor: "#FFF0E5", paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.pill },
  typeText: { fontSize: 11, fontWeight: "800", color: COLORS.primaryDark },
  detail: { fontSize: 13, color: COLORS.textMuted, marginTop: SPACING.xs },
  deleteBtn: { marginTop: SPACING.sm },
  deleteBtnText: { color: COLORS.danger, fontSize: 13, fontWeight: "600" },
  emptyState: { alignItems: "center", marginTop: 80 },
  emptyEmoji: { fontSize: 40, marginBottom: 8 },
  emptyText: { color: COLORS.textMuted },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modal: { backgroundColor: COLORS.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: SPACING.xl },
  modalTitle: { fontSize: 20, fontWeight: "900", color: COLORS.text, marginBottom: SPACING.lg },
  label: { fontSize: 12, fontWeight: "700", color: COLORS.textMuted, letterSpacing: 0.5, marginBottom: SPACING.xs, marginTop: SPACING.sm },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.input, padding: 14, fontSize: 16, color: COLORS.text, backgroundColor: COLORS.surface },
  typeRow: { flexDirection: "row", gap: SPACING.sm, marginBottom: SPACING.md },
  typeBtn: { flex: 1, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.input, padding: 10, alignItems: "center" },
  typeBtnActive: { borderColor: COLORS.primary, backgroundColor: "#FFF0E5" },
  typeBtnText: { fontSize: 12, fontWeight: "600", color: COLORS.textMuted },
  typeBtnTextActive: { color: COLORS.primary, fontWeight: "800" },
  saveBtn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.button, paddingVertical: 16, alignItems: "center", marginTop: SPACING.md },
  saveBtnText: { color: COLORS.white, fontWeight: "800", fontSize: 14, letterSpacing: 0.5 },
  cancelBtn: { paddingVertical: 14, alignItems: "center" },
  cancelBtnText: { color: COLORS.textMuted, fontSize: 14 },
});