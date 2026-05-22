const KEY = "dental_auth_user";
export const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ─── helpers ─────────────────────────────────────────────
export function getUser() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : null;
}

export function getToken() {
  return getUser()?.token ?? null;
}

export function logout() {
  localStorage.removeItem(KEY);
}

export function dashboardPath(role) {
  if (role === "doctor") return "/doctor";
  if (role === "receptionist") return "/receptionist";
  return "/patient";
}

// ─── API calls ───────────────────────────────────────────
export async function login(email, password) {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login failed");
  localStorage.setItem(KEY, JSON.stringify(data));
  return data;
}

export async function register(name, email, password, phone) {
  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, phone }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Registration failed");
  localStorage.setItem(KEY, JSON.stringify(data));
  return data;
}

export function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken() ?? ""}`,
  };
}
