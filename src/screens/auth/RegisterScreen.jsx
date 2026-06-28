// src/screens/auth/RegisterScreen.jsx
import { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator,
  ScrollView, SafeAreaView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { registerUser } from "../../services/auth.service";
import { useAuth } from "../../context/AuthContext";
import { COLORS, RADIUS, SPACING, SHADOW } from "../../constants/theme";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleRegister = async () => {
    if (!name || !email || !phone || !password) {
      Alert.alert("Error", "Please fill all fields"); return;
    }
    setLoading(true);
    try {
      const data = await registerUser(name, email, phone, password);
      await login(data.user, data.token);
    } catch (error) {
      Alert.alert("Registration Error", error.response?.data?.message || "Registration failed");
    } finally { setLoading(false); }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.logoBox}>
          <Text style={styles.logoIcon}>🚌</Text>
          <Text style={styles.logoText}>BusLink</Text>
          <Text style={styles.logoTagline}>Create your account</Text>
        </View>

        <View style={[styles.card, SHADOW]}>
          <Text style={styles.cardTitle}>Sign Up</Text>
          <Text style={styles.cardSubtitle}>Join thousands of happy travellers</Text>

          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="John Doe"
            placeholderTextColor={COLORS.textMuted}
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor={COLORS.textMuted}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="07XX XXX XXX"
            placeholderTextColor={COLORS.textMuted}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="••••••••"
              placeholderTextColor={COLORS.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={styles.eyeBtn}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color={COLORS.textMuted}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.7 }]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color={COLORS.white} />
              : <Text style={styles.buttonText}>Sign Up</Text>
            }
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.link}>
              Already have an account?{" "}
              <Text style={styles.linkBold}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.surface },
  container: {
    flexGrow: 1, backgroundColor: COLORS.surface,
    padding: SPACING.lg, justifyContent: "center",
  },
  logoBox: { alignItems: "center", marginBottom: SPACING.xl },
  logoIcon: { fontSize: 48, marginBottom: SPACING.xs },
  logoText: { fontSize: 28, fontWeight: "900", color: COLORS.primary },
  logoTagline: { fontSize: 13, color: COLORS.textMuted, marginTop: 4 },
  card: { backgroundColor: COLORS.white, borderRadius: RADIUS.card, padding: SPACING.lg },
  cardTitle: { fontSize: 22, fontWeight: "700", color: COLORS.text, marginBottom: 4 },
  cardSubtitle: { fontSize: 14, color: COLORS.textMuted, marginBottom: SPACING.lg },
  label: { fontSize: 13, fontWeight: "600", color: COLORS.text, marginBottom: SPACING.xs, marginTop: SPACING.sm },
  input: {
    borderWidth: 1, borderColor: COLORS.border,
    borderRadius: RADIUS.input, padding: 14,
    fontSize: 15, color: COLORS.text, backgroundColor: COLORS.surface,
  },
  passwordContainer: {
    flexDirection: "row", alignItems: "center",
    borderWidth: 1, borderColor: COLORS.border,
    borderRadius: RADIUS.input, backgroundColor: COLORS.surface,
  },
  passwordInput: { flex: 1, padding: 14, fontSize: 15, color: COLORS.text },
  eyeBtn: { padding: 14 },
  button: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.button,
    paddingVertical: 15, alignItems: "center", marginTop: SPACING.lg,
  },
  buttonText: { color: COLORS.white, fontWeight: "700", fontSize: 15 },
  link: { textAlign: "center", marginTop: SPACING.md, color: COLORS.textMuted, fontSize: 14 },
  linkBold: { color: COLORS.primary, fontWeight: "700" },
});