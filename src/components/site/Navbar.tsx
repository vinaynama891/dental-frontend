import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUser, dashboardPath } from "@/lib/auth";

const links = [
  { to: "/", label: "Home", hash: "" },
  { to: "/#services", label: "Services", hash: "services" },
  { to: "/#doctors", label: "Doctors", hash: "doctors" },
  { to: "/#testimonials", label: "Testimonials", hash: "testimonials" },
  { to: "/#appointment", label: "Appointment", hash: "appointment" },
  { to: "/#contact", label: "Contact", hash: "contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(getUser());

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    const onStorage = () => setUser(getUser());
    window.addEventListener("storage", onStorage);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("storage", onStorage); };
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "py-2" : "py-4"}`}>
      <nav className={`mx-auto max-w-7xl px-4 sm:px-6 ${scrolled ? "glass shadow-soft rounded-2xl mx-4 sm:mx-6" : ""}`}>
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">Dentique</span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {links.map(l => (
              <a key={l.label} href={l.to} className="px-4 py-2 text-sm font-medium text-foreground/75 hover:text-foreground rounded-lg hover:bg-accent transition-all">
                {l.label}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-2">
            {user ? (
              <Link to={dashboardPath(user.role)}>
                <Button variant="outline" size="sm">Dashboard</Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button variant="outline" size="sm">Login</Button>
              </Link>
            )}
            <a href="#appointment">
              <Button size="sm" className="gradient-bg text-white shadow-glow hover:opacity-90">Book Now</Button>
            </a>
          </div>

          <button className="lg:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X /> : <Menu />}
          </button>
        </div>

        {open && (
          <div className="lg:hidden glass rounded-2xl mt-2 p-4 flex flex-col gap-2 animate-in fade-in slide-in-from-top-2">
            {links.map(l => (
              <a key={l.label} href={l.to} onClick={() => setOpen(false)} className="px-3 py-2 rounded-lg hover:bg-accent text-sm font-medium">
                {l.label}
              </a>
            ))}
            <div className="flex gap-2 pt-2 border-t">
              {user ? (
                <Link to={dashboardPath(user.role)} className="flex-1"><Button variant="outline" className="w-full" size="sm">Dashboard</Button></Link>
              ) : (
                <Link to="/login" className="flex-1"><Button variant="outline" className="w-full" size="sm">Login</Button></Link>
              )}
              <a href="#appointment" className="flex-1" onClick={() => setOpen(false)}>
                <Button className="w-full gradient-bg text-white" size="sm">Book Now</Button>
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
