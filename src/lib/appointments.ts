import { API, authHeaders } from "./auth";

export type AppointmentStatus = "Pending" | "Approved" | "Completed" | "Rejected" | "Rescheduled";

export interface Appointment {
  _id: string;
  patientId: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  treatment: string;
  message?: string;
  status: AppointmentStatus;
  rescheduledDate?: string;
  rescheduledTime?: string;
  doctorNote?: string;
  createdAt: string;
}

export async function fetchAppointments(): Promise<Appointment[]> {
  const res = await fetch(`${API}/appointments`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to load appointments");
  return data;
}

export async function bookAppointment(
  payload: Omit<Appointment, "_id" | "patientId" | "status" | "createdAt" | "rescheduledDate" | "rescheduledTime" | "doctorNote">
): Promise<Appointment> {
  const res = await fetch(`${API}/appointments`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to book appointment");
  return data;
}

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus,
  extra?: { doctorNote?: string; rescheduledDate?: string; rescheduledTime?: string }
): Promise<Appointment> {
  const res = await fetch(`${API}/appointments/${id}/status`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ status, ...extra }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update appointment");
  return data;
}

export async function cancelAppointment(id: string): Promise<void> {
  const res = await fetch(`${API}/appointments/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Failed to cancel appointment");
  }
}
