import { useLocalSearchParams, router, Stack } from "expo-router";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

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
  },
  {
    id: "3",
    name: "Gunung Welirang",
    location: "Mojokerto / Pasuruan",
    elevation: 3156,
    status: "Buka",
    description: "Terkenal dengan penambangan belerang tradisional dan lanskap kawah berbelok yang memanjakan mata.",
    difficulty: "Sedang",
    estimatedTime: "2 Hari 1 Malam",
  },
  {
    id: "4",
    name: "Gunung Bromo",
    location: "Probolinggo / Pasuruan",
    elevation: 2329,
    status: "Buka",
    description: "Kawasan lautan pasir dan kaldera yang indah. Akses pendakian dan wisata relatif ramah untuk pemula.",
    difficulty: "Mudah",
    estimatedTime: "1 Hari",
  },
];

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const mountain = MOUNTAIN_DATA.find((item) => item.id === id);

  if (!mountain) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Data gunung tidak ditemukan.</Text>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Kembali</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <Stack.Screen options={{ title: mountain.name, headerBackTitle: "Kembali" }} />

      <View style={styles.headerCard}>
        <MaterialCommunityIcons name="image-filter-hdr" size={80} color="#16a34a" />
        <Text style={styles.title}>{mountain.name}</Text>
        <Text style={styles.subtitle}>{mountain.location}</Text>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoBox}>
          <Ionicons name="speedometer-outline" size={24} color="#16a34a" />
          <Text style={styles.infoLabel}>Ketinggian</Text>
          <Text style={styles.infoValue}>{mountain.elevation} mdpl</Text>
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="time-outline" size={24} color="#16a34a" />
          <Text style={styles.infoLabel}>Estimasi</Text>
          <Text style={styles.infoValue}>{mountain.estimatedTime}</Text>
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="fitness-outline" size={24} color="#16a34a" />
          <Text style={styles.infoLabel}>Kesulitan</Text>
          <Text style={styles.infoValue}>{mountain.difficulty}</Text>
        </View>
      </View>

      <View style={styles.descCard}>
        <Text style={styles.sectionTitle}>Deskripsi Jalur</Text>
        <Text style={styles.descText}>{mountain.description}</Text>
      </View>

      <Pressable style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backBtnText}>Kembali ke Beranda</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  errorText: { fontSize: 16, color: "#ef4444", marginBottom: 12 },
  headerCard: { alignItems: "center", marginBottom: 16, padding: 20, backgroundColor: "#ffffff", borderRadius: 16 },
  title: { fontSize: 24, fontWeight: "bold", color: "#0f172a", marginTop: 8 },
  subtitle: { fontSize: 14, color: "#64748b" },
  infoSection: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16, gap: 8 },
  infoBox: { flex: 1, backgroundColor: "#ffffff", padding: 12, borderRadius: 12, alignItems: "center" },
  infoLabel: { fontSize: 10, color: "#64748b", marginTop: 4 },
  infoValue: { fontSize: 11, fontWeight: "bold", color: "#0f172a", textAlign: "center" },
  descCard: { backgroundColor: "#ffffff", padding: 16, borderRadius: 12, marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", color: "#0f172a", marginBottom: 8 },
  descText: { fontSize: 14, color: "#334155", lineHeight: 22 },
  backBtn: { backgroundColor: "#16a34a", padding: 14, borderRadius: 12, alignItems: "center" },
  backBtnText: { color: "#ffffff", fontWeight: "bold" },
});