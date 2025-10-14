//src/lib/auth.ts
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "access_token";
const COOKIE_EXPIRY_DAYS = 15;

interface DecodedToken {
  exp?: number; // expiration time (in seconds)
  iat?: number; // issued-at timestamp (optional)
  [key: string]: unknown; // any other JWT claims you might have
}

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY) || Cookies.get(TOKEN_KEY) || null;
}

export function setToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  Cookies.set(TOKEN_KEY, token, { expires: COOKIE_EXPIRY_DAYS }); // add set true for https later
}

export function clearToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  Cookies.remove(TOKEN_KEY);
}

export function isTokenExpired(token: string | null): boolean {
  if (!token) return true;
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    if (!decoded.exp) return false;
    const now = Date.now() / 1000; // seconds
    return decoded.exp < now;
  } catch {
    return true;
  }
}
