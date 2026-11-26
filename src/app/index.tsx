import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useContext, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { styles } from "../constants/styles";
import { useAuth } from "../contexts/AuthContext";
import {
  isSupabaseConfigured,
  SUPABASE_CONFIG_ERROR,
} from "../services/supabase";
import { ThemeContext } from "./_layout";

export default function LoginScreen() {
  const { darkMode } = useContext(ThemeContext);
  const { signIn, signUp } = useAuth();

  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [callsign, setCallsign] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const theme = {
    bg: darkMode ? "#0f172a" : "#f8fafc",
    textPrimary: darkMode ? "#f8fafc" : "#0f172a",
    textSecondary: darkMode ? "#94a3b8" : "#64748b",
    border: darkMode ? "#334155" : "#cbd5e1",
    inputBg: darkMode ? "#1e293b" : "#ffffff",
  };

  const handleAuthentication = async () => {
    const trimmedEmail = email.trim();
    const trimmedCallsign = callsign.trim();
    if (!trimmedEmail || !password || (isRegistering && !trimmedCallsign)) {
      Alert.alert(
        "Peringatan",
        isRegistering
          ? "Lengkapi nama pendaki, email, dan password."
          : "Masukkan email dan password.",
      );
      return;
    }

    try {
      setSubmitting(true);
      if (isRegistering) {
        const signedIn = await signUp(
          trimmedEmail,
          password,
          trimmedCallsign,
        );
        if (!signedIn) {
          Alert.alert(
            "Periksa email",
            "Akun berhasil dibuat. Konfirmasi email Anda sebelum masuk.",
          );
          setIsRegistering(false);
          return;
        }
      } else {
        await signIn(trimmedEmail, password);
      }
      router.replace("/home");
    } catch (error) {
      Alert.alert(
        isRegistering ? "Pendaftaran gagal" : "Login gagal",
        error instanceof Error ? error.message : String(error),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={{ alignItems: "center", marginBottom: 28 }}>
        <MaterialCommunityIcons name="terrain" size={72} color="#16a34a" />
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          PendakiLog
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Catatan & Info Jalur Pendakian Gunung
        </Text>
        {!isSupabaseConfigured ? (
          <Text
            style={{
              color: "#dc2626",
              textAlign: "center",
              marginTop: 12,
              fontSize: 12,
            }}
          >
            {SUPABASE_CONFIG_ERROR}
          </Text>
        ) : null}
      </View>

      {isRegistering ? (
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.textPrimary }]}>
            Nama Pendaki
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.inputBg,
                borderColor: theme.border,
                color: theme.textPrimary,
              },
            ]}
            placeholder="Masukkan nama panggilan..."
            placeholderTextColor={theme.textSecondary}
            autoCapitalize="words"
            value={callsign}
            onChangeText={setCallsign}
          />
        </View>
      ) : null}

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: theme.textPrimary }]}>
          Email
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.inputBg,
              borderColor: theme.border,
              color: theme.textPrimary,
            },
          ]}
          placeholder="nama@email.com"
          placeholderTextColor={theme.textSecondary}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: theme.textPrimary }]}>
          Password
        </Text>
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
          autoCapitalize="none"
          autoComplete={isRegistering ? "new-password" : "current-password"}
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {!isRegistering ? (
        <>
          <Pressable
            style={[styles.primaryBtn, submitting && { opacity: 0.7 }]}
            onPress={handleAuthentication}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Ionicons name="log-in-outline" size={20} color="white" />
            )}
            <Text style={styles.btnText}>Masuk ke PendakiLog</Text>
          </Pressable>

          <Pressable onPress={() => setIsRegistering(true)}>
            <Text style={styles.switchText}>Belum punya akun? Buat Akun</Text>
          </Pressable>
        </>
      ) : (
        <>
          <Pressable
            style={[styles.secondaryBtn, submitting && { opacity: 0.7 }]}
            onPress={handleAuthentication}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Ionicons name="person-add-outline" size={20} color="white" />
            )}
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
