// src/screens/agency/ManageRoutesScreen.jsx
import { useState, useEffect } from "react";
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert, Modal
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { getAgencyRoutes, createRoute, deleteRoute } from "../../services/agency.service";
import { getStations } from "../../services/stations.service";
import { COLORS, RADIUS, SHADOW, SPACING } from "../../constants/theme";

export default function ManageRoutesScreen({ navigation }) {
  const [routes, setRoutes] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({ fromStationId: "", toStationId: "", distanceKm: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [r, s] = await Promise.all([getAgencyRoutes(), getStations()]);
      setRoutes(r);
      setStations(s);
      if (s.length > 0) setForm(f => ({ ...f, fromStationId: s[0].id, toStationId: s[1]?.id || s[0].id }));
    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!form.fromStationId || !form.toStationId) {
      Alert.alert("Error", "Please select both stations"); return;
    }
    if (form.fromStationId === form.toStationId) {
      Alert.alert("Error", "From and To stations cannot be the same"); return;
    }
    setSaving(true);
    try {
      await createRoute({
        fromStationId: form.fromStationId,
        toStationId: form.toStationId,
        distanceKm: form.distanceKm ? Number(form.distanceKm) : undefined
      });
      setModalVisible(false);
      fetchData();
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Failed to create route");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id, label) => {
    Alert.alert("Delete Route", `Delete "${label}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete", style: "destructive",
        onPress: async () => {
          try {
            await deleteRoute(id);
            fetchData();
          } catch (error) {
            Alert.alert("Error", error.response?.data?.message || "Failed to delete");
          }
        }
      }
    ]);
  };

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Manage Routes</Text>
        <Text style={styles.subtitle}>{routes.length} route(s)</Text>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+ ADD NEW ROUTE</Text>
      </TouchableOpacity>

      <FlatList
        data={routes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: SPACING.lg, paddingTop: SPACING.sm }}
        renderItem={({ item }) => (
          <View style={[styles.card, SHADOW]}>
            <View style={styles.routeRow}>
              <View style={styles.stationBox}>
                <Text style={styles.stationLabel}>FROM</Text>
                <Text style={styles.stationName}>{item.fromStation?.city}</Text>
                <Text style={styles.stationDetail}>{item.fromStation?.name}</Text>
              </View>
              <Text style={styles.arrow}>→</Text>
              <View style={styles.stationBox}>
                <Text style={styles.stationLabel}>TO</Text>
                <Text style={styles.stationName}>{item.toStation?.city}</Text>
                <Text style={styles.stationDetail}>{item.toStation?.name}</Text>
              </View>
            </View>
            {item.distanceKm ? (
              <Text style={styles.distance}>📏 {item.distanceKm} km</Text>
            ) : null}
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => handleDelete(item.id, `${item.fromStation?.city} → ${item.toStation?.city}`)}>
              <Text style={styles.deleteBtnText}>🗑 Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🗺️</Text>
            <Text style={styles.emptyText}>No routes yet. Add your first route!</Text>
          </View>
        }
      />

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Add New Route</Text>

            <Text style={styles.label}>FROM STATION</Text>
            <View style={styles.pickerBox}>
              <Picker
                selectedValue={form.fromStationId}
                onValueChange={(v) => setForm({ ...form, fromStationId: v })}
              >
                {stations.map((s) => (
                  <Picker.Item key={s.id} label={`${s.city} — ${s.name}`} value={s.id} />
                ))}
              </Picker>
            </View>

            <Text style={styles.label}>TO STATION</Text>
            <View style={styles.pickerBox}>
              <Picker
                selectedValue={form.toStationId}
                onValueChange={(v) => setForm({ ...form, toStationId: v })}
              >
                {stations.map((s) => (
                  <Picker.Item key={s.id} label={`${s.city} — ${s.name}`} value={s.id} />
                ))}
              </Picker>
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={handleCreate} disabled={saving}>
              {saving
                ? <ActivityIndicator color={COLORS.white} />
                : <Text style={styles.saveBtnText}>SAVE ROUTE</Text>
              }
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
  routeRow: { flexDirection: "row", alignItems: "center" },
  stationBox: { flex: 1 },
  stationLabel: { fontSize: 10, fontWeight: "800", color: COLORS.textMuted, letterSpacing: 0.5 },
  stationName: { fontSize: 16, fontWeight: "700", color: COLORS.text },
  stationDetail: { fontSize: 11, color: COLORS.textMuted },
  arrow: { fontSize: 20, color: COLORS.primary, marginHorizontal: SPACING.sm },
  distance: { fontSize: 13, color: COLORS.textMuted, marginTop: SPACING.sm },
  deleteBtn: { marginTop: SPACING.sm },
  deleteBtnText: { color: COLORS.danger, fontSize: 13, fontWeight: "600" },
  emptyState: { alignItems: "center", marginTop: 80 },
  emptyEmoji: { fontSize: 40, marginBottom: 8 },
  emptyText: { color: COLORS.textMuted },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modal: { backgroundColor: COLORS.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: SPACING.xl },
  modalTitle: { fontSize: 20, fontWeight: "900", color: COLORS.text, marginBottom: SPACING.lg },
  label: { fontSize: 12, fontWeight: "700", color: COLORS.textMuted, letterSpacing: 0.5, marginBottom: SPACING.xs, marginTop: SPACING.sm },
  pickerBox: { borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.input, backgroundColor: COLORS.surface, marginBottom: SPACING.sm },
  saveBtn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.button, paddingVertical: 16, alignItems: "center", marginTop: SPACING.md },
  saveBtnText: { color: COLORS.white, fontWeight: "800", fontSize: 14, letterSpacing: 0.5 },
  cancelBtn: { paddingVertical: 14, alignItems: "center" },
  cancelBtnText: { color: COLORS.textMuted, fontSize: 14 },
});