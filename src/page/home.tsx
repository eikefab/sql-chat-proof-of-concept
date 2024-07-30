import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/use-auth";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useEffect } from "react";

export default function Home() {
    const { user, logout } = useAuth();

    function getInitials() {
        const names = user!.nome.split(" ");

        return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase();
    }

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity
                onPress={logout}
                style={{ flexDirection: "row", alignItems: "center", }}
            >
                <View style={styles.icon}>
                    <Text style={styles.iconText}>{getInitials()}</Text>
                </View>
                <Text style={styles.name}>{user!.nome}</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF8F0",
        padding: 20,
    },
    icon: {
        borderRadius: 99,
        backgroundColor: "#999999",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        width: 75,
        height: 75,
        marginRight: 14,
    },
    iconText: {
        color: "#FFF",
        fontWeight: "bold",
        fontSize: 24,
    },
    name: {
        fontWeight: "bold",
        fontSize: 18,
    }
})