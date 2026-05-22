import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "How much do treatments cost?", a: "Pricing varies by treatment. Consultations start at $50, and we offer transparent quotes upfront with EMI plans available." },
  { q: "How do I book an appointment?", a: "Use our online booking form above, call us, or walk in. Most appointments are confirmed within 2 hours." },
  { q: "Do you handle dental emergencies?", a: "Yes — we offer 24/7 emergency support. Call our hotline anytime for urgent dental care." },
  { q: "Do you accept insurance?", a: "We accept all major insurance providers and can process claims directly. Contact us with your provider details." },
  { q: "Is treatment painful?", a: "We use modern, minimally invasive techniques and sedation options to ensure your comfort throughout every procedure." },
];

export function FAQ() {
  return (
    <section id="faq" className="relative py-24 px-4 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <div className="inline-block px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold mb-3">FAQ</div>
          <h2 className="text-4xl sm:text-5xl font-bold">Frequently asked <span className="gradient-text">questions</span></h2>
        </motion.div>
        <Accordion type="single" collapsible className="glass rounded-3xl p-2 shadow-soft">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-b last:border-0 px-4">
              <AccordionTrigger className="text-left font-semibold hover:no-underline">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
