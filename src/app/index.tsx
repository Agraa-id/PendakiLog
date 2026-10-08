import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { styles } from "../constants/styles";

export default function LoginScreen() {
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

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
    <View style={styles.container}>
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <MaterialCommunityIcons name="terrain" size={64} color="#16a34a" />
        <Text style={styles.title}>PendakiLog</Text>
        <Text style={styles.subtitle}>
          Catatan & Info Jalur Pendakian Gunung
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Username / Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan username..."
          value={username}
          onChangeText={setUsername}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan password..."
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

          <Pressable style={styles.guestBtn} onPress={handleGuestLogin}>
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
