import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/use-auth";
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import api from "../service/api";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Routes } from "../router";
import InitialIcon from "../../components/initial-icon";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export function minuteDiffer(date1: Date, date2: Date) {
    if (!date2) {
        return false;
    }

    const differenceInMillis = Math.abs(date1.getTime() - date2.getTime());
    const differenceInMinutes = differenceInMillis / (1000 * 60);

    return differenceInMinutes <= 1;
}

export default function Home() {
    const { user, logout } = useAuth();
    const navigation = useNavigation<NativeStackNavigationProp<Routes>>();

    const [connectedUsers, setConnectedUsers] = useState<User[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);

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
                data.items
                    .filter(
                        ({ dth_acesso }) => (
                            dth_acesso && minuteDiffer(new Date(), new Date(dth_acesso)) // 1 minuto
                        )
                    )
                    .filter(
                        ({ id_usuario }) => (
                            id_usuario !== user!.id_usuario
                        )
                    )
            );
        } catch (error) {
            console.error(error);
        }
    }

    async function fetchMessages() {
        try {
            const { data } = await api.get(`conversa-recente/${user!.id_usuario}`);

            setMessages(data.items);
        } catch (error) {
            console.error(error);
        }
    }

    function UserItem(item: User) {
        function onPress() {
            navigation.navigate(
                "Conversa", 
                { 
                    userId: user!.id_usuario, 
                    targetId: item.id_usuario 
                }
            );
        }

        return (
            <TouchableOpacity 
                style={{ width: 60, marginRight: 20, }}
                onPress={onPress}
            >
                <View>
                    <InitialIcon text={item.nome} />
                    <View style={styles.connected} />
                </View>
                <Text style={styles.connectName}>{item.nome}</Text>
            </TouchableOpacity>
        );
    }

    function MessageItem(item: Message) {
        const author = item.id_remetente === user?.id_usuario ? item.nome_destinatario : item.nome_remetente;
        const sentAt = new Date(item.dth_envio);

        const dateDisplay = `${sentAt.getHours()}:${sentAt.getMinutes()}`;

        function onPress() {
            navigation.navigate(
                "Conversa", 
                { 
                    userId: user!.id_usuario, 
                    targetId: item.id_remetente === user?.id_usuario ? item.id_destinatario : item.id_remetente,
                }
            );
        }

        return (
            <TouchableOpacity 
                style={styles.talk}
                onPress={onPress}
            >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <InitialIcon text={author} />
                    <View>
                        <Text style={{ fontSize: 18, fontWeight: "bold" }}>{author}</Text>
                        <Text>
                            {item.id_remetente === user?.id_usuario && "Você: "}
                            {item.conteudo}
                        </Text>
                    </View>
                </View>
                <Text>{dateDisplay}</Text>
            </TouchableOpacity>
        );
    }

    useEffect(
        () => {
            const pingInterval = setInterval(ping, 5000);
            const connectionInterval = setInterval(fetchConnected, 5000);
            const messageInterval = setInterval(fetchMessages, 5000);

            return () => {
                clearInterval(pingInterval);
                clearInterval(connectionInterval);
                clearInterval(messageInterval);
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
                <InitialIcon text={user!.nome} />
                <Text style={styles.title}>{user!.nome}</Text>
            </TouchableOpacity>
            <View>
                <Text style={styles.title}>Usuários conectados ({connectedUsers.length})</Text>
                <FlatList
                    style={{ marginBottom: 40, }}
                    data={connectedUsers}
                    keyExtractor={(item) => `connected-user-${item.id_usuario}`}
                    renderItem={({ item }) => <UserItem {...item} />}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    bounces={false}
                />
                <Text style={styles.title}>Últimas conversas</Text>
                <FlatList
                    data={messages}
                    keyExtractor={(item) => `message-${item.id_mensagem}`}
                    renderItem={({ item }) => <MessageItem {...item} />}
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                />
            </View>
            <TouchableOpacity 
                style={styles.chatButton}
                onPress={() => navigation.navigate("Usuarios")}
            >
                <MaterialCommunityIcons 
                    name="forum"
                    size={28}
                    color="#FFF"
                />
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
    iconNameContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 40,
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
    },
    talk: {
        flexDirection: "row",
        marginBottom: 20,
        backgroundColor: "#D9D9D9",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "space-between"
    },
    chatButton: {
        position: "absolute",
        bottom: 20,
        right: 20,
        width: 50,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        backgroundColor: "#6CAE75",
    }
})