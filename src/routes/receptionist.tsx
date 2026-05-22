import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Receipt, Plus, Trash2, Printer, LogOut, Stethoscope, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { getUser, logout } from "@/lib/auth";
import {
  CLINIC, createBill, createPrescription, billTotals, fetchBills, fetchPrescriptions,
  deleteBill, deletePrescription, type Bill, type BillItem, type Prescription,
} from "@/lib/records";

export const Route = createFileRoute("/receptionist")({
  head: () => ({ meta: [{ title: "Receptionist Dashboard — Dentique" }] }),
  component: ReceptionistPage,
});

function ReceptionistPage() {
  const nav = useNavigate();
  const [user, setUser] = useState(getUser());
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [printRx, setPrintRx] = useState<Prescription | null>(null);
  const [printBill, setPrintBill] = useState<Bill | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [rx, b] = await Promise.all([fetchPrescriptions(), fetchBills()]);
      setPrescriptions(rx);
      setBills(b);
    } catch (err: any) {
      toast.error(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const u = getUser();
    if (!u || u.role !== "receptionist") {
      toast.error("Receptionist access required");
      nav({ to: "/login" });
      return;
    }
    setUser(u);
    loadData();
  }, [nav]);

  if (!user) return null;

  if (printRx) return <PrintPrescription rx={printRx} onBack={() => setPrintRx(null)} />;
  if (printBill) return <PrintBill bill={printBill} onBack={() => setPrintBill(null)} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/30">
      <div className="blob w-[500px] h-[500px] bg-primary -top-32 -right-32 animate-float opacity-40" />
      <div className="blob w-[400px] h-[400px] bg-secondary -bottom-32 -left-32 animate-float opacity-40" style={{ animationDelay: "3s" }} />

      <header className="relative z-10 border-b bg-background/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shadow-glow">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold leading-tight">Dentique</div>
              <div className="text-xs text-muted-foreground">Reception Desk</div>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <div className="text-sm font-medium">{user.name}</div>
              <div className="text-xs text-muted-foreground">{user.email}</div>
            </div>
            <Button variant="outline" size="sm" onClick={() => { logout(); nav({ to: "/login" }); }}>
              <LogOut className="w-4 h-4 mr-1" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Reception Dashboard</h1>
          <p className="text-muted-foreground mt-1">Create prescriptions and bills, then print or share with the patient.</p>
        </motion.div>

        <Tabs defaultValue="prescription" className="mt-8">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="prescription"><FileText className="w-4 h-4 mr-2" /> Prescription</TabsTrigger>
            <TabsTrigger value="bill"><Receipt className="w-4 h-4 mr-2" /> Bill</TabsTrigger>
          </TabsList>

          <TabsContent value="prescription" className="mt-6 space-y-8">
            <PrescriptionForm onCreated={(rx) => { loadData(); setPrintRx(rx); }} />
            <RecordsList
              title="Recent Prescriptions"
              empty={loading ? "Loading..." : "No prescriptions yet."}
              items={prescriptions}
              render={(p) => ({
                primary: `${p.patientName} · ${p.rxNo}`,
                secondary: `${p.date} · ${p.diagnosis || "—"}`,
              })}
              onPrint={setPrintRx}
              onDelete={async (p) => {
                try {
                  await deletePrescription(p._id);
                  toast.success("Deleted");
                  loadData();
                } catch (e: any) { toast.error(e.message); }
              }}
            />
          </TabsContent>

          <TabsContent value="bill" className="mt-6 space-y-8">
            <BillForm onCreated={(b) => { loadData(); setPrintBill(b); }} />
            <RecordsList
              title="Recent Bills"
              empty={loading ? "Loading..." : "No bills yet."}
              items={bills}
              render={(b) => {
                const { total } = billTotals(b);
                return {
                  primary: `${b.patientName} · ${b.invoiceNo}`,
                  secondary: `${b.date} · ${b.items?.length || 0} item(s) · ₹${total.toFixed(2)} · ${b.paymentMode}`,
                };
              }}
              onPrint={setPrintBill}
              onDelete={async (b) => {
                 try {
                  await deleteBill(b._id);
                  toast.success("Deleted");
                  loadData();
                } catch (e: any) { toast.error(e.message); }
              }}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

/* ---------------- Prescription Form ---------------- */

function PrescriptionForm({ onCreated }: { onCreated: (p: Prescription) => void }) {
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({
    patientName: "", age: "", gender: "Male", phone: "",
    date: today, diagnosis: "", advice: "", nextVisit: "", doctor: "Dr. Smith",
  });
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.patientName.trim()) return toast.error("Patient name required");
    
    setSubmitting(true);
    try {
      const rx = await createPrescription({ ...form });
      toast.success(`Prescription ${rx.rxNo} created`);
      onCreated(rx);
      setForm({ ...form, patientName: "", age: "", phone: "", diagnosis: "", advice: "", nextVisit: "" });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="glass p-6 sm:p-8 rounded-2xl shadow-soft">
      <h2 className="text-xl font-bold flex items-center gap-2"><FileText className="w-5 h-5 text-primary" /> New Prescription</h2>
      <form onSubmit={submit} className="mt-6 space-y-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Field label="Patient Name *"><Input required value={form.patientName} onChange={e => setForm({ ...form, patientName: e.target.value })} /></Field>
          <Field label="Age"><Input value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} /></Field>
          <Field label="Gender">
            <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm" value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
              <option>Male</option><option>Female</option><option>Other</option>
            </select>
          </Field>
          <Field label="Phone"><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></Field>
          <Field label="Date"><Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></Field>
          <Field label="Doctor"><Input value={form.doctor} onChange={e => setForm({ ...form, doctor: e.target.value })} /></Field>
          <Field label="Next Visit"><Input type="date" value={form.nextVisit} onChange={e => setForm({ ...form, nextVisit: e.target.value })} /></Field>
          <Field label="Diagnosis"><Input value={form.diagnosis} onChange={e => setForm({ ...form, diagnosis: e.target.value })} placeholder="e.g. Dental caries" /></Field>
        </div>

        <Field label="Advice / Instructions"><Textarea rows={3} value={form.advice} onChange={e => setForm({ ...form, advice: e.target.value })} placeholder="Brush twice daily, avoid cold drinks..." /></Field>

        <div className="flex justify-end">
          <Button type="submit" disabled={submitting} className="gradient-bg text-white shadow-glow">
             <Printer className="w-4 h-4 mr-2" /> {submitting ? "Saving..." : "Save & Print"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

/* ---------------- Bill Form ---------------- */

function BillForm({ onCreated }: { onCreated: (b: Bill) => void }) {
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({
    patientName: "", phone: "", date: today, paymentMode: "Cash", notes: "",
    discount: 0, taxPct: 0,
  });
  const [items, setItems] = useState<BillItem[]>([{ description: "", qty: 1, rate: 0 }]);
  const [submitting, setSubmitting] = useState(false);

  const update = (i: number, k: keyof BillItem, v: string) =>
    setItems(items.map((it, idx) => idx === i ? { ...it, [k]: k === "description" ? v : Number(v) || 0 } : it));
  const addItem = () => setItems([...items, { description: "", qty: 1, rate: 0 }]);
  const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i));

  const totals = useMemo(() => billTotals({ items, discount: form.discount, taxPct: form.taxPct }), [items, form.discount, form.taxPct]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.patientName.trim()) return toast.error("Patient name required");
    const clean = items.filter(it => it.description.trim() && it.rate > 0);
    if (clean.length === 0) return toast.error("Add at least one item");
    
    setSubmitting(true);
    try {
      const b = await createBill({ ...form, items: clean });
      toast.success(`Invoice ${b.invoiceNo} created`);
      onCreated(b);
      setForm({ ...form, patientName: "", phone: "", notes: "", discount: 0, taxPct: 0 });
      setItems([{ description: "", qty: 1, rate: 0 }]);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="glass p-6 sm:p-8 rounded-2xl shadow-soft">
      <h2 className="text-xl font-bold flex items-center gap-2"><Receipt className="w-5 h-5 text-secondary" /> New Bill / Invoice</h2>
      <form onSubmit={submit} className="mt-6 space-y-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Field label="Patient Name *"><Input required value={form.patientName} onChange={e => setForm({ ...form, patientName: e.target.value })} /></Field>
          <Field label="Phone"><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></Field>
          <Field label="Date"><Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></Field>
          <Field label="Payment Mode">
            <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm" value={form.paymentMode} onChange={e => setForm({ ...form, paymentMode: e.target.value })}>
              <option>Cash</option><option>UPI</option><option>Card</option><option>Net Banking</option><option>Insurance</option>
            </select>
          </Field>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <Label>Treatment / Items</Label>
            <Button type="button" size="sm" variant="outline" onClick={addItem}><Plus className="w-4 h-4 mr-1" /> Add</Button>
          </div>
          <div className="space-y-3">
            {items.map((it, i) => (
              <div key={i} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-start p-3 rounded-xl bg-accent/40">
                <Input className="sm:col-span-6" placeholder="Description (e.g. Root Canal)" value={it.description} onChange={e => update(i, "description", e.target.value)} />
                <Input className="sm:col-span-2" type="number" min={1} placeholder="Qty" value={it.qty} onChange={e => update(i, "qty", e.target.value)} />
                <Input className="sm:col-span-2" type="number" min={0} placeholder="Rate" value={it.rate} onChange={e => update(i, "rate", e.target.value)} />
                <div className="sm:col-span-1 text-sm font-medium pt-2">₹{(it.qty * it.rate).toFixed(0)}</div>
                <Button type="button" variant="ghost" size="icon" className="sm:col-span-1" onClick={() => removeItem(i)} disabled={items.length === 1}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Discount (₹)"><Input type="number" min={0} value={form.discount} onChange={e => setForm({ ...form, discount: Number(e.target.value) || 0 })} /></Field>
          <Field label="Tax / GST (%)"><Input type="number" min={0} value={form.taxPct} onChange={e => setForm({ ...form, taxPct: Number(e.target.value) || 0 })} /></Field>
          <Field label="Notes"><Input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></Field>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between gap-4 items-stretch sm:items-end">
          <div className="rounded-xl bg-accent/50 p-4 text-sm space-y-1 sm:min-w-[260px]">
            <Row label="Subtotal" value={`₹${totals.subtotal.toFixed(2)}`} />
            <Row label="Discount" value={`− ₹${form.discount.toFixed(2)}`} />
            <Row label={`Tax (${form.taxPct}%)`} value={`+ ₹${totals.tax.toFixed(2)}`} />
            <div className="border-t pt-2 mt-2 flex justify-between font-bold text-base">
              <span>Total</span><span className="text-primary">₹{totals.total.toFixed(2)}</span>
            </div>
          </div>
          <Button type="submit" disabled={submitting} className="gradient-bg text-white shadow-glow">
             <Printer className="w-4 h-4 mr-2" /> {submitting ? "Saving..." : "Save & Print"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

/* ---------------- Records list ---------------- */

function RecordsList<T extends { _id: string }>({
  title, items, empty, render, onPrint, onDelete,
}: {
  title: string; items: T[]; empty: string;
  render: (i: T) => { primary: string; secondary: string };
  onPrint: (i: T) => void; onDelete: (i: T) => void;
}) {
  const [q, setQ] = useState("");
  const filtered = items.filter(i => {
    const r = render(i);
    return (r.primary + " " + r.secondary).toLowerCase().includes(q.toLowerCase());
  });

  return (
    <Card className="glass p-6 rounded-2xl shadow-soft">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h3 className="font-bold text-lg">{title}</h3>
        <div className="relative sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search..." className="pl-9" />
        </div>
      </div>
      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground py-6 text-center">{empty}</p>
      ) : (
        <ul className="divide-y">
          {filtered.map(i => {
            const r = render(i);
            return (
              <li key={i._id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <div className="font-medium truncate">{r.primary}</div>
                  <div className="text-xs text-muted-foreground truncate">{r.secondary}</div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button size="sm" variant="outline" onClick={() => onPrint(i)}><Printer className="w-4 h-4" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => onDelete(i)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}

/* ---------------- Print views ---------------- */

function PrintShell({ children, onBack }: { children: React.ReactNode; onBack: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div className="min-h-screen bg-muted/40 py-6 print:bg-white print:py-0">
      <div className="max-w-4xl mx-auto px-4 print:px-0 print:max-w-none">
        <div className="flex items-center justify-between mb-4 print:hidden">
          <Button variant="outline" size="sm" onClick={onBack}><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
          <Button size="sm" className="gradient-bg text-white" onClick={() => window.print()}>
            <Printer className="w-4 h-4 mr-2" /> Print / Save PDF
          </Button>
        </div>
        <div ref={ref} className="bg-white text-black rounded-xl shadow-soft p-8 sm:p-10 print:shadow-none print:rounded-none print:p-10">
          {children}
        </div>
      </div>
    </div>
  );
}

function ClinicHeader() {
  return (
    <div className="border-b-2 border-sky-500 pb-4 mb-6 flex items-start justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center text-white">
          <Stethoscope className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-sky-700">{CLINIC.name}</h1>
          <p className="text-xs text-gray-600">{CLINIC.tagline}</p>
        </div>
      </div>
      <div className="text-right text-xs text-gray-700 leading-relaxed">
        <div>{CLINIC.address}</div>
        <div>📞 {CLINIC.phone} · ✉ {CLINIC.email}</div>
        <div>{CLINIC.website} · Reg: {CLINIC.regNo}</div>
      </div>
    </div>
  );
}

function PrintPrescription({ rx, onBack }: { rx: Prescription; onBack: () => void }) {
  return (
    <PrintShell onBack={onBack}>
      <ClinicHeader />
      <div className="flex justify-between text-sm mb-4">
        <div>
          <div><strong>Rx No:</strong> {rx.rxNo}</div>
          <div><strong>Date:</strong> {rx.date}</div>
        </div>
        <div className="text-right">
          <div><strong>Doctor:</strong> {rx.doctor}</div>
          {rx.nextVisit && <div><strong>Next Visit:</strong> {rx.nextVisit}</div>}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm bg-sky-50 rounded-lg p-3 mb-5">
        <div><div className="text-xs text-gray-500">Patient</div><div className="font-medium">{rx.patientName}</div></div>
        <div><div className="text-xs text-gray-500">Age / Gender</div><div className="font-medium">{rx.age || "—"} / {rx.gender}</div></div>
        <div><div className="text-xs text-gray-500">Phone</div><div className="font-medium">{rx.phone || "—"}</div></div>
        <div><div className="text-xs text-gray-500">Diagnosis</div><div className="font-medium">{rx.diagnosis || "—"}</div></div>
      </div>

      <div className="text-3xl font-serif text-sky-700 mb-2">℞</div>

      {rx.advice && (
        <div className="mt-5">
          <div className="font-semibold text-sm mb-1">Advice / Instructions</div>
          <p className="text-sm whitespace-pre-wrap text-gray-700">{rx.advice}</p>
        </div>
      )}

      <div className="mt-16 flex justify-between items-end text-sm">
        <div className="text-xs text-gray-500">This prescription is electronically generated.</div>
        <div className="text-right">
          <div className="border-t border-gray-400 pt-1 px-6 inline-block">
            <div className="font-semibold">{rx.doctor}</div>
            <div className="text-xs text-gray-500">Signature & Stamp</div>
          </div>
        </div>
      </div>
    </PrintShell>
  );
}

function PrintBill({ bill, onBack }: { bill: Bill; onBack: () => void }) {
  const t = billTotals(bill);
  return (
    <PrintShell onBack={onBack}>
      <ClinicHeader />
      <div className="flex justify-between text-sm mb-4">
        <div>
          <h2 className="text-xl font-bold text-teal-700">INVOICE</h2>
          <div><strong>Invoice No:</strong> {bill.invoiceNo}</div>
          <div><strong>Date:</strong> {bill.date}</div>
        </div>
        <div className="text-right text-sm">
          <div className="text-xs text-gray-500">Billed To</div>
          <div className="font-semibold">{bill.patientName}</div>
          <div>{bill.phone}</div>
        </div>
      </div>

      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-teal-100 text-left">
            <th className="p-2 border">#</th>
            <th className="p-2 border">Description</th>
            <th className="p-2 border text-right">Qty</th>
            <th className="p-2 border text-right">Rate (₹)</th>
            <th className="p-2 border text-right">Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          {bill.items.map((it, i) => (
            <tr key={i}>
              <td className="p-2 border">{i + 1}</td>
              <td className="p-2 border">{it.description}</td>
              <td className="p-2 border text-right">{it.qty}</td>
              <td className="p-2 border text-right">{it.rate.toFixed(2)}</td>
              <td className="p-2 border text-right">{(it.qty * it.rate).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mt-4">
        <div className="w-full sm:w-72 text-sm space-y-1">
          <Row label="Subtotal" value={`₹${t.subtotal.toFixed(2)}`} />
          <Row label="Discount" value={`− ₹${bill.discount.toFixed(2)}`} />
          <Row label={`Tax (${bill.taxPct}%)`} value={`+ ₹${t.tax.toFixed(2)}`} />
          <div className="flex justify-between border-t pt-2 font-bold text-base">
            <span>Total</span><span className="text-teal-700">₹{t.total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-600 pt-2">
            <span>Payment Mode</span><span>{bill.paymentMode}</span>
          </div>
        </div>
      </div>

      {bill.notes && <p className="text-xs text-gray-600 mt-4"><strong>Notes:</strong> {bill.notes}</p>}

      <div className="mt-16 flex justify-between items-end text-sm">
        <div className="text-xs text-gray-500">Thank you for choosing {CLINIC.name}.</div>
        <div className="text-right">
          <div className="border-t border-gray-400 pt-1 px-6 inline-block">
            <div className="font-semibold">Authorised Signatory</div>
          </div>
        </div>
      </div>
    </PrintShell>
  );
}

/* ---------------- helpers ---------------- */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>;
}
function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between"><span className="text-gray-600">{label}</span><span className="font-medium">{value}</span></div>;
}
