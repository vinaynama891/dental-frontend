import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export function Contact() {
  const submit = (e: React.FormEvent) => { e.preventDefault(); toast.success("Message sent! We'll be in touch."); (e.target as HTMLFormElement).reset(); };
  return (
    <section id="contact" className="relative py-24 px-4 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <div className="inline-block px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold mb-3">CONTACT</div>
          <h2 className="text-4xl sm:text-5xl font-bold">Get in <span className="gradient-text">touch</span></h2>
        </motion.div>
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            {[
              { icon: MapPin, title: "Visit us", text: "123 Smile Avenue, Wellness District, NY 10001" },
              { icon: Phone, title: "Call us", text: "+1 (555) 010-0100" },
              { icon: Mail, title: "Email us", text: "hello@dentique.care" },
              { icon: Clock, title: "Hours", text: "Mon–Sat: 9:00 AM – 8:00 PM" },
            ].map(c => (
              <div key={c.title} className="glass rounded-2xl p-5 shadow-soft flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center shrink-0"><c.icon className="w-5 h-5 text-white" /></div>
                <div><div className="font-semibold">{c.title}</div><div className="text-sm text-muted-foreground">{c.text}</div></div>
              </div>
            ))}
            <div className="rounded-2xl overflow-hidden shadow-soft h-48">
              <iframe title="map" src="https://maps.google.com/maps?q=new%20york&t=&z=13&ie=UTF8&iwloc=&output=embed" className="w-full h-full border-0" loading="lazy" />
            </div>
          </div>
          <form onSubmit={submit} className="glass rounded-3xl p-6 sm:p-8 shadow-soft space-y-4">
            <Input placeholder="Your name" required />
            <Input type="email" placeholder="Email address" required />
            <Input placeholder="Subject" required />
            <Textarea placeholder="Your message" rows={6} required />
            <Button type="submit" className="w-full gradient-bg text-white shadow-glow">Send Message</Button>
          </form>
        </div>
      </div>
    </section>
  );
}
