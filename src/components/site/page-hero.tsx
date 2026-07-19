import { motion } from "framer-motion";
import { ReactNode } from "react";

interface Props {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
}

const PageHero = ({ eyebrow, title, description, children }: Props) => (
  <section className="relative pt-16 md:pt-24 pb-20 md:pb-24 overflow-hidden bg-gradient-to-b from-[#EEF3FF] via-white to-white">
    <div className="pointer-events-none absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-primary/15 blur-3xl" />
    <div className="pointer-events-none absolute top-10 -right-40 h-[360px] w-[360px] rounded-full bg-electric-glow/20 blur-3xl" />
    <div className="relative mx-auto max-w-4xl px-4 md:px-6 text-center">
      {false && eyebrow && <span />}
      <motion.h1
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="mt-6 text-navy font-semibold tracking-tight text-4xl md:text-6xl leading-[1.05]"
      >
        {title}
      </motion.h1>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="mt-6 text-lg md:text-xl text-navy/60 max-w-2xl mx-auto"
        >
          {description}
        </motion.p>
      )}
      {children && <div className="mt-8">{children}</div>}
    </div>
  </section>
);

export default PageHero;
