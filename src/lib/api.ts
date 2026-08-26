import axios from "axios";

export const api = axios.create({
  baseURL: "http://api.mvpilot.cloud:8080",
  headers: {
    Accept: "application/json",
  },
  timeout: 10 * 60 * 1000,
});
