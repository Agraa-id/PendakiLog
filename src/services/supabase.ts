import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import type { Database } from "../types/database";

const webSessionStorage = new Map<string, string>();

const authStorage = {
  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === "web") {
      return webSessionStorage.get(key) ?? null;
    }
    return SecureStore.getItemAsync(key);
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === "web") {
      webSessionStorage.set(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },
  removeItem: async (key: string): Promise<void> => {
    if (Platform.OS === "web") {
      webSessionStorage.delete(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const SUPABASE_CONFIG_ERROR =
  "Konfigurasi Supabase belum tersedia. Isi EXPO_PUBLIC_SUPABASE_URL dan EXPO_PUBLIC_SUPABASE_ANON_KEY di .env.local, lalu mulai ulang aplikasi.";

export const supabase: SupabaseClient<Database> | null =
  supabaseUrl && supabaseAnonKey
    ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: authStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
      })
    : null;

export function getSupabaseClient(): SupabaseClient<Database> {
  if (!supabase) {
    throw new Error(SUPABASE_CONFIG_ERROR);
  }
  return supabase;
}
