import { useEffect, useMemo, useState } from "react";
import api from "../service/api";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Routes } from "../router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Loading from "../../components/loading";
import InitialIcon from "../../components/initial-icon";

export default function Users() {

    const navigation = useNavigation<NativeStackNavigationProp<Routes>>();
    const { width } = useWindowDimensions();

    const [query, setQuery] = useState<string>();
    const [previousQuery, setPreviousQuery] = useState<string>();
    const [users, setUsers] = useState<User[]>();

    const queryDisabled = !query || query.trim().length === 0;

    const loading = !users;

    async function fetch() {
        if (query) {
            setPreviousQuery(query);
        }

        try {
            const { data } = await api.get("usuarios", { params: { query, } });

            setUsers(data.items);
        } catch (error) {
            console.error(error);
        }
    }

    function UserItem(item: User) {
        return (
            <Pressable
                onPress={() => navigation.navigate("Conversa", { targetId: item.id_usuario })}
                style={{
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 20,
                    width: (width - 30) / 4,
                }}
            >
                <InitialIcon text={item.nome} />
                <Text style={{ marginTop: 5, width: 80, textAlign: "center", }}>{item.nome}</Text>
            </Pressable>
        )
    }

    useEffect(
        () => {
            fetch();
        },
        []
    );

    if (loading) {
        return <Loading />
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={navigation.goBack}>
                    <MaterialCommunityIcons
                        name="arrow-left"
                        size={28}
                        color={"#FFF"}
                    />
                </TouchableOpacity>
                <Text style={styles.title}>Iniciar conversa</Text>
            </View>
            <View style={styles.contentContainer}>
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.query}
                        value={query}
                        onChangeText={setQuery}
                        placeholder="Buscar usuário..."
                        placeholderTextColor="#d9d9d9"
                    />
                    <TouchableOpacity
                        style={[styles.actionIcon, { opacity: queryDisabled ? 0.5 : 1, }]}
                        onPress={fetch}
                        disabled={queryDisabled}
                    >
                        <MaterialCommunityIcons
                            name="magnify"
                            size={24}
                            color="#FFF"
                        />
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={users}
                    numColumns={4}
                    keyExtractor={(item) => `user-${item.id_usuario}`}
                    renderItem={({ item }) => <UserItem {...item} />}
                />
            </View>
        </SafeAreaView>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#302C34"
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
        fontSize: 20,
        color: "#fff",
        marginLeft: 11,
    },
    contentContainer: {
        flex: 1,
        backgroundColor: "#FFF8F0",
        padding: 20,
    },
    searchContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginBottom: 20,
    },
    actionIcon: {
        justifyContent: "center",
        alignItems: "center",
        width: 50,
        height: 50,
        backgroundColor: "#7776BC",
        borderRadius: 99,
    },
    query: {
        height: 50,
        backgroundColor: "#7776BC",
        borderRadius: 99,
        padding: 20,
        width: "70%",
        color: "#FFF",
    }
})