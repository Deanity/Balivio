import { BadgeCheck, HeadphonesIcon, ShieldCheck, Tag } from "lucide-react";
import { motion, type Variants } from "framer-motion";

const perks = [
  { icon: Tag, title: "Harga Terbaik", desc: "Jaminan harga paling kompetitif untuk setiap villa di Bali." },
  { icon: ShieldCheck, title: "Free Cancellation", desc: "Batalkan gratis hingga hari yang telah ditentukan." },
  { icon: BadgeCheck, title: "Verified Villa", desc: "Setiap villa dikurasi & diverifikasi tim lokal kami." },
  { icon: HeadphonesIcon, title: "24/7 Support", desc: "Tim support siap membantumu kapanpun dibutuhkan." },
];

export function PerksSection() {
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
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
    <section className="mx-auto mt-8 max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] bg-surface-alt p-8 sm:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-2xl font-bold sm:text-3xl">Kenapa pilih Balivio?</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Pengalaman booking villa yang simpel, transparan, dan bikin tenang dari awal sampai check-out.
          </p>
        </motion.div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {perks.map((p) => (
            <motion.div
              key={p.title}
              variants={itemVariants}
              className="rounded-2xl border border-border bg-card p-6 shadow-card"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-info/40 text-primary">
                <p.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
