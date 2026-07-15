import { motion, type Variants } from "framer-motion";
import { VillaCard } from "@/components/site/villa-card";
import { Button } from "@/components/ui/button";
import { villas } from "@/lib/mock-data";

interface Props {
  requireAuth: boolean;
  onViewAll: () => void;
}

export function FeaturedVillasSection({ requireAuth, onViewAll }: Props) {
  const featured = villas.slice(0, 4);

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };


  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="flex items-end justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl font-bold sm:text-3xl">Villa Rekomendasi</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Pilihan villa dengan rating terbaik dari tamu.
          </p>
        </div>
        <Button variant="outline" className="rounded-full cursor-pointer" onClick={onViewAll}>
          Lihat Semua Villa
        </Button>
      </motion.div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {featured.map((v) => (
          <motion.div key={v.id} variants={cardVariants}>
            <VillaCard villa={v} requireAuth={requireAuth} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
