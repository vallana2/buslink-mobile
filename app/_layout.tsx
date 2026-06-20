import { AuthProvider } from "../src/context/AuthContext";
import RootNavigator from "../src/navigation/RootNavigator";

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}