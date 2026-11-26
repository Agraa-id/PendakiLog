// Muhammad Arief Alghifari
// 202417030110284
import type { ApiResponse } from "../types/api";
import type {
  MountainLog,
  NewMountainInput,
  OpenMeteoResponse,
  WeatherData,
} from "../types/mountain";
import { getSupabaseClient } from "./supabase";

// ---------- CUSTOM ASYNC FUNCTION ----------

export const getMountains = async (): Promise<ApiResponse<MountainLog[]>> => {
  const { data, error } = await getSupabaseClient()
    .from("mountain_logs")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    throw error;
  }
  return {
    success: true,
    data: data.map((item) => ({
      id: item.id,
      name: item.name,
      location: item.location,
      elevation: item.elevation,
      status: item.status,
      description: item.description,
      price: Number(item.price),
      difficulty: item.difficulty,
      estimatedTime: item.estimated_time,
      latitude: item.latitude ?? undefined,
      longitude: item.longitude ?? undefined,
    })),
    message: "Data gunung berhasil diambil",
  };
};

export const getMountainById = async (
  id: string
): Promise<ApiResponse<MountainLog>> => {
  const { data, error } = await getSupabaseClient()
    .from("mountain_logs")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    throw error;
  }
  return {
    success: true,
    data: {
      id: data.id,
      name: data.name,
      location: data.location,
      elevation: data.elevation,
      status: data.status,
      description: data.description,
      price: Number(data.price),
      difficulty: data.difficulty,
      estimatedTime: data.estimated_time,
      latitude: data.latitude ?? undefined,
      longitude: data.longitude ?? undefined,
    },
    message: "Data ditemukan",
  };
};

export const addMountain = async (
  input: NewMountainInput
): Promise<ApiResponse<MountainLog>> => {
  const client = getSupabaseClient();
  const {
    data: { user },
    error: userError,
  } = await client.auth.getUser();
  if (userError) {
    throw userError;
  }
  if (!user) {
    throw new Error("Sesi login tidak valid. Silakan masuk kembali.");
  }

  const { data, error } = await client
    .from("mountain_logs")
    .insert({
      ...input,
      user_id: user.id,
      description: "Catatan baru berhasil ditambahkan oleh pendaki.",
      difficulty: "Belum diketahui",
      estimated_time: "Belum diketahui",
    })
    .select("*")
    .single();
  if (error) {
    throw error;
  }
  return {
    success: true,
    data: {
      id: data.id,
      ...input,
      description: data.description,
      difficulty: data.difficulty,
      estimatedTime: data.estimated_time,
      latitude: data.latitude ?? undefined,
      longitude: data.longitude ?? undefined,
    },
    message: "Gunung ditambahkan",
  };
};

export const updateMountain = async (
  id: string,
  input: NewMountainInput,
): Promise<ApiResponse<MountainLog>> => {
  const { data, error } = await getSupabaseClient()
    .from("mountain_logs")
    .update(input)
    .eq("id", id)
    .select("*")
    .single();
  if (error) {
    throw error;
  }
  return {
    success: true,
    data: {
      id: data.id,
      ...input,
      description: data.description,
      difficulty: data.difficulty,
      estimatedTime: data.estimated_time,
      latitude: data.latitude ?? undefined,
      longitude: data.longitude ?? undefined,
    },
    message: "Data gunung berhasil diperbarui",
  };
};

export const deleteMountain = async (
  id: string
): Promise<ApiResponse<string>> => {
  const { data, error } = await getSupabaseClient()
    .from("mountain_logs")
    .delete()
    .eq("id", id)
    .select("id")
    .single();
  if (error) {
    throw error;
  }
  return { success: true, data: data.id, message: "Gunung dihapus" };
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
