import { Quote } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { testimonials } from "@/lib/mock-data";

export function TestimonialsSection() {
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };


  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-2xl text-center"
      >
        <h2 className="text-2xl font-bold sm:text-3xl">Kata mereka yang sudah menginap</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Ribuan tamu bahagia setiap bulannya. Berikut beberapa cerita mereka.
        </p>
      </motion.div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="mt-10 grid gap-6 md:grid-cols-3"
      >
        {testimonials.map((t) => (
          <motion.figure
            key={t.name}
            variants={itemVariants}
            className="rounded-3xl border border-border bg-card p-6 shadow-card"
          >
            <Quote className="h-6 w-6 text-primary/60" />
            <blockquote className="mt-3 text-sm leading-relaxed text-foreground">"{t.quote}"</blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              <img src={t.avatar} alt={t.name} className="h-11 w-11 rounded-full object-cover" />
              <div>
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </figcaption>
          </motion.figure>
        ))}
      </motion.div>
    </section>
  );
}
