// Bentuk respons standar dari "server" (sesuai Modul 3: ApiResponse<T>)
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}
