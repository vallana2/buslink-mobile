import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/passenger/HomeScreen";
import SearchResultsScreen from "../screens/passenger/SearchResultsScreen";
import ScheduleDetailScreen from "../screens/passenger/ScheduleDetailScreen";
import CheckoutScreen from "../screens/passenger/CheckoutScreen";
import TicketScreen from "../screens/passenger/TicketScreen";
import BookingHistoryScreen from "../screens/passenger/BookingHistoryScreen";
import ProfileScreen from "../screens/passenger/ProfileScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="SearchResults" component={SearchResultsScreen} options={{ headerShown: true, title: "Results" }} />
      <Stack.Screen name="ScheduleDetail" component={ScheduleDetailScreen} options={{ headerShown: true, title: "Trip Details" }} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ headerShown: true, title: "Checkout" }} />
      <Stack.Screen name="Ticket" component={TicketScreen} options={{ headerShown: true, title: "Your Ticket", headerBackVisible: false }} />
    </Stack.Navigator>
  );
}

export default function PassengerNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Explore" component={HomeStack} />
      <Tab.Screen name="My Trips" component={BookingHistoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}