// src/navigation/AdminNavigator.jsx
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AdminDashboardScreen from "../screens/admin/AdminDashboardScreen";
import StationsScreen from "../screens/admin/StationsScreen";
import AgenciesScreen from "../screens/admin/AgenciesScreen";
import AgencyDetailScreen from "../screens/admin/AgencyDetailScreen";
import { useAuth } from "../context/AuthContext";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function DashboardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DashboardMain" component={AdminDashboardScreen} />
      <Stack.Screen name="Stations" component={StationsScreen} />
      <Stack.Screen name="Agencies" component={AgenciesScreen} />
      <Stack.Screen name="AgencyDetail" component={AgencyDetailScreen} options={{ headerShown: true, title: "Manage Agency" }} />
    </Stack.Navigator>
  );
}

function ProfileTab() {
  const { user, logout } = useAuth();
  return (
    <View style={styles.profileContainer}>
      <Text style={styles.profileName}>{user?.name}</Text>
      <Text style={styles.profileRole}>{user?.role}</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function AdminNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Dashboard" component={DashboardStack} />
      <Tab.Screen name="Profile" component={ProfileTab} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  profileContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  profileName: { fontSize: 20, fontWeight: "700" },
  profileRole: { fontSize: 13, color: "#888", marginTop: 4 },
  logoutButton: { backgroundColor: "#dc3545", padding: 14, borderRadius: 8, paddingHorizontal: 32, marginTop: 24 },
  logoutText: { color: "#fff", fontWeight: "600" },
});