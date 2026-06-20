import { useState, useEffect } from "react";
import {
  View, Text, FlatList, TouchableOpacity, TextInput,
  StyleSheet, Alert, ActivityIndicator, Modal,
} from "react-native";
import { getAgencies, createAgency } from "../../services/admin.service";
import { COLORS, RADIUS, SHADOW, SPACING } from "../../constants/theme";

export default function AgenciesScreen({ navigation }) {
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchAgencies(); }, []);

  const fetchAgencies = async () => {
    try {
      const data = await getAgencies();
      setAgencies(data);
    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!name || !email || !phone) {
      Alert.alert("Error", "All fields are required");
      return;
    }
    setSaving(true);
    try {
      await createAgency(name, email, phone);
      setModalVisible(false);
      setName(""); setEmail(""); setPhone("");
      fetchAgencies();
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Failed to create agency");
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
        <Text style={styles.title}>Agencies</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={agencies}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: SPACING.lg, paddingTop: 0 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, SHADOW]}
            onPress={() => navigation.navigate("AgencyDetail", { agency: item })}
          >
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardSubtitle}>{item.email}</Text>
            <Text style={styles.cardAddress}>{item.phone}</Text>
            <Text style={styles.hint}>Tap to link station / create admin →</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No agencies yet</Text>}
      />

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Add Agency</Text>
            <TextInput style={styles.input} placeholder="Agency name (e.g. RITCO)" value={name} onChangeText={setName} />
            <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
            <TextInput style={styles.input} placeholder="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

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
  cardSubtitle: { fontSize: 13, color: COLORS.textMuted, marginTop: 2 },
  cardAddress: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  hint: { fontSize: 11, color: COLORS.primaryDark, marginTop: 8, fontWeight: "600" },
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