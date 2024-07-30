import { useState } from "react";
import { useAuth } from "../context/use-auth";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";


export default function Login() {
    const { login: tryLogin } = useAuth();

    const [login, setLogin] = useState<string>("");

    const [senha, setSenha] = useState<string>("");
    const [visible, setVisible] = useState<boolean>(true);

    const [loading, setLoading] = useState<boolean>(false);

    async function checkCredentials() {
        if (login.trim() === "" || senha.trim() === "" || !login || !senha) {
            return Alert.alert(
                "Credenciais inválidas",
                "As credenciais estão inválidas, verifique-as e tente novamente.",
            );
        }

        setLoading(true);

        return tryLogin({ login, senha }).finally(() => setLoading(false));
    }

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator 
                    size={36}
                    color={"#6CAE75"}
                />
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.icon}>
                    <MaterialCommunityIcons
                        name="forum"
                        size={36}
                        color={"#302C34"}
                    />
                </View>

                <TextInput
                    style={[styles.input, { marginBottom: 20, }]}
                    value={login}
                    onChangeText={setLogin}
                    placeholder="Usuário"
                    placeholderTextColor="#999"
                    autoCapitalize="none"
                />

                <View style={{ marginBottom: 107, }}>
                    <TextInput
                        style={styles.input}
                        value={senha}
                        onChangeText={setSenha}
                        placeholder="Senha"
                        placeholderTextColor="#999"
                        textContentType="password"
                        secureTextEntry={visible}
                    />

                    <TouchableOpacity
                        style={styles.passwordLookup}
                        onPress={() => setVisible(!visible)}
                    >
                        <MaterialCommunityIcons
                            name={visible ? "eye" : "eye-off"}
                            size={24}
                            color={"#999"}
                        />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={checkCredentials}
                >
                    <Text style={styles.buttonText}>ACESSAR</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF8F0",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    content: {
        width: "100%",
        padding: 20,
        backgroundColor: "#302C34",
        borderRadius: 10,
    },
    icon: {
        padding: 20,
        borderRadius: 10,
        backgroundColor: "#FFF8F0",
        alignItems: "center",
        alignSelf: "center",
        marginBottom: 107,
    },
    input: {
        width: "100%",
        backgroundColor: "#FFF8F0",
        padding: 20,
        borderWidth: 0.5,
        borderColor: "#1E1E1E",
        borderRadius: 10,
    },
    passwordLookup: {
        position: "absolute",
        right: 20,
        top: 20,
    },
    button: {
        backgroundColor: "#6CAE75",
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 14,
    }
})