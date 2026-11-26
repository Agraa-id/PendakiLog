import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useContext, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  View,
} from "react-native";
import ErrorMessage from "../components/ErrorMessage";
import Loading from "../components/Loading";
import { styles } from "../constants/styles";
import {
  addMountain,
  deleteMountain,
  getMountains,
  updateMountain,
} from "../services/mountainService";
import { useAuth } from "../contexts/AuthContext";
import type {
  FilterStatus,
  MountainLog,
  MountainStatus,
  NewMountainInput,
} from "../types/mountain";
import { ThemeContext } from "./_layout";

const CATEGORIES: FilterStatus[] = ["Semua", "Buka", "Waspada", "Tutup"];

const BADGE_COLORS: Record<MountainStatus, { bg: string; text: string }> = {
  Buka: { bg: "#dcfce7", text: "#15803d" },
  Waspada: { bg: "#fef3c7", text: "#b45309" },
  Tutup: { bg: "#fee2e2", text: "#b91c1c" },
};

export default function HomeScreen() {
  const { darkMode } = useContext(ThemeContext);
  const { session, signOut } = useAuth();

  const [mountains, setMountains] = useState<MountainLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<FilterStatus>("Semua");

  // State Modal Form Tambah
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [newName, setNewName] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newElevation, setNewElevation] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newStatus, setNewStatus] = useState<MountainStatus>("Buka");
  const [editingMountain, setEditingMountain] = useState<MountainLog | null>(
    null,
  );
  const [saving, setSaving] = useState(false);

  // State Modal Hapus Data
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const loadAsyncData = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError(null);
      const response = await getMountains();
      if (!response.success) {
        throw new Error(response.message);
      }
      setMountains(response.data);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAsyncData();
  }, [loadAsyncData]);

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

  const openAddModal = () => {
    setEditingMountain(null);
    setNewName("");
    setNewLocation("");
    setNewElevation("");
    setNewPrice("");
    setNewStatus("Buka");
    setIsAddModalVisible(true);
  };

  const openEditModal = (mountain: MountainLog) => {
    setEditingMountain(mountain);
    setNewName(mountain.name);
    setNewLocation(mountain.location);
    setNewElevation(String(mountain.elevation));
    setNewPrice(String(mountain.price));
    setNewStatus(mountain.status);
    setIsAddModalVisible(true);
  };

  const handleAddMountain = async () => {
    if (!newName.trim() || !newLocation.trim() || !newElevation.trim()) {
      Alert.alert("Peringatan", "Semua kolom wajib diisi!");
      return;
    }

    const elevation = Number(newElevation);
    const price = newPrice.trim() ? Number(newPrice) : 35000;
    if (!Number.isFinite(elevation) || elevation <= 0) {
      Alert.alert("Peringatan", "Ketinggian harus berupa angka positif.");
      return;
    }
    if (!Number.isFinite(price) || price < 0) {
      Alert.alert("Peringatan", "Harga tiket harus berupa angka yang valid.");
      return;
    }

    const input: NewMountainInput = {
      name: newName.trim(),
      location: newLocation.trim(),
      elevation,
      price,
      status: newStatus,
    };

    const temporaryId = `pending-${Date.now()}`;
    const previousMountain = editingMountain;
    if (previousMountain) {
      setMountains((previous) =>
        previous.map((item) =>
          item.id === previousMountain.id ? { ...item, ...input } : item,
        ),
      );
    } else {
      setMountains((previous) => [
        {
          id: temporaryId,
          ...input,
          description: "Catatan baru berhasil ditambahkan oleh pendaki.",
          difficulty: "Belum diketahui",
          estimatedTime: "Belum diketahui",
        },
        ...previous,
      ]);
    }

    try {
      setSaving(true);
      const response = previousMountain
        ? await updateMountain(previousMountain.id, input)
        : await addMountain(input);
      if (!response.success) {
        throw new Error(response.message);
      }
      setMountains((previous) =>
        previousMountain
          ? previous.map((item) =>
              item.id === previousMountain.id ? response.data : item,
            )
          : previous.map((item) =>
              item.id === temporaryId ? response.data : item,
            ),
      );
      setIsAddModalVisible(false);
      setEditingMountain(null);
      setNewName("");
      setNewLocation("");
      setNewElevation("");
      setNewPrice("");
      Alert.alert("Berhasil", response.message);
    } catch (error) {
      setMountains((previous) =>
        previousMountain
          ? previous.map((item) =>
              item.id === previousMountain.id ? previousMountain : item,
            )
          : previous.filter((item) => item.id !== temporaryId),
      );
      Alert.alert(
        previousMountain ? "Gagal memperbarui data" : "Gagal menambahkan data",
        error instanceof Error ? error.message : String(error),
      );
    } finally {
      setSaving(false);
    }
  };

  // Fungsi Hapus Gunung Spesifik dari Modal
  const handleDeleteMountain = (id: string, name: string) => {
    Alert.alert(
      "Konfirmasi Hapus",
      `Apakah Anda yakin ingin menghapus data ${name}?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            const previousIndex = mountains.findIndex(
              (item) => item.id === id,
            );
            const previousMountain = mountains[previousIndex];
            setMountains((previous) =>
              previous.filter((item) => item.id !== id),
            );
            try {
              const response = await deleteMountain(id);
              if (!response.success) {
                throw new Error(response.message);
              }
              setMountains((prev) => prev.filter((item) => item.id !== id));
              setIsDeleteModalVisible(false);
              Alert.alert("Berhasil", `Data ${name} telah dihapus.`);
            } catch (error) {
              if (previousMountain) {
                setMountains((previous) => {
                  const restored = [...previous];
                  restored.splice(
                    Math.min(previousIndex, restored.length),
                    0,
                    previousMountain,
                  );
                  return restored;
                });
              }
              Alert.alert(
                "Gagal menghapus data",
                error instanceof Error ? error.message : String(error),
              );
            }
          },
        },
      ],
    );
  };

  const renderMountainCard = ({ item }: { item: MountainLog }) => {
    const badge = BADGE_COLORS[item.status] || BADGE_COLORS["Buka"];
    const isPending = item.id.startsWith("pending-");

    return (
      <View
        style={[
          styles.card,
          { backgroundColor: theme.cardBg, borderColor: theme.border },
        ]}
      >
        <Pressable
          onPress={() => router.push(`/detail/${item.id}`)}
          disabled={isPending}
          accessibilityRole="button"
          accessibilityLabel={`Lihat detail ${item.name}`}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>
              {item.name}
            </Text>
            <MaterialCommunityIcons
              name="image-filter-hdr"
              size={24}
              color="#16a34a"
            />
          </View>

          <Text style={[styles.cardDetail, { color: theme.textSecondary }]}>
            Lokasi: {item.location}
          </Text>
          <Text style={[styles.cardDetail, { color: theme.textSecondary }]}>
            Ketinggian: {item.elevation} mdpl
          </Text>
          <Text
            style={[
              styles.cardDetail,
              { color: "#16a34a", fontWeight: "bold", marginTop: 4 },
            ]}
          >
            Tiket: Rp{" "}
            {item.price ? item.price.toLocaleString("id-ID") : "35.000"}
          </Text>

          <View style={[styles.badge, { backgroundColor: badge.bg }]}>
            <Text style={[styles.badgeText, { color: badge.text }]}>
              Jalur {item.status}
            </Text>
          </View>
        </Pressable>
        <Pressable
          onPress={() => openEditModal(item)}
          disabled={isPending}
          accessibilityRole="button"
          accessibilityLabel={`Edit ${item.name}`}
          style={{ alignSelf: "flex-end", padding: 8 }}
        >
          <Ionicons name="create-outline" size={20} color="#16a34a" />
        </Pressable>
      </View>
    );
  };

  if (loading && mountains.length === 0) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.bg,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <Loading message="Memuat data gunung..." />
      </View>
    );
  }

  if (loadError && mountains.length === 0) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.bg,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <ErrorMessage message={loadError} onRetry={loadAsyncData} />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.bg,
          justifyContent: "flex-start",
          paddingTop: 16,
        },
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
          borderBottomColor: theme.border,
        }}
      >
        <View>
          <Text style={{ fontSize: 12, color: theme.textSecondary }}>
            Selamat Datang,
          </Text>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: theme.textPrimary,
            }}
          >
            {session?.user.user_metadata?.callsign || session?.user.email || "Pendaki"}
          </Text>
        </View>

        <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
          {/* Tombol Hapus (Merah) */}
          <Pressable
            style={{ backgroundColor: "#ef4444", padding: 8, borderRadius: 8 }}
            onPress={() => setIsDeleteModalVisible(true)}
          >
            <Ionicons name="trash-outline" size={20} color="white" />
          </Pressable>

          {/* Tombol Plus (Hijau) */}
          <Pressable
            style={{ backgroundColor: "#16a34a", padding: 8, borderRadius: 8 }}
            onPress={openAddModal}
          >
            <Ionicons name="add" size={20} color="white" />
          </Pressable>

          {/* Tombol Logout */}
          <Pressable
            style={{ backgroundColor: "#64748b", padding: 8, borderRadius: 8 }}
            onPress={async () => {
              try {
                await signOut();
                router.replace("/");
              } catch (error) {
                Alert.alert(
                  "Gagal keluar",
                  error instanceof Error ? error.message : String(error),
                );
              }
            }}
          >
            <Ionicons name="log-out-outline" size={20} color="white" />
          </Pressable>
        </View>
      </View>

      {/* Input Search */}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.inputBg,
            borderColor: theme.border,
            color: theme.textPrimary,
            marginBottom: 12,
          },
        ]}
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
                backgroundColor: active
                  ? "#16a34a"
                  : darkMode
                    ? "#334155"
                    : "#e2e8f0",
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
      {loadError ? (
        <ErrorMessage message={loadError} onRetry={loadAsyncData} />
      ) : null}
      <FlatList
        data={filteredMountains}
        keyExtractor={(item) => item.id}
        renderItem={renderMountainCard}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadAsyncData} />
        }
        ListEmptyComponent={
          <Text
            style={{
              textAlign: "center",
              color: theme.textSecondary,
              marginTop: 20,
            }}
          >
            Tidak ada data gunung yang cocok.
          </Text>
        }
      />

      {/* Modal Form Tambah Gunung Baru */}
      <Modal visible={isAddModalVisible} animationType="slide" transparent>
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
              {editingMountain ? "Edit Data Gunung" : "Tambah Gunung Baru"}
            </Text>

            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.inputBg,
                  borderColor: theme.border,
                  color: theme.textPrimary,
                  marginBottom: 10,
                },
              ]}
              placeholder="Nama Gunung..."
              placeholderTextColor={theme.textSecondary}
              value={newName}
              onChangeText={setNewName}
            />
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.inputBg,
                  borderColor: theme.border,
                  color: theme.textPrimary,
                  marginBottom: 10,
                },
              ]}
              placeholder="Lokasi..."
              placeholderTextColor={theme.textSecondary}
              value={newLocation}
              onChangeText={setNewLocation}
            />
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.inputBg,
                  borderColor: theme.border,
                  color: theme.textPrimary,
                  marginBottom: 10,
                },
              ]}
              placeholder="Ketinggian (mdpl)..."
              placeholderTextColor={theme.textSecondary}
              keyboardType="numeric"
              value={newElevation}
              onChangeText={setNewElevation}
            />
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.inputBg,
                  borderColor: theme.border,
                  color: theme.textPrimary,
                  marginBottom: 16,
                },
              ]}
              placeholder="Harga Tiket (Rp)..."
              placeholderTextColor={theme.textSecondary}
              keyboardType="numeric"
              value={newPrice}
              onChangeText={setNewPrice}
            />

            <Text style={[styles.label, { color: theme.textPrimary }]}>
              Status Jalur
            </Text>
            <View
              style={{
                flexDirection: "row",
                gap: 8,
                marginBottom: 8,
              }}
            >
              {(["Buka", "Waspada", "Tutup"] as const).map((status) => (
                <Pressable
                  key={status}
                  onPress={() => setNewStatus(status)}
                  style={{
                    backgroundColor:
                      newStatus === status ? "#16a34a" : theme.border,
                    paddingHorizontal: 10,
                    paddingVertical: 8,
                    borderRadius: 16,
                  }}
                >
                  <Text
                    style={{
                      color: newStatus === status ? "#fff" : theme.textPrimary,
                      fontSize: 12,
                    }}
                  >
                    {status}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={{ flexDirection: "row", gap: 10 }}>
              <Pressable
                style={[
                  styles.primaryBtn,
                  { flex: 1, backgroundColor: "#16a34a" },
                ]}
                onPress={handleAddMountain}
                disabled={saving}
              >
                <Text style={styles.btnText}>
                  {saving
                    ? "Menyimpan..."
                    : editingMountain
                      ? "Simpan Perubahan"
                      : "Simpan"}
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.primaryBtn,
                  { flex: 1, backgroundColor: "#64748b" },
                ]}
                onPress={() => setIsAddModalVisible(false)}
                disabled={saving}
              >
                <Text style={styles.btnText}>Batal</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Pilihan Hapus Gunung */}
      <Modal visible={isDeleteModalVisible} animationType="slide" transparent>
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
              maxHeight: "70%",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: theme.textPrimary,
                marginBottom: 12,
              }}
            >
              Pilih Gunung yang Ingin Dihapus
            </Text>

            <FlatList
              data={mountains}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: theme.border,
                  }}
                >
                  <Text
                    style={{
                      color: theme.textPrimary,
                      fontWeight: "600",
                      fontSize: 15,
                    }}
                  >
                    {item.name}
                  </Text>
                  <Pressable
                    style={{
                      backgroundColor: "#ef4444",
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 8,
                    }}
                    onPress={() => handleDeleteMountain(item.id, item.name)}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "bold",
                        fontSize: 12,
                      }}
                    >
                      Hapus
                    </Text>
                  </Pressable>
                </View>
              )}
            />

            <Pressable
              style={[
                styles.primaryBtn,
                { backgroundColor: "#64748b", marginTop: 16 },
              ]}
              onPress={() => setIsDeleteModalVisible(false)}
            >
              <Text style={styles.btnText}>Tutup</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
