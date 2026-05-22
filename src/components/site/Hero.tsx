import { motion } from "framer-motion";
import { Calendar, Sparkles, Users, Clock, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-dental.png";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-28 pb-16 overflow-hidden">
      <div className="blob w-[500px] h-[500px] bg-primary -top-20 -left-20 animate-float" />
      <div className="blob w-[400px] h-[400px] bg-secondary top-40 right-0 animate-float" style={{ animationDelay: "2s" }} />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5 text-primary" /> Award-winning dental care
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
            Your Smile,<br /><span className="gradient-text">Our Priority</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl">
            Advanced dental care with expert doctors, painless treatment, and modern technology — designed around your comfort.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#appointment"><Button size="lg" className="gradient-bg text-white shadow-glow hover:opacity-90">
              <Calendar className="w-4 h-4 mr-2" />Book Appointment
            </Button></a>
            <a href="#services"><Button size="lg" variant="outline" className="glass">Explore Services</Button></a>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-4 max-w-lg">
            {[
              { icon: Award, value: "10+", label: "Years Experience" },
              { icon: Users, value: "5000+", label: "Happy Patients" },
              { icon: Clock, value: "24/7", label: "Support" },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
                className="glass rounded-2xl p-4 shadow-soft hover:scale-105 transition-transform">
                <s.icon className="w-5 h-5 text-primary mb-2" />
                <div className="text-2xl font-bold">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="relative">
          <div className="absolute inset-0 gradient-bg rounded-full blur-3xl opacity-30 scale-90" />
          <img src={heroImg} alt="Modern dental clinic" className="relative w-full max-w-lg mx-auto animate-float" />
        </motion.div>
      </div>
    </section>
  );
}
