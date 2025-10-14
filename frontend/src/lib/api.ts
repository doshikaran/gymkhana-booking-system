// src/lib/api.ts

import axios from "axios";
import { getToken } from "./auth";
import { API_BASE } from "./constants";

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const t = getToken();
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});
