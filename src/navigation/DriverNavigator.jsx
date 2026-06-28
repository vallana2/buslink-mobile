// src/navigation/DriverNavigator.jsx
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DriverHomeScreen from "../screens/driver/DriverHomeScreen";
import PassengerListScreen from "../screens/driver/PassengerListScreen";
import UpdateTripStatusScreen from "../screens/driver/UpdateTripStatusScreen";
import QRScannerScreen from "../screens/driver/QRScannerScreen";

const Stack = createNativeStackNavigator();

export default function DriverNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DriverHome" component={DriverHomeScreen} />
      <Stack.Screen name="PassengerList" component={PassengerListScreen} />
      <Stack.Screen name="UpdateTripStatus" component={UpdateTripStatusScreen} />
      <Stack.Screen name="QRScanner" component={QRScannerScreen} />
    </Stack.Navigator>
  );
}