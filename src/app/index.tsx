import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useContext, useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { styles } from "../constants/styles";
import { ThemeContext } from "./_layout"; // Import Context

export default function LoginScreen() {
  // Ambil state darkMode dari ThemeContext
  const { darkMode } = useContext(ThemeContext);

  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // Palette warna dinamis berdasarkan Dark Mode
  const theme = {
    bg: darkMode ? "#0f172a" : "#f8fafc",
    cardBg: darkMode ? "#1e293b" : "#ffffff",
    textPrimary: darkMode ? "#f8fafc" : "#0f172a",
    textSecondary: darkMode ? "#94a3b8" : "#64748b",
    border: darkMode ? "#334155" : "#cbd5e1",
    inputBg: darkMode ? "#1e293b" : "#ffffff",
    guestBtnBg: darkMode ? "#334155" : "#1e293b",
  };

  const handleLogin = () => {
    if (!username.trim()) {
      Alert.alert("Peringatan", "Masukkan username terlebih dahulu!");
      return;
    }
    router.replace("/home");
  };

  const handleRegister = () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert("Peringatan", "Lengkapi username dan password!");
      return;
    }
    Alert.alert("Berhasil", "Akun PendakiLog berhasil dibuat! Silakan login.");
    setIsRegistering(false);
  };

  const handleGuestLogin = () => {
    router.replace("/home");
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={{ alignItems: "center", marginBottom: 28 }}>
        <MaterialCommunityIcons name="terrain" size={72} color="#16a34a" />
        <Text style={[styles.title, { color: theme.textPrimary }]}>PendakiLog</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Catatan & Info Jalur Pendakian Gunung
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: theme.textPrimary }]}>Username / Email</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.inputBg,
              borderColor: theme.border,
              color: theme.textPrimary,
            },
          ]}
          placeholder="Masukkan username..."
          placeholderTextColor={theme.textSecondary}
          value={username}
          onChangeText={setUsername}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: theme.textPrimary }]}>Password</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.inputBg,
              borderColor: theme.border,
              color: theme.textPrimary,
            },
          ]}
          placeholder="Masukkan password..."
          placeholderTextColor={theme.textSecondary}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {!isRegistering ? (
        <>
          <Pressable style={styles.primaryBtn} onPress={handleLogin}>
            <Ionicons name="log-in-outline" size={20} color="white" />
            <Text style={styles.btnText}>Masuk ke PendakiLog</Text>
          </Pressable>

          <Pressable
            style={[styles.guestBtn, { backgroundColor: theme.guestBtnBg }]}
            onPress={handleGuestLogin}
          >
            <Ionicons name="person-outline" size={20} color="white" />
            <Text style={styles.btnText}>Login Sebagai Tamu</Text>
          </Pressable>

          <Pressable onPress={() => setIsRegistering(true)}>
            <Text style={styles.switchText}>Belum punya akun? Buat Akun</Text>
          </Pressable>
        </>
      ) : (
        <>
          <Pressable style={styles.secondaryBtn} onPress={handleRegister}>
            <Ionicons name="person-add-outline" size={20} color="white" />
            <Text style={styles.btnText}>Daftar Akun Baru</Text>
          </Pressable>

          <Pressable onPress={() => setIsRegistering(false)}>
            <Text style={styles.switchText}>Sudah punya akun? Login</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}