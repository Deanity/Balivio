import { Sparkles } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { SearchBar } from "@/components/site/search-bar";

export function HeroSection() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
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
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <motion.img
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          src="https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1920&q=80"
          alt="Villa di Bali"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/40 via-black/30 to-background" />
      </div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative mx-auto max-w-7xl px-4 pb-32 pt-20 sm:px-6 sm:pt-28 lg:px-8 lg:pb-44 lg:pt-36"
      >
        <div className="max-w-2xl text-white">
          <motion.span
            variants={itemVariants}
            className="inline-flex items-center gap-2 rounded-full bg-highlight/95 px-4 py-1.5 text-xs font-bold text-highlight-foreground"
          >
            <Sparkles className="h-3.5 w-3.5" /> Promo spesial hingga 30% off
          </motion.span>
          <motion.h1
            variants={itemVariants}
            className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
          >
            Rasakan liburan sempurna di villa terbaik Bali.
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="mt-4 max-w-xl text-base text-white/85 sm:text-lg"
          >
            Kurasi villa private pool, retreat pegunungan, hingga clifftop suite — semuanya bisa kamu booking dalam hitungan menit.
          </motion.p>
        </div>
        <motion.div variants={itemVariants} className="mt-8 lg:mt-14">
          <SearchBar />
        </motion.div>
      </motion.div>
    </section>
  );
}
