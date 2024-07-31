import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useAuth } from "../context/use-auth"
import { Routes } from "../router";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import api from "../service/api";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import InitialIcon from "../../components/initial-icon";
import { minuteDiffer } from "./home";

export function complete(value: number) {
    return value < 10 ? "0" + value : `${value}`;
}

export default function Talk() {
    const { user } = useAuth();

    const navigation = useNavigation<NativeStackNavigationProp<Routes>>();
    const { params: { targetId } } = useRoute<RouteProp<Routes, "Conversa">>();

    const [messages, setMessages] = useState<Message[]>([]);
    const [target, setTarget] = useState<User>();

    const loading = !target;

    async function fetchTarget() {
        try {
            const { data } = await api.get<User>(`usuario/${targetId}`);
            
            setTarget(data);
        } catch (error) {
            console.error(error);
        }
    }

    async function fetchMessages() {
        try {
            const { data } = await api.get(`conversa/${user!.id_usuario}/${targetId}`);

            setMessages(data.items);
        } catch (error) {
            console.error(error);
        }
    }

    function getOnlineStatus() {
        if (!(target!.dth_acesso)) {
            return "desconhecido";
        }

        const isOnline = minuteDiffer(new Date(), new Date(target!.dth_acesso));
        const sentAt = new Date(target!.dth_acesso);

        const dateDisplay = `${sentAt.getHours()}:${complete(sentAt.getMinutes())}`;

        if (isOnline) {
            return "online";
        }

        return `última vez online às ${dateDisplay}`
    }

    useEffect(
        () => {
            if (targetId === -1) {
                return navigation.goBack();
            }

            const targetInterval = setInterval(fetchTarget, 5000);
            const messageInterval = setInterval(fetchMessages, 5000);

            return () => {
                clearInterval(targetInterval);
                clearInterval(messageInterval);
            }
        },
        []
    );

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator 
                    size={36}
                    color="#7776BC"
                />
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={{ marginRight: 11, }}
                    onPress={navigation.goBack}
                >
                    <MaterialCommunityIcons 
                        name="arrow-left"
                        size={28}
                        color={"#FFF"}
                    />
                </TouchableOpacity>
                <View style={{ flexDirection: "row", alignItems: "center", }}>
                    <InitialIcon text={target.nome} />
                    <View>
                        <Text style={styles.title}>{target.nome}</Text>
                        <Text style={styles.lastSeenDate}>{getOnlineStatus()}</Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        backgroundColor: "#FFF8F0",
        alignItems: "center",
        justifyContent: "center",
    },
    container: {
        flex: 1,
        backgroundColor: "#FFF8F0",
    },
    header: {
        width: "100%",
        padding: 20,
        marginBottom: 15,
        backgroundColor: "#302C34",
        flexDirection: "row",
        alignItems: "center",
    },
    title: {
        fontWeight: "bold",
        fontSize: 18,
        color: "#fff",
    },
    lastSeenDate: {
        fontWeight: "medium",
        fontSize: 14,
        color: "#fff",
    }
})