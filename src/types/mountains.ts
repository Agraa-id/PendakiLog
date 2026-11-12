export interface Mountain {
  id: number;
  name: string;
  location: string;
  height: string;
  status: string; // "Open" | "Closed"
  image: string;
  description: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}
