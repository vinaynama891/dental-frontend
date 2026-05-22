import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const points = [
  "State-of-the-art equipment & sterilization",
  "Board-certified expert dentists",
  "Painless, comfort-focused treatments",
  "Transparent pricing & flexible EMI plans",
];

const stats = [
  { value: "5K+", label: "Happy Patients" },
  { value: "15+", label: "Expert Doctors" },
  { value: "98%", label: "Success Rate" },
  { value: "10+", label: "Years of Care" },
];

export function About() {
  return (
    <section id="about" className="relative py-24 px-4 sm:px-6">
      <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 gap-4"
        >
          <img
            src="https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=600"
            alt="Clinic"
            className="rounded-3xl shadow-card aspect-[3/4] object-cover"
            loading="lazy"
          />
          <div className="flex flex-col gap-4 pt-8">
            <img
              src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600"
              alt="Equipment"
              className="rounded-3xl shadow-card aspect-square object-cover"
              loading="lazy"
            />
            <img
              src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600"
              alt="Care"
              className="rounded-3xl shadow-card aspect-square object-cover"
              loading="lazy"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-block px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold mb-3">
            ABOUT US
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            A clinic built around <span className="gradient-text">your comfort</span>
          </h2>
          <p className="text-muted-foreground mb-6">
            Dentique blends advanced technology with a calming, hygienic environment to deliver
            world-class dental care for every member of your family.
          </p>
          <ul className="space-y-3 mb-8">
            {points.map((p) => (
              <li key={p} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm">{p}</span>
              </li>
            ))}
          </ul>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="glass rounded-2xl p-4 text-center shadow-soft">
                <div className="text-2xl font-bold gradient-text">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
