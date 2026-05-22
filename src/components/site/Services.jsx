import { motion } from "framer-motion";
import { Sparkles, Stethoscope, Activity, Smile, HeartPulse, Baby, ArrowRight } from "lucide-react";

const services = [
  {
    icon: Sparkles,
    title: "Teeth Whitening",
    desc: "Brighten your smile with our advanced whitening treatments.",
  },
  {
    icon: Stethoscope,
    title: "Dental Implants",
    desc: "Permanent, natural-looking tooth replacement solutions.",
  },
  {
    icon: Activity,
    title: "Root Canal",
    desc: "Pain-free root canal therapy with modern techniques.",
  },
  {
    icon: Smile,
    title: "Braces & Aligners",
    desc: "Straighten teeth with traditional braces or invisible aligners.",
  },
  {
    icon: HeartPulse,
    title: "Cosmetic Dentistry",
    desc: "Transform your smile with veneers, bonding, and more.",
  },
  {
    icon: Baby,
    title: "Kids Dentistry",
    desc: "Gentle, friendly dental care designed for children.",
  },
];

export function Services() {
  return (
    <section id="services" className="relative py-24 px-4 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-block px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold mb-3">
            OUR SERVICES
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold">
            Complete <span className="gradient-text">Dental Care</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            A full range of treatments delivered with precision, care, and the latest technology.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group relative glass rounded-3xl p-7 shadow-card hover:shadow-glow transition-all hover:-translate-y-2 cursor-pointer"
            >
              <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center shadow-glow mb-5 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                <s.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{s.desc}</p>
              <button className="inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                Learn More <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
