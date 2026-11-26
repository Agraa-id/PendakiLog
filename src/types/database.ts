import type { MountainStatus } from "./mountain";

export interface Database {
  public: {
    Tables: {
      mountain_logs: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          location: string;
          elevation: number;
          status: MountainStatus;
          description: string;
          price: number;
          difficulty: string;
          estimated_time: string;
          latitude: number | null;
          longitude: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          location: string;
          elevation: number;
          status: MountainStatus;
          description: string;
          price: number;
          difficulty: string;
          estimated_time: string;
          latitude?: number | null;
          longitude?: number | null;
          created_at?: string;
        };
        Update: {
          name?: string;
          location?: string;
          elevation?: number;
          status?: MountainStatus;
          price?: number;
          description?: string;
          difficulty?: string;
          estimated_time?: string;
          latitude?: number | null;
          longitude?: number | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
