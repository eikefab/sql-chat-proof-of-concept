import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "./context/use-auth";
import { NavigationContainer } from "@react-navigation/native";
import Login from "./page/login";
import { useEffect } from "react";
import Home from "./page/home";

const Stack = createNativeStackNavigator();

export default function Router() {
    const { user } = useAuth();

    useEffect(() => { }, [user]);

    if (user) {
        return (
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false, }}>
                    <Stack.Screen
                        name="Home"
                        component={Home}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false, }}>
                <Stack.Screen
                    name="Login"
                    component={Login}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );

}