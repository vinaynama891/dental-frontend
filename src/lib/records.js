import { API, authHeaders } from "./auth";

// ─── Prescriptions ───────────────────────────────────────
export async function fetchPrescriptions() {
  const res = await fetch(`${API}/prescriptions`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}

export async function createPrescription(p) {
  const res = await fetch(`${API}/prescriptions`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(p),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}

export async function deletePrescription(id) {
  await fetch(`${API}/prescriptions/${id}`, { method: "DELETE", headers: authHeaders() });
}

// ─── Bills ───────────────────────────────────────────────
export async function fetchBills() {
  const res = await fetch(`${API}/bills`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}

export async function createBill(b) {
  const res = await fetch(`${API}/bills`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(b),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}

export async function deleteBill(id) {
  await fetch(`${API}/bills/${id}`, { method: "DELETE", headers: authHeaders() });
}

// ─── Helpers ─────────────────────────────────────────────
export function billTotals(b) {
  const subtotal = (b.items || []).reduce((s, it) => s + it.qty * it.rate, 0);
  const afterDiscount = Math.max(0, subtotal - (b.discount || 0));
  const tax = +(afterDiscount * ((b.taxPct || 0) / 100)).toFixed(2);
  const total = +(afterDiscount + tax).toFixed(2);
  return { subtotal, tax, total };
}

export const CLINIC = {
  name: "Dentique Dental Clinic",
  tagline: "Premium Dental Care & Smile Design",
  address: "123 Smile Avenue, Sector 21, New Delhi, India - 110001",
  phone: "+91 98765 43210",
  email: "care@dentique.com",
  website: "www.dentique.com",
  regNo: "DCI-REG-2024-DLH-1182",
};
