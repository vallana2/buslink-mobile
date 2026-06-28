// src/screens/agency/ManageSchedulesScreen.jsx
import { useState, useEffect } from "react";
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert, Modal, TextInput
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import {
  getAgencySchedules, createSchedule, deleteSchedule,
  getAgencyRoutes, getAgencyBuses
} from "../../services/agency.service";
import { COLORS, RADIUS, SHADOW, SPACING } from "../../constants/theme";

export default function ManageSchedulesScreen({ navigation }) {
  const [schedules, setSchedules] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    routeId: "", busId: "",
    departureTime: "", arrivalTime: "", price: ""
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [s, r, b] = await Promise.all([
        getAgencySchedules(),
        getAgencyRoutes(),
        getAgencyBuses()
      ]);
      setSchedules(s);
      setRoutes(r);
      setBuses(b);
      if (r.length > 0) setForm(f => ({ ...f, routeId: r[0].id }));
      if (b.length > 0) setForm(f => ({ ...f, busId: b[0].id }));
    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!form.routeId || !form.busId || !form.departureTime || !form.price) {
      Alert.alert("Error", "Route, bus, departure time and price are required");
      return;
    }
    setSaving(true);
    try {
      await createSchedule({
        routeId: form.routeId,
        busId: form.busId,
        departureTime: new Date(form.departureTime).toISOString(),
        arrivalTime: form.arrivalTime ? new Date(form.arrivalTime).toISOString() : undefined,
        price: Number(form.price)
      });
      setModalVisible(false);
      setForm({ routeId: routes[0]?.id || "", busId: buses[0]?.id || "", departureTime: "", arrivalTime: "", price: "" });
      fetchData();
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Failed to create schedule");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id) => {
    Alert.alert("Delete Schedule", "Delete this schedule?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete", style: "destructive",
        onPress: async () => {
          try {
            await deleteSchedule(id);
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
        <Text style={styles.title}>Manage Schedules</Text>
        <Text style={styles.subtitle}>{schedules.length} schedule(s)</Text>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+ ADD NEW SCHEDULE</Text>
      </TouchableOpacity>

      <FlatList
        data={schedules}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: SPACING.lg, paddingTop: SPACING.sm }}
        renderItem={({ item }) => (
          <View style={[styles.card, SHADOW]}>
            <View style={styles.cardTop}>
              <Text style={styles.route}>
                {item.route?.fromStation?.city} → {item.route?.toStation?.city}
              </Text>
              <Text style={styles.price}>{item.price?.toLocaleString()} RWF</Text>
            </View>
            <Text style={styles.detail}>
              🚌 {item.bus?.plateNumber} · {item.bus?.busType}
            </Text>
            <Text style={styles.detail}>
              🕐 {new Date(item.departureTime).toLocaleString()}
            </Text>
            {item.arrivalTime ? (
              <Text style={styles.detail}>
                🏁 {new Date(item.arrivalTime).toLocaleString()}
              </Text>
            ) : null}
            <View style={styles.statusRow}>
              <View style={[styles.statusBadge,
                { backgroundColor: item.status === "ACTIVE" ? "#E8F8EE" : "#FFF0E5" }]}>
                <Text style={[styles.statusText,
                  { color: item.status === "ACTIVE" ? COLORS.success : COLORS.primaryDark }]}>
                  {item.status || "ACTIVE"}
                </Text>
              </View>
              <Text style={styles.seats}>💺 {item.availableSeats} seats</Text>
            </View>
            <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
              <Text style={styles.deleteBtnText}>🗑 Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📅</Text>
            <Text style={styles.emptyText}>No schedules yet. Add your first schedule!</Text>
          </View>
        }
      />

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Add New Schedule</Text>

            <Text style={styles.label}>ROUTE</Text>
            <View style={styles.pickerBox}>
              <Picker
                selectedValue={form.routeId}
                onValueChange={(v) => setForm({ ...form, routeId: v })}>
                {routes.map((r) => (
                  <Picker.Item
                    key={r.id}
                    label={`${r.fromStation?.city} → ${r.toStation?.city}`}
                    value={r.id}
                  />
                ))}
              </Picker>
            </View>

            <Text style={styles.label}>BUS</Text>
            <View style={styles.pickerBox}>
              <Picker
                selectedValue={form.busId}
                onValueChange={(v) => setForm({ ...form, busId: v })}>
                {buses.map((b) => (
                  <Picker.Item
                    key={b.id}
                    label={`${b.plateNumber} (${b.busType})`}
                    value={b.id}
                  />
                ))}
              </Picker>
            </View>

            <Text style={styles.label}>DEPARTURE TIME (e.g. 2026-06-20T08:00)</Text>
            <TextInput
              style={styles.input}
              placeholder="2026-06-20T08:00"
              value={form.departureTime}
              onChangeText={(v) => setForm({ ...form, departureTime: v })}
              placeholderTextColor={COLORS.textMuted}
            />

            <Text style={styles.label}>ARRIVAL TIME (optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="2026-06-20T12:00"
              value={form.arrivalTime}
              onChangeText={(v) => setForm({ ...form, arrivalTime: v })}
              placeholderTextColor={COLORS.textMuted}
            />

            <Text style={styles.label}>PRICE (RWF)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 3000"
              value={form.price}
              onChangeText={(v) => setForm({ ...form, price: v })}
              keyboardType="numeric"
              placeholderTextColor={COLORS.textMuted}
            />

            <TouchableOpacity style={styles.saveBtn} onPress={handleCreate} disabled={saving}>
              {saving
                ? <ActivityIndicator color={COLORS.white} />
                : <Text style={styles.saveBtnText}>SAVE SCHEDULE</Text>
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
    backgroundColor: "rgba(7, 51, 229, 0.74)", paddingTop: 60,
    paddingBottom: SPACING.lg, paddingHorizontal: SPACING.lg,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
  },
  backText: { color: COLORS.white, fontSize: 15, fontWeight: "600", marginBottom: SPACING.sm },
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
  route: { fontSize: 16, fontWeight: "700", color: COLORS.text, flex: 1 },
  price: { fontSize: 15, fontWeight: "800", color: COLORS.primaryDark },
  detail: { fontSize: 13, color: COLORS.textMuted, marginTop: SPACING.xs },
  statusRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: SPACING.sm },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.pill },
  statusText: { fontSize: 11, fontWeight: "800" },
  seats: { fontSize: 13, color: COLORS.textMuted },
  deleteBtn: { marginTop: SPACING.sm },
  deleteBtnText: { color: COLORS.danger, fontSize: 13, fontWeight: "600" },
  emptyState: { alignItems: "center", marginTop: 80 },
  emptyEmoji: { fontSize: 40, marginBottom: 8 },
  emptyText: { color: COLORS.textMuted, textAlign: "center" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modal: { backgroundColor: COLORS.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: SPACING.xl },
  modalTitle: { fontSize: 20, fontWeight: "900", color: COLORS.text, marginBottom: SPACING.lg },
  label: { fontSize: 12, fontWeight: "700", color: COLORS.textMuted, letterSpacing: 0.5, marginBottom: SPACING.xs, marginTop: SPACING.sm },
  pickerBox: { borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.input, backgroundColor: COLORS.surface, marginBottom: SPACING.sm },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.input, padding: 14, fontSize: 15, color: COLORS.text, backgroundColor: COLORS.surface, marginBottom: SPACING.sm },
  saveBtn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.button, paddingVertical: 16, alignItems: "center", marginTop: SPACING.md },
  saveBtnText: { color: COLORS.white, fontWeight: "800", fontSize: 14, letterSpacing: 0.5 },
  cancelBtn: { paddingVertical: 14, alignItems: "center" },
  cancelBtnText: { color: COLORS.textMuted, fontSize: 14 },
});