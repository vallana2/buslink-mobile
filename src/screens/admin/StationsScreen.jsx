import { useState, useEffect } from "react";
import {
  View, Text, FlatList, TouchableOpacity, TextInput,
  StyleSheet, Alert, ActivityIndicator, Modal,
} from "react-native";
import { getStations, createStation } from "../../services/admin.service";
import { COLORS, RADIUS, SHADOW, SPACING } from "../../constants/theme";

export default function StationsScreen() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [saving, setSaving] = useState(false);

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

  const handleCreate = async () => {
    if (!name || !city) {
      Alert.alert("Error", "Name and city are required");
      return;
    }
    setSaving(true);
    try {
      await createStation(name, city, address);
      setModalVisible(false);
      setName(""); setCity(""); setAddress("");
      fetchStations();
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Failed to create station");
    } finally {
      setSaving(false);
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
      <View style={styles.headerRow}>
        <Text style={styles.title}>Stations</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={stations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: SPACING.lg, paddingTop: 0 }}
        renderItem={({ item }) => (
          <View style={[styles.card, SHADOW]}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardSubtitle}>{item.city}</Text>
            {item.address ? <Text style={styles.cardAddress}>{item.address}</Text> : null}
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No stations yet</Text>}
      />

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Add Station</Text>
            <TextInput style={styles.input} placeholder="Station name" value={name} onChangeText={setName} />
            <TextInput style={styles.input} placeholder="City" value={city} onChangeText={setCity} />
            <TextInput style={styles.input} placeholder="Address (optional)" value={address} onChangeText={setAddress} />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleCreate} disabled={saving}>
                {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveText}>Save</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface, paddingTop: 50 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: SPACING.lg, marginBottom: SPACING.md },
  title: { fontSize: 24, fontWeight: "800", color: COLORS.text },
  addButton: { backgroundColor: COLORS.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: RADIUS.pill },
  addButtonText: { color: "#fff", fontWeight: "700" },
  card: { backgroundColor: COLORS.white, borderRadius: RADIUS.card, padding: SPACING.md, marginBottom: SPACING.sm },
  cardTitle: { fontSize: 16, fontWeight: "700", color: COLORS.text },
  cardSubtitle: { fontSize: 13, color: COLORS.primaryDark, marginTop: 2, fontWeight: "600" },
  cardAddress: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  empty: { textAlign: "center", color: COLORS.textMuted, marginTop: 40 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  modalBox: { backgroundColor: "#fff", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: SPACING.lg },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: SPACING.md },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.input, padding: 14, marginBottom: SPACING.md, fontSize: 15 },
  modalActions: { flexDirection: "row", gap: SPACING.sm, marginTop: SPACING.sm },
  cancelButton: { flex: 1, padding: 14, alignItems: "center", borderRadius: RADIUS.input, backgroundColor: COLORS.surface },
  cancelText: { color: COLORS.textMuted, fontWeight: "600" },
  saveButton: { flex: 1, padding: 14, alignItems: "center", borderRadius: RADIUS.input, backgroundColor: COLORS.primary },
  saveText: { color: "#fff", fontWeight: "700" },
});