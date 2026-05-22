import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CalendarCheck, LogOut, Stethoscope, User, Bell, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchAppointments, cancelAppointment } from "@/lib/appointments";
import { getUser, logout } from "@/lib/auth";
import { toast } from "sonner";

function statusColor(s) {
  return s === "Pending"
    ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
    : s === "Approved"
      ? "bg-sky-500/15 text-sky-700 dark:text-sky-300"
      : s === "Completed"
        ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
        : s === "Rescheduled"
          ? "bg-purple-500/15 text-purple-700 dark:text-purple-300"
          : "bg-rose-500/15 text-rose-700 dark:text-rose-300";
}

export default function PatientDashboard() {
  const nav = useNavigate();
  const [user, setUser] = useState(null);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const data = await fetchAppointments();
      setList(data);
    } catch (err) {
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const u = getUser();
    if (!u) {
      nav("/login");
      return;
    }
    setUser(u);
    loadData();
  }, [nav]);

  const cancel = async (id) => {
    try {
      await cancelAppointment(id);
      toast.success("Appointment cancelled");
      loadData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <header className="glass rounded-2xl p-4 flex items-center justify-between mb-6 shadow-soft">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold">Dentique</div>
            <div className="text-xs text-muted-foreground">My Dashboard</div>
          </div>
        </Link>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            logout();
            nav("/");
          }}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </header>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 shadow-soft"
        >
          <div className="w-20 h-20 rounded-full gradient-bg mx-auto flex items-center justify-center mb-4">
            <User className="w-10 h-10 text-white" />
          </div>
          <div className="text-center">
            <div className="font-bold text-lg capitalize">{user?.name}</div>
            <div className="text-sm text-muted-foreground">{user?.email}</div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 text-center">
            <div className="rounded-xl bg-accent/50 p-3">
              <div className="text-2xl font-bold">{list.length}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
            <div className="rounded-xl bg-accent/50 p-3">
              <div className="text-2xl font-bold">
                {list.filter((a) => a.status === "Completed").length}
              </div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
          </div>
          <div className="mt-6">
            <div className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </div>
            <div className="text-xs text-muted-foreground bg-accent/30 rounded-lg p-3">
              {list.find((a) => a.status === "Rescheduled")
                ? `Doctor has rescheduled an appointment. Please check below.`
                : `Your next appointment reminder will appear here.`}
            </div>
          </div>
        </motion.div>

        <div className="lg:col-span-2 glass rounded-2xl p-6 shadow-soft">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold">My Appointments</h2>
            <Link to="/#appointment">
              <Button size="sm" className="gradient-bg text-white">
                + New
              </Button>
            </Link>
          </div>
          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : list.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <CalendarCheck className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p>No appointments yet.</p>
              <Link
                to="/#appointment"
                className="text-primary text-sm font-medium mt-2 inline-block"
              >
                Book your first visit →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {list.map((a) => (
                <div
                  key={a._id}
                  className="rounded-xl border bg-background/40 p-4 flex flex-col sm:flex-row sm:items-center gap-3"
                >
                  <div className="flex-1">
                    <div className="font-semibold">{a.treatment}</div>
                    <div className="text-sm mt-1">
                      {a.status === "Rescheduled" ? (
                        <>
                          <span className="line-through text-muted-foreground mr-2">
                            {a.date} • {a.time}
                          </span>
                          <span className="text-purple-600 font-medium">
                            {a.rescheduledDate} • {a.rescheduledTime}
                          </span>
                        </>
                      ) : (
                        <span className="text-muted-foreground">
                          {a.date} • {a.time}
                        </span>
                      )}
                    </div>
                    {a.doctorNote && (
                      <div className="text-xs mt-2 bg-accent p-2 rounded">
                        <strong>Note from Doctor:</strong> {a.doctorNote}
                      </div>
                    )}
                  </div>
                  <Badge className={statusColor(a.status)}>{a.status}</Badge>
                  {a.status === "Pending" && (
                    <Button size="sm" variant="outline" onClick={() => cancel(a._id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
