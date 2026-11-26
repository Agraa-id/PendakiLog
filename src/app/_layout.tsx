import React, { createContext, useContext, useEffect, useState } from "react";
import { router, Stack, usePathname } from "expo-router";
import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Loading from "../components/Loading";
import { AuthProvider, useAuth } from "../contexts/AuthContext";

export const ThemeContext = createContext({
  darkMode: false,
  toggleTheme: () => {},
});

function RootNavigator() {
  const { session, loading } = useAuth();
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const pathname = usePathname();
  const isLoginScreen = pathname === "/";

  useEffect(() => {
    if (loading) {
      return;
    }
    if (!session && !isLoginScreen) {
      router.replace("/");
    } else if (session && isLoginScreen) {
      router.replace("/home");
    }
  }, [isLoginScreen, loading, session]);

  if (loading || (!session && !isLoginScreen) || (session && isLoginScreen)) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Loading message="Memeriksa sesi..." />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: darkMode ? "#0f172a" : "#ffffff",
        },
        headerTintColor: darkMode ? "#ffffff" : "#000000",
        contentStyle: {
          backgroundColor: darkMode ? "#0f172a" : "#f8fafc",
        },
        headerRight: () => (
          <Pressable onPress={toggleTheme} style={{ marginRight: 10 }}>
            <Ionicons
              name={darkMode ? "sunny-outline" : "moon-outline"}
              size={22}
              color={darkMode ? "#fde047" : "#0f172a"}
            />
          </Pressable>
        ),
      }}
    >
      <Stack.Screen name="index" options={{ title: "PendakiLog - Autentikasi" }} />
      <Stack.Screen name="home" options={{ title: "PendakiLog - Beranda" }} />
      <Stack.Screen name="detail/[id]" options={{ title: "Detail Gunung" }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [darkMode, setDarkMode] = useState(false);
  const toggleTheme = () => setDarkMode((current) => !current);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </ThemeContext.Provider>
  );
}
