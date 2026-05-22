export type UserRole = "doctor" | "patient" | "receptionist";
export interface AuthUser {
  _id: string;
  email: string;
  role: UserRole;
  name: string;
  token: string;
}

const KEY = "dental_auth_user";
export const API = "http://localhost:5000/api";

// ─── helpers ─────────────────────────────────────────────
export function getUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : null;
}

export function getToken(): string | null {
  return getUser()?.token ?? null;
}

export function logout() {
  localStorage.removeItem(KEY);
}

export function dashboardPath(role: UserRole): string {
  if (role === "doctor") return "/doctor";
  if (role === "receptionist") return "/receptionist";
  return "/patient";
}

// ─── API calls ───────────────────────────────────────────
export async function login(email: string, password: string): Promise<AuthUser> {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login failed");
  localStorage.setItem(KEY, JSON.stringify(data));
  return data as AuthUser;
}

export async function register(
  name: string,
  email: string,
  password: string,
  phone?: string
): Promise<AuthUser> {
  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, phone }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Registration failed");
  localStorage.setItem(KEY, JSON.stringify(data));
  return data as AuthUser;
}

export function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken() ?? ""}`,
  };
}
