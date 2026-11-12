import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useContext } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { ThemeContext } from "../_layout";

const MOUNTAIN_DATA = [
  {
    id: "1",
    name: "Gunung Arjuno",
    location: "Malang / Pasuruan",
    elevation: 3339,
    status: "Buka",
    description:
      "Memiliki jalur ikonik via Purwosari dan Sumberawan. Terkenal dengan situs sejarah dan pemandangan kawah Welirang.",
    difficulty: "Sedang - Sulit",
    estimatedTime: "2 Hari 1 Malam",
    price: 35000,
  },
  {
    id: "2",
    name: "Gunung Semeru",
    location: "Lumajang / Malang",
    elevation: 3676,
    status: "Waspada",
    description:
      "Atap pulau Jawa dengan puncak Mahameru. Aktivitas vulkanik saat ini dipantau secara berkala oleh PVMBG.",
    difficulty: "Sulit",
    estimatedTime: "3 Hari 2 Malam",
    price: 50000,
  },
  {
    id: "3",
    name: "Gunung Welirang",
    location: "Mojokerto / Pasuruan",
    elevation: 3156,
    status: "Buka",
    description:
      "Terkenal dengan penambangan belerang tradisional dan lanskap kawah berbelok yang memanjakan mata.",
    difficulty: "Sedang",
    estimatedTime: "2 Hari 1 Malam",
    price: 35000,
  },
  {
    id: "4",
    name: "Gunung Bromo",
    location: "Probolinggo / Pasuruan",
    elevation: 2329,
    status: "Buka",
    description:
      "Kawasan lautan pasir dan kaldera yang indah. Akses pendakian dan wisata relatif ramah untuk pemula.",
    difficulty: "Mudah",
    estimatedTime: "1 Hari",
    price: 40000,
  },
];

export default function DetailScreen() {
  const { darkMode } = useContext(ThemeContext);
  const { id } = useLocalSearchParams<{ id: string }>();
  const mountain = MOUNTAIN_DATA.find((item) => item.id === id);

  const theme = {
    bg: darkMode ? "#0f172a" : "#f8fafc",
    cardBg: darkMode ? "#1e293b" : "#ffffff",
    textPrimary: darkMode ? "#f8fafc" : "#0f172a",
    textSecondary: darkMode ? "#94a3b8" : "#64748b",
    border: darkMode ? "#334155" : "#cbd5e1",
  };

  if (!mountain) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.bg }]}>
        <Text style={styles.errorText}>Data gunung tidak ditemukan.</Text>
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