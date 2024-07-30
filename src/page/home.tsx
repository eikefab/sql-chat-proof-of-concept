import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/use-auth";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import api from "../service/api";

function isDifferenceLessThanOrEqualToOneMinute(date1: Date, date2: Date) {
    const differenceInMillis = Math.abs(date1.getTime() - date2.getTime());
    const differenceInMinutes = differenceInMillis / (1000 * 60);

    return differenceInMinutes <= 1;
}

export default function Home() {
    const { user, logout } = useAuth();

    const [connectedUsers, setConnectedUsers] = useState<User[]>([]);

    function getInitials(target: User = user!) {
        const names = target.nome.split(" ");

        return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase();
    }

    async function ping() {
        try {
            await api.put(
                "acesso",
                {},
                { headers: { id_usuario: user!.id_usuario } }
            );
        } catch (error) {
            console.error(error);
        }
    }

    async function fetchConnected() {
        try {
            const { data } = await api.get<{ items: User[] }>("usuarios");

            setConnectedUsers(
                data.items.filter(
                    ({ dth_acesso }) => (
                        dth_acesso && isDifferenceLessThanOrEqualToOneMinute(new Date(), new Date(dth_acesso)) // 1 minuto
                    )
                )
            );
        } catch (error) {
            console.error(error);
        }
    }

    function UserItem(item: User) {
        return (
            <TouchableOpacity style={{ width: 60, marginRight: 20, }}>
                <View>
                    <View style={styles.icon}>
                        <Text style={styles.iconText}>{getInitials(item)}</Text>
                    </View>
                    <View style={styles.connected} />
                </View>
                <Text style={styles.connectName}>{item.nome}</Text>
            </TouchableOpacity>
        );
    }

    useEffect(
        () => {
            const pingInterval = setInterval(ping, 5000);
            const connectionInterval = setInterval(fetchConnected, 5000);

            return () => {
                clearInterval(pingInterval);
                clearInterval(connectionInterval);
            }
        },
        []
    );

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity
                onPress={logout}
                style={styles.iconNameContainer}
            >
                <View style={styles.icon}>
                    <Text style={styles.iconText}>{getInitials()}</Text>
                </View>
                <Text style={styles.title}>{user!.nome}</Text>
            </TouchableOpacity>
            <View>
                <Text style={styles.title}>Usuários conectados ({connectedUsers.length})</Text>
                <FlatList
                    data={connectedUsers}
                    keyExtractor={(item) => `connected-user-${item.id_usuario}`}
                    renderItem={({ item }) => <UserItem {...item} />}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF8F0",
        padding: 20,
    },
    iconNameContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 40,
    },
    icon: {
        borderRadius: 99,
        backgroundColor: "#999999",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        width: 60,
        height: 60,
        marginRight: 14,
    },
    iconText: {
        color: "#FFF",
        fontWeight: "bold",
        fontSize: 16,
    },
    connected: {
        position: "absolute",
        width: 15,
        height: 15,
        borderRadius: 99,
        backgroundColor: "#6CAE75",
        top: 0,
        right: 0,
    },
    connectName: {
        textAlign: "center",
        marginTop: 11,
        fontSize: 11.5,
    },
    title: {
        fontWeight: "bold",
        fontSize: 18,
        marginBottom: 11,
    }
})