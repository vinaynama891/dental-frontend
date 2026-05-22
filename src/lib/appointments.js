import { API, authHeaders } from "./auth";

export async function fetchAppointments() {
  const res = await fetch(`${API}/appointments`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to load appointments");
  return data;
}

export async function bookAppointment(payload) {
  const res = await fetch(`${API}/appointments`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to book appointment");
  return data;
}

export async function updateAppointmentStatus(id, status, extra) {
  const res = await fetch(`${API}/appointments/${id}/status`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ status, ...extra }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update appointment");
  return data;
}

export async function cancelAppointment(id) {
  const res = await fetch(`${API}/appointments/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Failed to cancel appointment");
  }
}
