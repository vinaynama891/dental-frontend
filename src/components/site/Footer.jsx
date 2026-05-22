import { Stethoscope, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function Footer() {
  return (
    <footer className="relative mt-12 border-t bg-card/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">Dentique</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Premium dental care designed around your comfort and confidence.
          </p>
        </div>
        <div>
          <div className="font-semibold mb-3">Quick Links</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {["Home", "Services", "Doctors", "Appointment", "Contact"].map((l) => (
              <li key={l}>
                <a href={`#${l.toLowerCase()}`} className="hover:text-foreground">
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3">Contact</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>123 Smile Avenue, NY</li>
            <li>+1 (555) 010-0100</li>
            <li>hello@dentique.care</li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3">Newsletter</div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Subscribed!");
              e.target.reset();
            }}
            className="flex gap-2"
          >
            <Input type="email" placeholder="Email" required />
            <Button type="submit" className="gradient-bg text-white">
              Join
            </Button>
          </form>
          <div className="flex gap-3 mt-4">
            {[Facebook, Instagram, Twitter, Linkedin].map((Ic, i) => (
              <a
                key={i}
                href="#"
                className="w-9 h-9 rounded-full glass flex items-center justify-center hover:scale-110 transition"
              >
                <Ic className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Dentique. All rights reserved.
      </div>
    </footer>
  );
}
