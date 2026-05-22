import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    name: "Emily R.",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
    rating: 5,
    text: "Best dental experience I've ever had. The team is gentle, professional, and the clinic is gorgeous.",
  },
  {
    name: "Marcus T.",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
    rating: 5,
    text: "Got my implants done here — completely painless and the results look so natural. Highly recommend!",
  },
  {
    name: "Sofia L.",
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200",
    rating: 5,
    text: "From booking to follow-up, every step was seamless. My smile has never looked better.",
  },
];

export function Testimonials() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % testimonials.length), 5000);
    return () => clearInterval(t);
  }, []);
  const t = testimonials[i];

  return (
    <section id="testimonials" className="relative py-24 px-4 sm:px-6">
      <div className="mx-auto max-w-4xl text-center">
        <div className="inline-block px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold mb-3">
          TESTIMONIALS
        </div>
        <h2 className="text-4xl sm:text-5xl font-bold mb-12">
          Loved by <span className="gradient-text">our patients</span>
        </h2>

        <div className="relative glass rounded-3xl p-8 sm:p-12 shadow-soft min-h-[280px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <img
                src={t.img}
                alt={t.name}
                className="w-20 h-20 rounded-full mx-auto object-cover ring-4 ring-primary/20 mb-4"
              />
              <div className="flex justify-center gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, k) => (
                  <Star key={k} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-lg sm:text-xl text-foreground/85 italic mb-4">"{t.text}"</p>
              <div className="font-bold">{t.name}</div>
            </motion.div>
          </AnimatePresence>

          <button
            onClick={() => setI((i - 1 + testimonials.length) % testimonials.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center hover:scale-110 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setI((i + 1) % testimonials.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center hover:scale-110 transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, k) => (
            <button
              key={k}
              onClick={() => setI(k)}
              className={`h-2 rounded-full transition-all ${k === i ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
