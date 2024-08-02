import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useAuth } from "../context/use-auth"
import { Routes } from "../router";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useMemo, useRef, useState } from "react";
import api from "../service/api";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator, FlatList, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
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
    const [messageLength, setMessageLength] = useState<number>(0);

    const [target, setTarget] = useState<User>();

    const [message, setMessage] = useState<string>("");
    const canSendMessage = message && message.trim() !== "";

    const listRef = useRef<FlatList<Message>>();

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
            setMessageLength(data.items.length)
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

    function MessageItem(item: Message) {
        const isUserAuthor = item.id_remetente === user!.id_usuario;
        const sentAt = new Date(item.dth_envio);

        const dateDisplay = `${sentAt.getHours()}:${complete(sentAt.getMinutes())}`;

        return (
            <View style={{
                backgroundColor: isUserAuthor ? "#6CAE75" : "#D9D9D9",
                marginLeft: isUserAuthor ? 0 : 20,
                marginRight: isUserAuthor ? 20 : 0,
                justifyContent: isUserAuthor ? "flex-end" : "flex-start",
                alignSelf: isUserAuthor ? "flex-end" : "flex-start",
                padding: 20,
                marginVertical: 10,
                borderRadius: 10,
                maxWidth: "70%",
                borderTopLeftRadius: isUserAuthor ? 10 : 0,
                borderTopRightRadius: isUserAuthor ? 0 : 10,
            }}>
                <View style={{
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                }}>
                    <Text style={{
                        textAlignVertical: "top",
                        fontWeight: "medium",
                        fontSize: 16,
                        color: isUserAuthor ? "#FFF" : "#302C34",
                        maxWidth: "75%",
                    }}>
                        {item.conteudo}
                    </Text>
                    <Text style={{
                        fontWeight: "medium",
                        fontSize: 12,
                        color: isUserAuthor ? "#FFF" : "#302C34",
                    }}>
                        {dateDisplay}
                    </Text>
                </View>
            </View>
        );
    }

    async function sendMessage() {
        setMessage("");

        try {
            return api.post(
                `conversa/${targetId}/${user!.id_usuario}`,
                {
                    conteudo: message,
                    ind_tipo: "T",
                }
            );
        } catch (error) {
            console.error(error);
        }
    } 

    useEffect(
        () => {
            if (targetId === -1) {
                return navigation.goBack();
            }

            const targetInterval = setInterval(fetchTarget, 5000);
            const messageInterval = setInterval(fetchMessages, 1000);

            return () => {
                clearInterval(targetInterval);
                clearInterval(messageInterval);
            }
        },
        []
    );

    useMemo(
        () => {
            if (listRef.current) {
                setTimeout(
                    () => {
                        listRef.current!.scrollToEnd();
                    },
                    200
                )
            }
        },
        [messageLength]
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
            <View style={styles.talkBackground}>
                <FlatList
                    ref={(ref) => listRef.current = ref!}
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    data={messages}
                    keyExtractor={({ id_mensagem }) => `mensagem-${id_mensagem}`}
                    renderItem={({ item }) => <MessageItem {...item} />}
                />
            </View>
            <KeyboardAvoidingView behavior="padding">
                <View style={{
                    padding: 20,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}>
                    <TextInput
                        value={message}
                        onChangeText={setMessage}
                        style={{
                            backgroundColor: "#1E1E1E",
                            height: 50,
                            width: "75%",
                            color: "#FFF",
                            borderRadius: 99,
                            fontWeight: "medium",
                            fontSize: 14,
                            paddingLeft: 20,
                        }}
                        placeholder="Digite sua mensagem"
                        placeholderTextColor={"#D9D9D9"}
                    />
                    <TouchableOpacity
                        disabled={!canSendMessage}
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "#1E1E1E",
                            borderRadius: 99,
                            width: 50,
                            height: 50,
                            opacity: !canSendMessage ? 0.5 : 1,
                        }}
                        onPress={sendMessage}
                    >
                        <MaterialCommunityIcons
                            name="send"
                            size={20}
                            color={"#FFF"}
                        />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
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
        backgroundColor: "#302C34",
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
        marginLeft: 14,
    },
    lastSeenDate: {
        fontWeight: "medium",
        fontSize: 14,
        color: "#fff",
        marginLeft: 14,
    },
    talkBackground: {
        flex: 1,
        backgroundColor: "#A09FDF"
    },
    messageItem: {

    }
})