import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  type AxiosError,
} from "axios";
import type { ApiErrorResponse } from "@/types/audit.types";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

export const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error: unknown) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: unknown) => {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const customError =
      axiosError.response?.data?.message ||
      axiosError.response?.data?.error ||
      axiosError.message ||
      "An unexpected network error occurred";
    return Promise.reject(new Error(customError));
  },
);
