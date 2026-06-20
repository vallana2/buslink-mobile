import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { loginUser } from "../../services/auth.service";
import { useAuth } from "../../context/AuthContext";
import { COLORS, RADIUS, SPACING, SHADOW } from "../../constants/theme";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      const data = await loginUser(email, password);
      await login(data.user, data.token);
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      Alert.alert("Login Error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Logo Badge */}
      <View style={styles.logoBadge}>
        <Text style={styles.logoIcon}>🚌</Text>
      </View>

      <Text style={styles.title}>BUSLINK</Text>
      <Text style={styles.subtitle}>Welcome back. Log in to continue.</Text>

      <View style={styles.form}>
        <Text style={styles.label}>EMAIL</Text>
        <TextInput
          style={styles.input}
          placeholder="you@example.com"
          placeholderTextColor={COLORS.textMuted}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>PASSWORD</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor={COLORS.textMuted}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.buttonText}>LOG IN</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.link}>
            Don't have an account? <Text style={styles.linkBold}>Register</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.secondary,
    padding: SPACING.xl,
    justifyContent: "center",
    paddingTop: 80,
    paddingBottom: 60,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.input,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: SPACING.lg,
  },
  logoIcon: { fontSize: 30 },
  title: {
    fontSize: 30,
    fontWeight: "900",
    textAlign: "center",
    color: COLORS.white,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    marginTop: SPACING.sm,
    marginBottom: SPACING.xl,
    color: COLORS.textOnDark,
  },
  form: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    padding: SPACING.lg,
    ...SHADOW,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textMuted,
    letterSpacing: 0.5,
    marginBottom: SPACING.xs,
    marginTop: SPACING.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.input,
    padding: 14,
    fontSize: 16,
    color: COLORS.text,
    backgroundColor: COLORS.surface,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: RADIUS.button,
    alignItems: "center",
    marginTop: SPACING.lg,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  link: {
    textAlign: "center",
    marginTop: SPACING.lg,
    color: COLORS.textMuted,
    fontSize: 14,
  },
  linkBold: {
    color: COLORS.primary,
    fontWeight: "700",
  },
});