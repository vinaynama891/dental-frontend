import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar as CalIcon, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { bookAppointment } from "@/lib/appointments";
import { getUser } from "@/lib/auth";
import { Link } from "react-router-dom";

const TIME_SLOTS = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];
const TREATMENTS = [
  "Consultation",
  "Teeth Whitening",
  "Dental Implants",
  "Root Canal",
  "Braces",
  "Cosmetic",
  "Kids Dentistry",
];

export function Appointment() {
  const user = getUser();
  // prefill if user is logged in
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState();
  const [time, setTime] = useState("");
  const [treatment, setTreatment] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to book an appointment");
      return;
    }
    if (!name || !email || !phone || !date || !time || !treatment) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      await bookAppointment({
        name,
        email,
        phone,
        date: format(date, "yyyy-MM-dd"),
        time,
        treatment,
        message,
      });
      setSuccess(true);
      toast.success("Appointment booked successfully!");
      if (!user) {
        setName("");
        setEmail("");
      }
      setPhone("");
      setDate(undefined);
      setTime("");
      setTreatment("");
      setMessage("");
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="appointment" className="relative py-24 px-4 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-block px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold mb-3">
            BOOK NOW
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold">
            Schedule your <span className="gradient-text">visit</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Pick a time that works — we'll confirm shortly.
          </p>
        </motion.div>

        {!user ? (
          <div className="glass rounded-3xl p-10 text-center shadow-soft max-w-lg mx-auto">
            <h3 className="text-2xl font-bold mb-4">Patient Login Required</h3>
            <p className="text-muted-foreground mb-6">
              You need to have an account to book an appointment with our doctors.
            </p>
            <Link to="/login">
              <Button className="gradient-bg text-white shadow-glow">
                Sign In / Register to Book
              </Button>
            </Link>
          </div>
        ) : (
          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-6 sm:p-10 shadow-soft grid sm:grid-cols-2 gap-5"
          >
            <div className="space-y-2">
              <Label>Patient Name *</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Phone *</Label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555 0100"
              />
            </div>
            <div className="space-y-2">
              <Label>Treatment *</Label>
              <Select value={treatment} onValueChange={setTreatment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select treatment" />
                </SelectTrigger>
                <SelectContent>
                  {TREATMENTS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "w-full justify-start font-normal",
                      !date && "text-muted-foreground",
                    )}
                  >
                    <CalIcon className="w-4 h-4 mr-2" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Time Slot *</Label>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Select slot" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_SLOTS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Message</Label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us about your concerns..."
                rows={3}
              />
            </div>
            <div className="sm:col-span-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              {success && (
                <div className="flex items-center gap-2 text-sm text-secondary font-semibold animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5" /> Appointment booked!
                </div>
              )}
              <Button
                type="submit"
                disabled={loading}
                size="lg"
                className="gradient-bg text-white shadow-glow ml-auto"
              >
                {loading ? "Confirming..." : "Confirm Booking"}
              </Button>
            </div>
          </motion.form>
        )}
      </div>
    </section>
  );
}
