import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "./context/use-auth";
import { NavigationContainer } from "@react-navigation/native";
import Login from "./page/login";
import { useEffect } from "react";
import Home from "./page/home";
import Talk from "./page/talk";
import Users from "./page/users";

export type Routes = {
  Login: undefined;
  Home: undefined;
  Conversa: {
    targetId: number;
  };
  Usuarios: undefined;
};

const Stack = createNativeStackNavigator<Routes>();

export default function Router() {
  const { user } = useAuth();

  useEffect(() => {}, [user]);

  if (user) {
    return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName="Home"
        >
          <Stack.Screen name="Home" component={Home} />

          <Stack.Screen name="Conversa" component={Talk} />

          <Stack.Screen name="Usuarios" component={Users} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
