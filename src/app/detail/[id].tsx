import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useCallback, useContext, useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import ErrorMessage from "../../components/ErrorMessage";
import Loading from "../../components/Loading";
import { getMountainById, getWeather } from "../../services/mountainService";
import type { MountainLog, WeatherData } from "../../types/mountain";
import { ThemeContext } from "../_layout";

export default function DetailScreen() {
  const { darkMode } = useContext(ThemeContext);
  const { id } = useLocalSearchParams<{ id: string }>();

  const [mountain, setMountain] = useState<MountainLog | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState<boolean>(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  const theme = {
    bg: darkMode ? "#0f172a" : "#f8fafc",
    cardBg: darkMode ? "#1e293b" : "#ffffff",
    textPrimary: darkMode ? "#f8fafc" : "#0f172a",
    textSecondary: darkMode ? "#94a3b8" : "#64748b",
    border: darkMode ? "#334155" : "#cbd5e1",
  };

  // Cuaca puncak dari API eksternal (Open-Meteo) pakai .then() / .catch()
  const loadWeather = useCallback((m: MountainLog) => {
    if (m.latitude === undefined || m.longitude === undefined) return;

    setWeatherLoading(true);
    setWeatherError(null);
    getWeather(m.latitude, m.longitude, m.elevation)
      .then((data) => setWeather(data))
      .catch((err) => setWeatherError(String(err)))
      .finally(() => setWeatherLoading(false));
  }, []);

  // Ambil detail gunung (async/await + try/catch/finally)
  const loadMountain = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMountainById(id);
      setMountain(response.data);
      loadWeather(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [id, loadWeather]);

  useEffect(() => {
    loadMountain();
  }, [loadMountain]);

  if (loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.bg }]}>
        <Loading message="Mengambil detail gunung..." />
      </View>
    );
  }

  if (error || !mountain) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.bg }]}>
        <ErrorMessage
          message={error ?? "Data gunung tidak ditemukan."}
          onRetry={loadMountain}
        />
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Kembali</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]} contentContainerStyle={{ padding: 20 }}>
      <Stack.Screen options={{ title: mountain.name, headerBackTitle: "Kembali" }} />

      <View style={[styles.headerCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
        <MaterialCommunityIcons name="image-filter-hdr" size={80} color="#16a34a" />
        <Text style={[styles.title, { color: theme.textPrimary }]}>{mountain.name}</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{mountain.location}</Text>
      </View>

      <View style={styles.infoSection}>
        <View style={[styles.infoBox, { backgroundColor: theme.cardBg }]}>
          <Ionicons name="speedometer-outline" size={24} color="#16a34a" />
          <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Ketinggian</Text>
          <Text style={[styles.infoValue, { color: theme.textPrimary }]}>{mountain.elevation} mdpl</Text>
        </View>

        <View style={[styles.infoBox, { backgroundColor: theme.cardBg }]}>
          <Ionicons name="time-outline" size={24} color="#16a34a" />
          <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Estimasi</Text>
          <Text style={[styles.infoValue, { color: theme.textPrimary }]}>{mountain.estimatedTime}</Text>
        </View>

        <View style={[styles.infoBox, { backgroundColor: theme.cardBg }]}>
          <Ionicons name="fitness-outline" size={24} color="#16a34a" />
          <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Kesulitan</Text>
          <Text style={[styles.infoValue, { color: theme.textPrimary }]}>{mountain.difficulty}</Text>
        </View>
      </View>

      {mountain.latitude !== undefined && (
        <View style={[styles.descCard, { backgroundColor: theme.cardBg }]}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            Cuaca Puncak (saat ini)
          </Text>
          {weatherLoading ? (
            <Loading message="Mengambil data cuaca..." />
          ) : weatherError ? (
            <ErrorMessage
              message={weatherError}
              onRetry={() => loadWeather(mountain)}
            />
          ) : weather ? (
            <View>
              <Text style={[styles.descText, { color: theme.textPrimary }]}>
                {weather.condition} · {weather.temperature}°C
              </Text>
              <Text style={[styles.descText, { color: theme.textSecondary }]}>
                Angin: {weather.windSpeed} km/jam
              </Text>
            </View>
          ) : null}
        </View>
      )}

      <View style={[styles.descCard, { backgroundColor: theme.cardBg }]}>
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Deskripsi Jalur</Text>
        <Text style={[styles.descText, { color: theme.textSecondary }]}>{mountain.description}</Text>
      </View>
      
      <Pressable style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backBtnText}>Kembali ke Beranda</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  errorText: { fontSize: 16, color: "#ef4444", marginBottom: 12 },
  headerCard: { alignItems: "center", marginBottom: 16, padding: 20, borderRadius: 16, borderWidth: 1 },
  title: { fontSize: 24, fontWeight: "bold", marginTop: 8 },
  subtitle: { fontSize: 14 },
  infoSection: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16, gap: 8 },
  infoBox: { flex: 1, padding: 12, borderRadius: 12, alignItems: "center" },
  infoLabel: { fontSize: 10, marginTop: 4 },
  infoValue: { fontSize: 11, fontWeight: "bold", textAlign: "center" },
  descCard: { padding: 16, borderRadius: 12, marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },
  descText: { fontSize: 14, lineHeight: 22 },
  checkoutBtn: {
    backgroundColor: "#16a34a",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  checkoutBtnText: { color: "#ffffff", fontWeight: "bold" },
  backBtn: { backgroundColor: "#64748b", padding: 14, borderRadius: 12, alignItems: "center", marginBottom: 20 },
  backBtnText: { color: "#ffffff", fontWeight: "bold" },
});