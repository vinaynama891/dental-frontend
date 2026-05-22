import { API, authHeaders } from "./auth";

export interface Prescription {
  _id: string;
  rxNo: string;
  patientName: string;
  age: string;
  gender: string;
  phone: string;
  date: string;
  diagnosis: string;
  advice: string;
  nextVisit?: string;
  doctor: string;
  createdAt: string;
}

export interface BillItem {
  description: string;
  qty: number;
  rate: number;
}

export interface Bill {
  _id: string;
  invoiceNo: string;
  patientName: string;
  phone: string;
  date: string;
  items: BillItem[];
  discount: number;
  taxPct: number;
  paymentMode: string;
  notes?: string;
  createdAt: string;
}

// ─── Prescriptions ───────────────────────────────────────
export async function fetchPrescriptions(): Promise<Prescription[]> {
  const res = await fetch(`${API}/prescriptions`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}

export async function createPrescription(
  p: Omit<Prescription, "_id" | "rxNo" | "createdAt">
): Promise<Prescription> {
  const res = await fetch(`${API}/prescriptions`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(p),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}

export async function deletePrescription(id: string): Promise<void> {
  await fetch(`${API}/prescriptions/${id}`, { method: "DELETE", headers: authHeaders() });
}

// ─── Bills ───────────────────────────────────────────────
export async function fetchBills(): Promise<Bill[]> {
  const res = await fetch(`${API}/bills`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}

export async function createBill(
  b: Omit<Bill, "_id" | "invoiceNo" | "createdAt">
): Promise<Bill> {
  const res = await fetch(`${API}/bills`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(b),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}

export async function deleteBill(id: string): Promise<void> {
  await fetch(`${API}/bills/${id}`, { method: "DELETE", headers: authHeaders() });
}

// ─── Helpers ─────────────────────────────────────────────
export function billTotals(b: Pick<Bill, "items" | "discount" | "taxPct">) {
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
