import { useContext } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { ThemeContext } from "../app/_layout";

interface LoadingProps {
  message?: string;
}

// Indikator loading yang bisa dipakai ulang di banyak halaman
export default function Loading({ message = "Memuat data..." }: LoadingProps) {
  const { darkMode } = useContext(ThemeContext);

  return (
    <View style={{ alignItems: "center", justifyContent: "center", padding: 24 }}>
      <ActivityIndicator size="large" color="#16a34a" />
      <Text style={{ marginTop: 10, color: darkMode ? "#94a3b8" : "#64748b" }}>
        {message}
      </Text>
    </View>
  );
}
