export type MountainStatus = "Buka" | "Waspada" | "Tutup";
export type FilterStatus = "Semua" | MountainStatus;

// Interface data gunung (dipakai di Home, Detail, dan service)
export interface MountainLog {
  readonly id: string;
  name: string;
  location: string;
  elevation: number;
  status: MountainStatus;
  description: string;
  price: number;
  difficulty: string;
  estimatedTime: string;
  // Opsional: gunung yang ditambah manual tidak punya koordinat
  latitude?: number;
  longitude?: number;
}

// Data yang dikirim saat menambah gunung baru
export type NewMountainInput = Pick<
  MountainLog,
  "name" | "location" | "elevation" | "price" | "status"
>;

// Bentuk mentah respons Open-Meteo (API eksternal)
export interface OpenMeteoResponse {
  current: {
    temperature_2m: number;
    wind_speed_10m: number;
    weather_code: number;
  };
}

// Bentuk data cuaca yang dipakai aplikasi
export interface WeatherData {
  temperature: number; // °C
  windSpeed: number; // km/jam
  condition: string; // deskripsi, mis. "Hujan"
}
