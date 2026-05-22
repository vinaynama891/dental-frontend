import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const doctors = [
  {
    name: "Dr. Sarah Chen",
    spec: "Cosmetic Dentistry",
    exp: "12 yrs",
    rating: 4.9,
    img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400",
  },
  {
    name: "Dr. Michael Reed",
    spec: "Orthodontics",
    exp: "10 yrs",
    rating: 4.8,
    img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400",
  },
  {
    name: "Dr. Priya Nair",
    spec: "Pediatric Dentistry",
    exp: "8 yrs",
    rating: 5.0,
    img: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400",
  },
  {
    name: "Dr. James Carter",
    spec: "Implantology",
    exp: "15 yrs",
    rating: 4.9,
    img: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400",
  },
];

export function Doctors() {
  return (
    <section id="doctors" className="relative py-24 px-4 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-block px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold mb-3">
            OUR TEAM
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold">
            Meet our <span className="gradient-text">expert doctors</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {doctors.map((d, i) => (
            <motion.div
              key={d.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group glass rounded-3xl overflow-hidden shadow-card hover:shadow-glow hover:-translate-y-2 transition-all"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={d.img}
                  alt={d.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg">{d.name}</h3>
                <p className="text-sm text-primary font-medium">{d.spec}</p>
                <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                  <span>{d.exp} experience</span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    {d.rating}
                  </span>
                </div>
                <a href="#appointment">
                  <Button size="sm" className="w-full mt-4 gradient-bg text-white">
                    Book Consultation
                  </Button>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
