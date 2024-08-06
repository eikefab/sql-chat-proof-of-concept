import { useEffect } from 'react';
import { AuthContextProvider } from './src/context/use-auth';
import useNotifications from './src/hook/use-notification';
import Router from './src/router';
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  const { requestPermission, updateListeners, clearListeners, registerChannels } = useNotifications();

  useEffect(
    () => {
      requestPermission();

      updateListeners();
      registerChannels();

      return () => {
        clearListeners();
      }
    },
    []
  );

  return (
    <AuthContextProvider>
      <Router />
    </AuthContextProvider>
  )
}