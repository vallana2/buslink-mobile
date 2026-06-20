import { useState, useEffect } from "react";
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { getStations, linkAgencyToStation, createAgencyAdmin } from "../../services/admin.service";
import { COLORS, RADIUS, SHADOW, SPACING } from "../../constants/theme";

export default function AgencyDetailScreen({ route }) {
  const { agency } = route.params;
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState("");
  const [counterNumber, setCounterNumber] = useState("");
  const [linking, setLinking] = useState(false);

  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPhone, setAdminPhone] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [creatingAdmin, setCreatingAdmin] = useState(false);

  useEffect(() => { fetchStations(); }, []);

  const fetchStations = async () => {
    try {
      const data = await getStations();
      setStations(data);
      if (data.length > 0) setSelectedStation(data[0].id);
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  const handleLink = async () => {
    if (!selectedStation) {
      Alert.alert("Error", "Select a station first");
      return;
    }
    setLinking(true);
    try {
      await linkAgencyToStation(agency.id, selectedStation, counterNumber);
      Alert.alert("Success", "Agency linked to station");
      setCounterNumber("");
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Failed to link");
    } finally {
      setLinking(false);
    }
  };

  const handleCreateAdmin = async () => {
    if (!adminName || !adminEmail || !adminPhone || !adminPassword) {
      Alert.alert("Error", "All fields are required");
      return;
    }
    setCreatingAdmin(true);
    try {
      await createAgencyAdmin(adminName, adminEmail, adminPhone, adminPassword, agency.id);
      Alert.alert("Success", `Agency admin created for ${agency.name}`);
      setAdminName(""); setAdminEmail(""); setAdminPhone(""); setAdminPassword("");
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Failed to create admin");
    } finally {
      setCreatingAdmin(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: SPACING.lg, paddingTop: 50 }}>
      <Text style={styles.title}>{agency.name}</Text>
      <Text style={styles.subtitle}>{agency.email} • {agency.phone}</Text>

      <View style={[styles.card, SHADOW]}>
        <Text style={styles.cardTitle}>🔗 Link to Station</Text>
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={selectedStation} onValueChange={setSelectedStation}>
            {stations.map((s) => (
              <Picker.Item key={s.id} label={`${s.name} (${s.city})`} value={s.id} />
            ))}
          </Picker>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Counter number (optional)"
          value={counterNumber}
          onChangeText={setCounterNumber}
        />
        <TouchableOpacity style={styles.button} onPress={handleLink} disabled={linking}>
          {linking ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Link Station</Text>}
        </TouchableOpacity>
      </View>

      <View style={[styles.card, SHADOW]}>
        <Text style={styles.cardTitle}>👤 Create Agency Admin</Text>
        <TextInput style={styles.input} placeholder="Full name" value={adminName} onChangeText={setAdminName} />
        <TextInput style={styles.input} placeholder="Email" value={adminEmail} onChangeText={setAdminEmail} autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Phone" value={adminPhone} onChangeText={setAdminPhone} keyboardType="phone-pad" />
        <TextInput style={styles.input} placeholder="Temporary password" value={adminPassword} onChangeText={setAdminPassword} secureTextEntry />
        <TouchableOpacity style={styles.button} onPress={handleCreateAdmin} disabled={creatingAdmin}>
          {creatingAdmin ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Create Admin</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  title: { fontSize: 24, fontWeight: "800", color: COLORS.text },
  subtitle: { fontSize: 13, color: COLORS.textMuted, marginBottom: SPACING.lg },
  card: { backgroundColor: COLORS.white, borderRadius: RADIUS.card, padding: SPACING.lg, marginBottom: SPACING.lg },
  cardTitle: { fontSize: 16, fontWeight: "700", marginBottom: SPACING.md, color: COLORS.text },
  pickerWrapper: { borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.input, marginBottom: SPACING.md },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.input, padding: 14, marginBottom: SPACING.md, fontSize: 15 },
  button: { backgroundColor: COLORS.primary, padding: 14, borderRadius: RADIUS.input, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "700" },
});