import type { ApiResponse } from "../types/api";
import type {
  MountainLog,
  NewMountainInput,
  OpenMeteoResponse,
  WeatherData,
} from "../types/mountain";
import { delay } from "../utils/delay";

// Ubah ke true untuk mensimulasikan server down (memicu reject)
const SIMULATE_SERVER_DOWN = false;

// "Database" di server (simulasi). Dipakai bersama oleh Home & Detail.
let mountainDb: MountainLog[] = [
  {
    id: "1",
    name: "Gunung Arjuno",
    location: "Malang / Pasuruan",
    elevation: 3339,
    status: "Buka",
    description:
      "Memiliki jalur ikonik via Purwosari dan Sumberawan. Terkenal dengan situs sejarah dan pemandangan kawah Welirang.",
    price: 35000,
    difficulty: "Sedang - Sulit",
    estimatedTime: "2 Hari 1 Malam",
    latitude: -7.7494,
    longitude: 112.5875,
  },
  {
    id: "2",
    name: "Gunung Semeru",
    location: "Lumajang / Malang",
    elevation: 3676,
    status: "Waspada",
    description:
      "Atap pulau Jawa dengan puncak Mahameru. Aktivitas vulkanik saat ini dipantau secara berkala oleh PVMBG.",
    price: 50000,
    difficulty: "Sulit",
    estimatedTime: "3 Hari 2 Malam",
    latitude: -8.1077,
    longitude: 112.9222,
  },
  {
    id: "3",
    name: "Gunung Welirang",
    location: "Mojokerto / Pasuruan",
    elevation: 3156,
    status: "Buka",
    description:
      "Terkenal dengan penambangan belerang tradisional dan lanskap kawah berbelok yang memanjakan mata.",
    price: 35000,
    difficulty: "Sedang",
    estimatedTime: "2 Hari 1 Malam",
    latitude: -7.7333,
    longitude: 112.6333,
  },
  {
    id: "4",
    name: "Gunung Bromo",
    location: "Probolinggo / Pasuruan",
    elevation: 2329,
    status: "Buka",
    description:
      "Kawasan lautan pasir dan kaldera yang indah. Akses pendakian dan wisata relatif ramah untuk pemula.",
    price: 40000,
    difficulty: "Mudah",
    estimatedTime: "1 Hari",
    latitude: -7.9425,
    longitude: 112.953,
  },
];

// ---------- CUSTOM ASYNC FUNCTION ----------

// Ambil semua gunung. Pakai async/await + new Promise (resolve/reject).
export const getMountains = async (): Promise<ApiResponse<MountainLog[]>> => {
  await delay(1000); // simulasi server lambat

  return new Promise((resolve, reject) => {
    if (SIMULATE_SERVER_DOWN) {
      reject("Server sedang down. Coba lagi nanti.");
      return;
    }
    resolve({
      success: true,
      data: [...mountainDb],
      message: "Data gunung berhasil diambil",
    });
  });
};

// Ambil satu gunung berdasarkan id. Reject jika tidak ditemukan.
export const getMountainById = async (
  id: string
): Promise<ApiResponse<MountainLog>> => {
  await delay(800);

  return new Promise((resolve, reject) => {
    const found = mountainDb.find((item) => item.id === id);
    if (SIMULATE_SERVER_DOWN) {
      reject("Server sedang down. Coba lagi nanti.");
    } else if (!found) {
      reject("Data gunung tidak ditemukan.");
    } else {
      resolve({ success: true, data: found, message: "Data ditemukan" });
    }
  });
};

// Tambah gunung baru ke "database".
export const addMountain = async (
  input: NewMountainInput
): Promise<ApiResponse<MountainLog>> => {
  await delay(600);

  return new Promise((resolve, reject) => {
    if (SIMULATE_SERVER_DOWN) {
      reject("Gagal menyimpan data. Server sedang down.");
      return;
    }
    const newItem: MountainLog = {
      id: Date.now().toString(),
      ...input,
      description: "Catatan baru berhasil ditambahkan oleh pendaki.",
      difficulty: "Belum diketahui",
      estimatedTime: "Belum diketahui",
    };
    mountainDb = [newItem, ...mountainDb];
    resolve({ success: true, data: newItem, message: "Gunung ditambahkan" });
  });
};

// Hapus gunung dari "database".
export const deleteMountain = async (
  id: string
): Promise<ApiResponse<string>> => {
  await delay(600);

  return new Promise((resolve, reject) => {
    const exists = mountainDb.some((item) => item.id === id);
    if (SIMULATE_SERVER_DOWN || !exists) {
      reject("Gagal menghapus data.");
      return;
    }
    mountainDb = mountainDb.filter((item) => item.id !== id);
    resolve({ success: true, data: id, message: "Gunung dihapus" });
  });
};

// ---------- API EKSTERNAL (Open-Meteo, tanpa API key) ----------

// Kode cuaca WMO -> teks Indonesia
const describeWeather = (code: number): string => {
  if (code === 0) return "Cerah";
  if (code <= 3) return "Cerah berawan";
  if (code <= 48) return "Berkabut";
  if (code <= 57) return "Gerimis";
  if (code <= 67) return "Hujan";
  if (code <= 77) return "Salju";
  if (code <= 82) return "Hujan deras";
  return "Badai petir";
};

// Ubah respons mentah API -> data yang dipakai aplikasi
const toWeatherData = (json: OpenMeteoResponse): WeatherData => ({
  temperature: json.current.temperature_2m,
  windSpeed: json.current.wind_speed_10m,
  condition: describeWeather(json.current.weather_code),
});

// Ambil cuaca puncak. fetch() = async function bawaan (pre-built),
// dibungkus new Promise supaya bisa memakai .then(), resolve(), reject().
export const getWeather = (
  latitude: number,
  longitude: number,
  elevation: number
): Promise<WeatherData> => {
  const url =
    "https://api.open-meteo.com/v1/forecast" +
    `?latitude=${latitude}&longitude=${longitude}&elevation=${elevation}` +
    "&current=temperature_2m,wind_speed_10m,weather_code";

  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => {
        if (response.ok) {
          resolve(response.json().then(toWeatherData));
        } else {
          reject(`Server cuaca error (status ${response.status})`);
        }
      })
      .catch(() => reject("Tidak ada koneksi internet"));
  });
};
