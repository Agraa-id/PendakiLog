import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { styles } from "../constants/styles";

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

const MOUNTAIN_DATA: MountainLog[] = [
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<FilterStatus>("Semua");

  const filteredMountains = MOUNTAIN_DATA.filter((item) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(query) ||
      item.location.toLowerCase().includes(query);
    const matchesCategory =
      selectedCategory === "Semua" || item.status === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderMountainCard = ({ item }: { item: MountainLog }) => {
    const badge = BADGE_COLORS[item.status];

    return (
      <Pressable
        style={styles.card}
        onPress={() =>
          Alert.alert(
            item.name,
            `${item.description}\n\nKetinggian: ${item.elevation} mdpl`,
          )
        }
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={styles.cardTitle}>{item.name}</Text>
          <MaterialCommunityIcons
            name="image-filter-hdr"
            size={24}
            color="#16a34a"
          />
        </View>
        <Text style={styles.cardDetail}>Lokasi: {item.location}</Text>
        <Text style={styles.cardDetail}>Ketinggian: {item.elevation} mdpl</Text>
        <View style={[styles.badge, { backgroundColor: badge.bg }]}>
          <Text style={[styles.badgeText, { color: badge.text }]}>
            Jalur {item.status}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View
      style={[
        styles.container,
        { justifyContent: "flex-start", paddingTop: 50 },
      ]}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          paddingBottom: 12,
          borderBottomWidth: 1,
          borderBottomColor: "#cbd5e1",
        }}
      >
        <View>
          <Text style={{ fontSize: 12, color: "#64748b" }}>
            Selamat Datang,
          </Text>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#0f172a" }}>
            Pendaki
          </Text>
        </View>
        <Pressable
          style={{ backgroundColor: "#ef4444", padding: 8, borderRadius: 8 }}
          onPress={() => router.replace("/")}
        >
          <Ionicons name="log-out-outline" size={20} color="white" />
        </Pressable>
      </View>

      {/* Input Search */}
      <TextInput
        style={[styles.input, { marginBottom: 12 }]}
        placeholder="Cari gunung / lokasi..."
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
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 20,
                backgroundColor: active ? "#16a34a" : "#e2e8f0",
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "600",
                  color: active ? "#ffffff" : "#475569",
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
          <Text
            style={{ textAlign: "center", color: "#94a3b8", marginTop: 20 }}
          >
            Tidak ada data gunung yang cocok.
          </Text>
        }
      />
    </View>
  );
}
