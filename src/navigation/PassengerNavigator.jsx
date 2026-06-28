import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/passenger/HomeScreen";
import StationAgenciesScreen from "../screens/passenger/StationAgenciesScreen";
import StationSchedulesScreen from "../screens/passenger/StationSchedulesScreen";
import SearchResultsScreen from "../screens/passenger/SearchResultsScreen";
import ScheduleDetailScreen from "../screens/passenger/ScheduleDetailScreen";
import CheckoutScreen from "../screens/passenger/CheckoutScreen";
import TicketScreen from "../screens/passenger/TicketScreen";
import ChatScreen from "../screens/passenger/ChatScreen";
import BookingHistoryScreen from "../screens/passenger/BookingHistoryScreen";
import ProfileScreen from "../screens/passenger/ProfileScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="StationAgencies" component={StationAgenciesScreen} />
      <Stack.Screen name="StationSchedules" component={StationSchedulesScreen} />
      <Stack.Screen name="SearchResults" component={SearchResultsScreen} options={{ headerShown: true, title: "Results" }} />
      <Stack.Screen name="ScheduleDetail" component={ScheduleDetailScreen} options={{ headerShown: true, title: "Trip Details" }} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ headerShown: true, title: "Checkout" }} />
      <Stack.Screen name="Ticket" component={TicketScreen} options={{ headerShown: true, title: "Your Ticket", headerBackVisible: false }} />
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
}

export default function PassengerNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#2E5BFF",
        tabBarInactiveTintColor: "#9AA5B1",
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;
          if (route.name === "Explore") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "My Trips") {
            iconName = focused ? "ticket" : "ticket-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Explore" component={HomeStack} />
      <Tab.Screen name="My Trips" component={BookingHistoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}