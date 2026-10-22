import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useContext, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { styles } from "../constants/styles";
import { ThemeContext } from "./_layout"; // Import Context

type MountainStatus = "Buka" | "Waspada" | "Tutup";
type FilterStatus = "Semua" | MountainStatus;

interface MountainLog {
  readonly id: string;
  name: string;
  location: string;
  elevation: number;
  status: MountainStatus;
  description: string;
}

const CATEGORIES: FilterStatus[] = ["Semua", "Buka", "Waspada", "Tutup"];

const BADGE_COLORS: Record<MountainStatus, { bg: string; text: string }> = {
  Buka: { bg: "#dcfce7", text: "#15803d" },
  Waspada: { bg: "#fef3c7", text: "#b45309" },
  Tutup: { bg: "#fee2e2", text: "#b91c1c" },
};

const INITIAL_MOUNTAIN_DATA: MountainLog[] = [
  {
    id: "1",
    name: "Gunung Arjuno",
    location: "Malang / Pasuruan",
    elevation: 3339,
    status: "Buka",
    description: "Memiliki jalur ikonik via Purwosari dan Sumberawan.",
  },
  {
    id: "2",
    name: "Gunung Semeru",
    location: "Lumajang / Malang",
    elevation: 3676,
    status: "Waspada",
    description: "Atap pulau Jawa. Aktivitas vulkanik sedang dipantau.",
  },
  {
    id: "3",
    name: "Gunung Welirang",
    location: "Mojokerto / Pasuruan",
    elevation: 3156,
    status: "Buka",
    description: "Terkenal dengan penambangan belerang tradisional.",
  },
  {
    id: "4",
    name: "Gunung Bromo",
    location: "Probolinggo / Pasuruan",
    elevation: 2329,
    status: "Buka",
    description: "Kawasan lautan pasir dan kaldera yang indah.",
  },
];

export default function HomeScreen() {
  // Ambil state darkMode dari ThemeContext
  const { darkMode } = useContext(ThemeContext);

  const [mountains, setMountains] = useState<MountainLog[]>(INITIAL_MOUNTAIN_DATA);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<FilterStatus>("Semua");

  // State Modal Form
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newName, setNewName] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newElevation, setNewElevation] = useState("");
  const [newStatus, setNewStatus] = useState<MountainStatus>("Buka");

  // Palette warna dinamis berdasarkan Dark Mode
  const theme = {
    bg: darkMode ? "#0f172a" : "#f8fafc",
    cardBg: darkMode ? "#1e293b" : "#ffffff",
    textPrimary: darkMode ? "#f8fafc" : "#0f172a",
    textSecondary: darkMode ? "#94a3b8" : "#64748b",
    border: darkMode ? "#334155" : "#cbd5e1",
    inputBg: darkMode ? "#1e293b" : "#ffffff",
  };

  const filteredMountains = mountains.filter((item) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(query) ||
      item.location.toLowerCase().includes(query);
    const matchesCategory =
      selectedCategory === "Semua" || item.status === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddMountain = () => {
    if (!newName.trim() || !newLocation.trim() || !newElevation.trim()) {
      Alert.alert("Peringatan", "Semua kolom wajib diisi!");
      return;
    }

    const newItem: MountainLog = {
      id: Date.now().toString(),
      name: newName,
      location: newLocation,
      elevation: Number(newElevation) || 0,
      status: newStatus,
      description: "Catatan baru berhasil ditambahkan oleh pendaki.",
    };

    setMountains([newItem, ...mountains]);
    setIsModalVisible(false);
    setNewName("");
    setNewLocation("");
    setNewElevation("");
    Alert.alert("Berhasil", "Data gunung baru telah ditambahkan!");
  };

  const renderMountainCard = ({ item }: { item: MountainLog }) => {
    const badge = BADGE_COLORS[item.status];

    return (
      <Pressable
        style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.border }]}
        onPress={() => router.push(`/detail/${item.id}`)}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>{item.name}</Text>
          <MaterialCommunityIcons
            name="image-filter-hdr"
            size={24}
            color="#16a34a"
          />
        </View>
        <Text style={[styles.cardDetail, { color: theme.textSecondary }]}>Lokasi: {item.location}</Text>
        <Text style={[styles.cardDetail, { color: theme.textSecondary }]}>Ketinggian: {item.elevation} mdpl</Text>
        <View style={[styles.badge, { backgroundColor: badge.bg }]}>
          <Text style={[styles.badgeText, { color: badge.text }]}>
            Jalur {item.status}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg, justifyContent: "flex-start", paddingTop: 16 }]}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          paddingBottom: 12,
          borderBottomWidth: 1,
          borderBottomColor: theme.border,
        }}
      >
        <View>
          <Text style={{ fontSize: 12, color: theme.textSecondary }}>Selamat Datang,</Text>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: theme.textPrimary }}>
            Pendaki
          </Text>
        </View>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Pressable
            style={{ backgroundColor: "#16a34a", padding: 8, borderRadius: 8 }}
            onPress={() => setIsModalVisible(true)}
          >
            <Ionicons name="add" size={20} color="white" />
          </Pressable>
          <Pressable
            style={{ backgroundColor: "#ef4444", padding: 8, borderRadius: 8 }}
            onPress={() => router.replace("/")}
          >
            <Ionicons name="log-out-outline" size={20} color="white" />
          </Pressable>
        </View>
      </View>

      {/* Input Search */}
      <TextInput
        style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.textPrimary, marginBottom: 12 }]}
        placeholder="Cari gunung / lokasi..."
        placeholderTextColor={theme.textSecondary}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Filter Category */}
      <View style={{ flexDirection: "row", gap: 8, marginBottom: 16 }}>
        {CATEGORIES.map((cat) => {
          const active = selectedCategory === cat;
          return (
            <Pressable
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor: active ? "#16a34a" : darkMode ? "#334155" : "#e2e8f0",
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "600",
                  color: active ? "#ffffff" : theme.textPrimary,
                }}
              >
                {cat}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Daftar Gunung */}
      <FlatList
        data={filteredMountains}
        keyExtractor={(item) => item.id}
        renderItem={renderMountainCard}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", color: theme.textSecondary, marginTop: 20 }}>
            Tidak ada data gunung yang cocok.
          </Text>
        }
      />

      {/* Modal Form Tambah Gunung Baru */}
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.6)",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: theme.cardBg,
              borderRadius: 16,
              padding: 20,
              borderWidth: 1,
              borderColor: theme.border,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: theme.textPrimary,
                marginBottom: 16,
              }}
            >
              Tambah Gunung Baru
            </Text>

            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.textPrimary, marginBottom: 10 }]}
              placeholder="Nama Gunung..."
              placeholderTextColor={theme.textSecondary}
              value={newName}
              onChangeText={setNewName}
            />
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.textPrimary, marginBottom: 10 }]}
              placeholder="Lokasi..."
              placeholderTextColor={theme.textSecondary}
              value={newLocation}
              onChangeText={setNewLocation}
            />
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.textPrimary, marginBottom: 16 }]}
              placeholder="Ketinggian (mdpl)..."
              placeholderTextColor={theme.textSecondary}
              keyboardType="numeric"
              value={newElevation}
              onChangeText={setNewElevation}
            />

            <View style={{ flexDirection: "row", gap: 10 }}>
              <Pressable
                style={[
                  styles.primaryBtn,
                  { flex: 1, backgroundColor: "#16a34a" },
                ]}
                onPress={handleAddMountain}
              >
                <Text style={styles.btnText}>Simpan</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.primaryBtn,
                  { flex: 1, backgroundColor: "#64748b" },
                ]}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.btnText}>Batal</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}