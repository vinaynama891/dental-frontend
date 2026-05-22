import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Services } from "@/components/site/Services";
import { About } from "@/components/site/About";
import { Doctors } from "@/components/site/Doctors";
import { Appointment } from "@/components/site/Appointment";
import { Testimonials } from "@/components/site/Testimonials";
import { FAQ } from "@/components/site/FAQ";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { FloatingButtons } from "@/components/site/FloatingButtons";
import { ScrollProgress } from "@/components/site/ScrollProgress";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dentique — Premium Dental Care, Designed Around You" },
      { name: "description", content: "Advanced dental care with expert doctors, painless treatment, and modern technology. Book your appointment online today." },
      { property: "og:title", content: "Dentique — Premium Dental Care" },
      { property: "og:description", content: "Your smile, our priority. Award-winning dental clinic with expert doctors and modern technology." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="relative overflow-x-hidden">
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <Services />
        <About />
        <Doctors />
        <Appointment />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
}
