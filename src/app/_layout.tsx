import React, { createContext, useState } from "react";
import { Stack } from "expo-router";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const ThemeContext = createContext({
  darkMode: false,
  toggleTheme: () => {},
});

export default function RootLayout() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
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
        <Stack.Screen name="checkout" options={{ title: "Checkout Tiket" }} />
      </Stack>
    </ThemeContext.Provider>
  );
}
