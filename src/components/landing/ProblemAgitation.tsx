"use client";

import { Container } from "@/components/ui/Container";
import { motion } from "framer-motion";

export function ProblemAgitation() {
  const lineStyle = "text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight tracking-tight text-white mb-2 transition-colors duration-300";
  const serifStyle = "font-serif italic font-normal text-2xl sm:text-3xl text-white my-8 block";

  return (
    <Container className="py-24 sm:py-32 max-w-4xl mx-auto text-left">
      <div className="space-y-6">
        <motion.p
          initial={{ opacity: 0.25 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, margin: "-15% 0px -35% 0px" }}
          transition={{ duration: 0.4 }}
          className={lineStyle}
        >
          Spending hours manually searching for leads on social media?
        </motion.p>
        
        <motion.p
          initial={{ opacity: 0.25 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, margin: "-15% 0px -35% 0px" }}
          transition={{ duration: 0.4 }}
          className={lineStyle}
        >
          Constantly checking for complaints about rival brands?
        </motion.p>

        <motion.p
          initial={{ opacity: 0.25 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, margin: "-15% 0px -35% 0px" }}
          transition={{ duration: 0.4 }}
          className={lineStyle}
        >
          Wasting energy that should go into building your product?
        </motion.p>
      </div>

      <motion.span
        initial={{ opacity: 0.25 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, margin: "-15% 0px -35% 0px" }}
        transition={{ duration: 0.4 }}
        className={serifStyle}
      >
        STOP.
      </motion.span>

      <div className="space-y-6">
        <motion.p
          initial={{ opacity: 0.25 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, margin: "-15% 0px -35% 0px" }}
          transition={{ duration: 0.4 }}
          className={lineStyle}
        >
          Shift from hours of scrolling to minutes of clicking.
        </motion.p>

        <motion.p
          initial={{ opacity: 0.25 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, margin: "-15% 0px -35% 0px" }}
          transition={{ duration: 0.4 }}
          className={lineStyle}
        >
          Let Undercut automatically track, filter, and draft replies for you.
        </motion.p>

        <motion.p
          initial={{ opacity: 0.25 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, margin: "-15% 0px -35% 0px" }}
          transition={{ duration: 0.4 }}
          className={lineStyle}
        >
          Simply review, click send, and win customers.
        </motion.p>
      </div>

      <motion.span
        initial={{ opacity: 0.25 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, margin: "-15% 0px -35% 0px" }}
        transition={{ duration: 0.4 }}
        className="font-serif italic font-normal text-2xl text-muted mt-8 block"
      >
        Zero effort monitoring. Absolute maximum results.
      </motion.span>
    </Container>
  );
}