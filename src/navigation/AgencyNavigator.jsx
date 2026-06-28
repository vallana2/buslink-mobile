// src/navigation/AgencyNavigator.jsx
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AgencyDashboardScreen from "../screens/agency/AgencyDashboardScreen";
import ManageBusesScreen from "../screens/agency/ManageBusesScreen";
import ManageRoutesScreen from "../screens/agency/ManageRoutesScreen";
import ManageSchedulesScreen from "../screens/agency/ManageSchedulesScreen";
import ManageDriversScreen from "../screens/agency/ManageDriversScreen";
import AddDriverScreen from "../screens/agency/AddDriverScreen";

const Stack = createNativeStackNavigator();

export default function AgencyNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AgencyDashboard" component={AgencyDashboardScreen} />
      <Stack.Screen name="ManageBuses" component={ManageBusesScreen} />
      <Stack.Screen name="ManageRoutes" component={ManageRoutesScreen} />
      <Stack.Screen name="ManageSchedules" component={ManageSchedulesScreen} />
      <Stack.Screen
        name="ManageDrivers"
        component={ManageDriversScreen}
        options={{ headerShown: true, title: "Manage Drivers" }}
      />
      <Stack.Screen
        name="AddDriver"
        component={AddDriverScreen}
        options={{ headerShown: true, title: "Add Driver" }}
      />
    </Stack.Navigator>
  );
}