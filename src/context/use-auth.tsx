import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import api from "../service/api";
import { Alert } from "react-native";
import useNotifications from "../hook/use-notification";

import * as Notifications from "expo-notifications";

type LoginInput = {
  login: string;
  senha: string;
};

export type AuthContextProps = {
  user?: User;
  login: ({ login, senha }: LoginInput) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext({} as AuthContextProps);

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const { fetchToken, pushToken } = useNotifications();

  const userStorage = useAsyncStorage("Chat.User");
  const [user, setUser] = useState<User>();

  async function login({ login, senha }: LoginInput) {
    try {
      const { data } = await api.get<User>("acesso", {
        headers: { login, senha },
      });

      setUser(data);
      userStorage.setItem(JSON.stringify(data));

      Notifications.scheduleNotificationAsync({
        trigger: null,
        content: {
          title: "Bem-vindo",
          subtitle: "Você fez login com sucesso.",
        },
      });

      const token = await fetchToken();

      if (token) {
        await pushToken(data, token);
      }
    } catch (error) {
      Alert.alert(
        "Erro",
        "Não foi possível fazer seu login. Verifique seu usuário e senha.",
      );
    }
  }

  async function logout() {
    setUser(undefined);

    return userStorage.removeItem();
  }

  async function checkLogin() {
    const user = await userStorage.getItem();

    if (user) {
      setUser(JSON.parse(user));
    }
  }

  useEffect(() => {
    checkLogin();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
