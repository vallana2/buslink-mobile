// src/screens/auth/LoginScreen.jsx
import { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator,
  ScrollView, SafeAreaView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { loginUser } from "../../services/auth.service";
import { useAuth } from "../../context/AuthContext";
import { COLORS, RADIUS, SPACING, SHADOW } from "../../constants/theme";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password"); return;
    }
    setLoading(true);
    try {
      const data = await loginUser(email, password);
      await login(data.user, data.token);
    } catch (error) {
      Alert.alert("Login Error", error.response?.data?.message || "Login failed");
    } finally { setLoading(false); }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.logoBox}>
          <Text style={styles.logoIcon}>🚌</Text>
          <Text style={styles.logoText}>BusLink</Text>
          <Text style={styles.logoTagline}>Your trusted travel partner</Text>
        </View>

        <View style={[styles.card, SHADOW]}>
          <Text style={styles.cardTitle}>Welcome Back</Text>
          <Text style={styles.cardSubtitle}>Sign in to your account</Text>

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
            onPress={handleLogin}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color={COLORS.white} />
              : <Text style={styles.buttonText}>Login</Text>
            }
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.link}>
              Don't have an account?{" "}
              <Text style={styles.linkBold}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.supportBox}>
          <Text style={styles.supportText}>📞 24/7 Support: 1800-123-4567</Text>
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
  supportBox: { alignItems: "center", marginTop: SPACING.xl },
  supportText: { fontSize: 13, color: COLORS.textMuted },
});