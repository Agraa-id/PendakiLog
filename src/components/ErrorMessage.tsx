import { Ionicons } from "@expo/vector-icons";
import { useContext } from "react";
import { Pressable, Text, View } from "react-native";
import { ThemeContext } from "../app/_layout";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

// Pesan error + tombol "Coba Lagi" (muncul jika onRetry diberikan)
export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  const { darkMode } = useContext(ThemeContext);

  return (
    <View style={{ alignItems: "center", justifyContent: "center", padding: 24 }}>
      <Ionicons name="alert-circle-outline" size={40} color="#ef4444" />
      <Text
        style={{
          marginTop: 8,
          textAlign: "center",
          color: darkMode ? "#f8fafc" : "#0f172a",
        }}
      >
        {message}
      </Text>
      {onRetry && (
        <Pressable
          onPress={onRetry}
          style={{
            marginTop: 14,
            backgroundColor: "#16a34a",
            paddingHorizontal: 18,
            paddingVertical: 10,
            borderRadius: 10,
          }}
        >
          <Text style={{ color: "#ffffff", fontWeight: "bold" }}>Coba Lagi</Text>
        </Pressable>
      )}
    </View>
  );
}
