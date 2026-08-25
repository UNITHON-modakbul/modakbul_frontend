import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://api.mvpilot.cloud:8080",
  headers: {
    Accept: "application/json",
  },
  timeout: 10 * 60 * 1000,
});
