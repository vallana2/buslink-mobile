// src/navigation/RootNavigator.jsx
import { View, ActivityIndicator } from "react-native";
import { useAuth } from "../context/AuthContext";
import AuthNavigator from "./AuthNavigator";
import PassengerNavigator from "./PassengerNavigator";
import DriverNavigator from "./DriverNavigator";
import AgencyNavigator from "./AgencyNavigator";
import AdminNavigator from "./AdminNavigator";

export default function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (!user) return <AuthNavigator />;

  switch (user.role) {
    case "PASSENGER":
      return <PassengerNavigator />;
    case "DRIVER":
      return <DriverNavigator />;
    case "AGENCY_ADMIN":
      return <AgencyNavigator />;
    case "SYSTEM_ADMIN":
      return <AdminNavigator />;
    default:
      return <AuthNavigator />;
  }
}