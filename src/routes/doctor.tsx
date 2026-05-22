import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, CalendarCheck, Clock, DollarSign, Search, LogOut, Check, X, CheckCheck, Stethoscope, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { fetchAppointments, updateAppointmentStatus, type Appointment, type AppointmentStatus } from "@/lib/appointments";
import { getUser, logout } from "@/lib/auth";
import { fetchBills, billTotals, type Bill } from "@/lib/records";
import { toast } from "sonner";

export const Route = createFileRoute("/doctor")({
  head: () => ({ meta: [{ title: "Doctor Dashboard — Dentique" }] }),
  component: DoctorDashboard,
});

function DoctorDashboard() {
  const nav = useNavigate();
  const [list, setList] = useState<Appointment[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  // Reschedule state
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [rDate, setRDate] = useState("");
  const [rTime, setRTime] = useState("");
  const [rNote, setRNote] = useState("");

  const loadData = async () => {
    try {
      const [apptData, billsData] = await Promise.all([fetchAppointments(), fetchBills()]);
      setList(apptData);
      setBills(billsData);
    } catch (err) {
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const u = getUser();
    if (!u || u.role !== "doctor") { nav({ to: "/login" }); return; }
    loadData();
  }, [nav]);

  const setStatus = async (id: string, s: AppointmentStatus) => {
    try {
      await updateAppointmentStatus(id, s);
      toast.success(`Marked as ${s}`);
      loadData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppt) return;
    try {
      await updateAppointmentStatus(selectedAppt._id, "Rescheduled", {
        rescheduledDate: rDate,
        rescheduledTime: rTime,
        doctorNote: rNote
      });
      toast.success("Appointment rescheduled");
      setRescheduleOpen(false);
      loadData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const openReschedule = (a: Appointment) => {
    setSelectedAppt(a);
    setRDate(a.date);
    setRTime(a.time);
    setRNote("");
    setRescheduleOpen(true);
  };

  const filtered = list.filter(a =>
    (filter === "all" || a.status === filter) &&
    (q === "" || a.name.toLowerCase().includes(q.toLowerCase()) || a.email.toLowerCase().includes(q.toLowerCase()))
  );

  const stats = [
    { icon: Users, label: "Total Patients", value: new Set(list.map(a => a.email)).size, color: "from-sky-500 to-blue-600" },
    { icon: CalendarCheck, label: "Total Appointments", value: list.length, color: "from-teal-500 to-emerald-600" },
    { icon: Clock, label: "Pending", value: list.filter(a => a.status === "Pending").length, color: "from-amber-500 to-orange-600" },
    { icon: DollarSign, label: "Total Revenue", value: `₹${bills.reduce((sum, b) => sum + billTotals(b).total, 0).toFixed(0)}`, color: "from-fuchsia-500 to-pink-600" },
  ];

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <header className="glass rounded-2xl p-4 flex items-center justify-between mb-6 shadow-soft">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center"><Stethoscope className="w-5 h-5 text-white" /></div>
          <div><div className="font-bold">Dentique</div><div className="text-xs text-muted-foreground">Doctor Dashboard</div></div>
        </Link>
        <Button variant="outline" size="sm" onClick={() => { logout(); nav({ to: "/" }); }}><LogOut className="w-4 h-4 mr-2" />Logout</Button>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="glass rounded-2xl p-5 shadow-soft hover:scale-105 transition">
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}><s.icon className="w-5 h-5 text-white" /></div>
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="glass rounded-2xl p-6 shadow-soft">
        <div className="flex flex-col sm:flex-row gap-3 justify-between mb-5">
          <h2 className="text-xl font-bold">Appointments</h2>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search patients..." value={q} onChange={e => setQ(e.target.value)} className="pl-10 w-56" />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rescheduled">Rescheduled</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <CalendarCheck className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>No appointments found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(a => <AppointmentRow key={a._id} a={a} onStatus={setStatus} onReschedule={openReschedule} />)}
          </div>
        )}
      </div>

      {/* Reschedule Dialog */}
      <Dialog open={rescheduleOpen} onOpenChange={setRescheduleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule Appointment</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRescheduleSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>New Date</Label>
                <Input type="date" required value={rDate} onChange={e => setRDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>New Time</Label>
                <Input type="time" required value={rTime} onChange={e => setRTime(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Doctor's Note (Optional)</Label>
              <Textarea value={rNote} onChange={e => setRNote(e.target.value)} placeholder="Reason for reschedule..." />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setRescheduleOpen(false)}>Cancel</Button>
              <Button type="submit" className="gradient-bg text-white">Confirm Reschedule</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function statusColor(s: AppointmentStatus) {
  return s === "Pending" ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
    : s === "Approved" ? "bg-sky-500/15 text-sky-700 dark:text-sky-300"
    : s === "Completed" ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
    : s === "Rescheduled" ? "bg-purple-500/15 text-purple-700 dark:text-purple-300"
    : "bg-rose-500/15 text-rose-700 dark:text-rose-300";
}

function AppointmentRow({ a, onStatus, onReschedule }: { a: Appointment; onStatus: (id: string, s: AppointmentStatus) => void; onReschedule: (a: Appointment) => void }) {
  return (
    <div className="rounded-xl border bg-background/40 p-4 flex flex-col lg:flex-row lg:items-center gap-4 hover:shadow-soft transition">
      <div className="flex-1 grid sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
        <div><div className="font-semibold">{a.name}</div><div className="text-xs text-muted-foreground">{a.email}</div></div>
        <div><div className="text-muted-foreground text-xs">Treatment</div><div className="font-medium">{a.treatment}</div></div>
        <div>
          <div className="text-muted-foreground text-xs">Date & Time</div>
          <div className="font-medium">
            {a.status === "Rescheduled" ? (
              <span className="text-purple-600 line-through mr-2 opacity-50">{a.date} {a.time}</span>
            ) : null}
            {a.status === "Rescheduled" ? `${a.rescheduledDate} • ${a.rescheduledTime}` : `${a.date} • ${a.time}`}
          </div>
        </div>
        <div><Badge className={statusColor(a.status)}>{a.status}</Badge></div>
      </div>
      <div className="flex gap-2">
        {a.status === "Pending" && <>
          <Button size="sm" variant="outline" title="Approve" onClick={() => onStatus(a._id, "Approved")}><Check className="w-4 h-4" /></Button>
          <Button size="sm" variant="outline" title="Reschedule" onClick={() => onReschedule(a)}><CalendarClock className="w-4 h-4" /></Button>
          <Button size="sm" variant="outline" title="Reject" onClick={() => onStatus(a._id, "Rejected")}><X className="w-4 h-4" /></Button>
        </>}
        {a.status === "Approved" && <>
           <Button size="sm" className="gradient-bg text-white" onClick={() => onStatus(a._id, "Completed")}><CheckCheck className="w-4 h-4 mr-1" />Complete</Button>
           <Button size="sm" variant="outline" title="Reschedule" onClick={() => onReschedule(a)}><CalendarClock className="w-4 h-4" /></Button>
        </>}
        {a.status === "Rescheduled" && <>
           <Button size="sm" className="gradient-bg text-white" onClick={() => onStatus(a._id, "Completed")}><CheckCheck className="w-4 h-4 mr-1" />Complete</Button>
        </>}
      </div>
    </div>
  );
}
