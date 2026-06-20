// src/screens/passenger/ProfileScreen.jsx
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { COLORS, RADIUS, SHADOW, SPACING } from "../../constants/theme";

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.name}>{user?.name}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{user?.role}</Text>
        </View>
      </View>

      <View style={[styles.infoCard, SHADOW]}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{user?.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Phone</Text>
          <Text style={styles.infoValue}>{user?.phone}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={logout}>
        <Text style={styles.buttonText}>LOG OUT</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  header: {
    backgroundColor: COLORS.secondary,
    paddingTop: 70,
    paddingBottom: SPACING.xl,
    alignItems: "center",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  avatarText: { color: COLORS.white, fontSize: 28, fontWeight: "800" },
  name: { fontSize: 20, fontWeight: "800", color: COLORS.white },
  roleBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginTop: SPACING.sm,
  },
  roleText: { color: COLORS.white, fontSize: 12, fontWeight: "700" },
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    margin: SPACING.lg,
    marginTop: -SPACING.lg,
    padding: SPACING.lg,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoLabel: { color: COLORS.textMuted, fontSize: 14 },
  infoValue: { color: COLORS.text, fontSize: 14, fontWeight: "600" },
  button: {
    backgroundColor: COLORS.danger,
    borderRadius: RADIUS.button,
    paddingVertical: 16,
    alignItems: "center",
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
  },
  buttonText: { color: COLORS.white, fontWeight: "800", fontSize: 14, letterSpacing: 0.5 },
});