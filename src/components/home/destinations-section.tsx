import { motion, type Variants } from "framer-motion";
import { DestinationCard } from "@/components/site/destination-card";
import { destinations } from "@/lib/mock-data";

interface Props {
  onViewAll: () => void;
}

export function DestinationsSection({ onViewAll }: Props) {
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
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
        className="flex items-end justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl font-bold sm:text-3xl">Destinasi Populer</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Area favorit para traveler di Pulau Dewata.
          </p>
        </div>
        <button
          onClick={onViewAll}
          className="hidden text-sm font-semibold text-primary hover:underline sm:block cursor-pointer"
        >
          Lihat semua →
        </button>
      </motion.div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="mt-8 grid grid-cols-2 gap-5 lg:grid-cols-4"
      >
        {destinations.slice(0, 4).map((d) => (
          <motion.div key={d.name} variants={cardVariants}>
            <DestinationCard {...d} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
