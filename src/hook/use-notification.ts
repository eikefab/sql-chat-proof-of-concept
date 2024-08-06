import { isDevice } from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { useEffect, useRef, useState } from "react";
import api from "../service/api";
import { useAuth } from "../context/use-auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

export default function useNotifications() {

    const [notification, setNotification] = useState<Notifications.Notification | undefined>();

    const notificationListener = useRef<Notifications.Subscription>();
    const responseListener = useRef<Notifications.Subscription>();

    function updateListeners() {
        notificationListener.current = Notifications.addNotificationReceivedListener(setNotification);
        responseListener.current = Notifications.addNotificationResponseReceivedListener(console.log);
    }

    function clearListeners() {
        if (notificationListener.current) {
            Notifications.removeNotificationSubscription(notificationListener.current);
        }

        if (responseListener.current) {
            Notifications.removeNotificationSubscription(responseListener.current);
        }
    }

    async function fetchToken() {
        if (!isDevice) {
            return undefined;
        }

        const { granted } = await Notifications.getPermissionsAsync();

        if (!granted) {
            return undefined;
        }

        try {
            const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;

            const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });

            return token;
        } catch (err) {
            console.error(err);
        }

        return undefined;
    }

    async function pushToken(user: User, token: string | undefined) {
        if (!token) {
            return;
        }

        try {
            await api.put(
                "usuario_token",
                {
                    id_usuario: user.id_usuario,
                    token,
                }
            )
        } catch (error) {
            console.error(error);
        }
    }

    async function registerChannels() {
        if (Platform.OS === "android") {
            return Notifications.setNotificationChannelAsync(
                "default",
                {
                    importance: Notifications.AndroidImportance.MAX,
                    name: "default",
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: "#FF231F7C",
                    enableVibrate: true,
                    showBadge: true,
                    sound: "default",
                    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
                }
            )
        }
    }

    async function requestPermission() {
        return Notifications.requestPermissionsAsync();
    }

    return { requestPermission, fetchToken, pushToken, updateListeners, registerChannels, clearListeners };

}