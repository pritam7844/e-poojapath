"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Award, CheckCircle, ExternalLink, X, ShieldCheck, Landmark } from "lucide-react";

export function DPIITRecognition() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="relative overflow-hidden bg-cream/30 dark:bg-dark-mandala/20 py-12 border-y border-saffron/10">
      {/* Decorative background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none opacity-20 filter blur-3xl bg-saffron" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full pointer-events-none opacity-25 filter blur-3xl bg-lotus-purple" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Column: Info details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-saffron/10 border border-saffron/30 dark:border-saffron/50 text-saffron px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider"
              >
                <Award className="w-4 h-4 animate-pulse" />
                Government Recognized Startup
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="relative h-12 w-32 flex items-center justify-center overflow-hidden dark:bg-white dark:rounded-lg"
              >
                <Image
                  src="/startup_india_logo.png"
                  alt="Startup India Logo"
                  fill
                  sizes="128px"
                  className="object-contain scale-[2.2] transform mix-blend-multiply dark:mix-blend-normal"
                />
              </motion.div>
            </div>

            <motion.h2
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-heading text-4xl md:text-5xl text-foreground leading-tight"
            >
              Proudly Recognized by <span className="text-saffron">Startup India</span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="h-1 w-20 rounded-full bg-gradient-to-r from-saffron to-deep-gold"
            />

            <motion.p
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-muted-foreground text-lg leading-relaxed"
            >
              ePoojapath (<strong className="font-semibold text-foreground">EPOOJAPAATH PRIVATE LIMITED</strong>) is officially recognized as a startup by the <strong className="font-semibold text-foreground">Department for Promotion of Industry and Internal Trade (DPIIT)</strong>, Ministry of Commerce & Industry, Government of India.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-muted-foreground leading-relaxed"
            >
              This official recognition highlights our dedication to using technology to bring sacred Indian traditions, puja bookings, and temple offerings closer to devotees worldwide, while building a robust, transparent digital ecosystem.
            </motion.p>

            {/* Certificate Details Cards */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4"
            >
              <div className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card/50 backdrop-blur-sm">
                <ShieldCheck className="w-5 h-5 text-saffron shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Certificate No</h4>
                  <p className="text-foreground font-semibold mt-0.5 font-sans">DIPP260445</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card/50 backdrop-blur-sm">
                <Landmark className="w-5 h-5 text-saffron shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Recognition Authority</h4>
                  <p className="text-foreground font-semibold mt-0.5 text-sm">DPIIT, Government of India</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card/50 backdrop-blur-sm">
                <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Verification Status</h4>
                  <p className="text-green-600 dark:text-green-400 font-semibold mt-0.5 flex items-center gap-1.5 text-sm">
                    Verified
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card/50 backdrop-blur-sm">
                <Award className="w-5 h-5 text-saffron shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Incorporation Date</h4>
                  <p className="text-foreground font-semibold mt-0.5 font-sans">06-02-2026</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="pt-2"
            >
              <button
                onClick={() => setIsOpen(true)}
                className="btn-saffron flex items-center gap-2 group px-8 py-3.5"
              >
                <span>View Recognition Certificate</span>
                <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </motion.div>
          </div>

          {/* Right Column: Interactive Certificate Preview */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative w-full max-w-sm group cursor-pointer"
              onClick={() => setIsOpen(true)}
            >
              {/* Premium Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-saffron/30 via-lotus-pink/20 to-lotus-blue/30 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

              {/* Certificate Frame wrapper */}
              <div className="relative p-2.5 bg-gradient-to-b from-amber-200 via-yellow-100 to-amber-300 rounded-2xl shadow-2xl transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_20px_50px_rgba(212,130,10,0.3)]">

                {/* Dark Inner Border */}
                <div className="relative overflow-hidden rounded-xl bg-white p-2 border-2 border-amber-900/30">
                  <div className="aspect-[4/3] relative w-full overflow-hidden rounded bg-slate-50 flex items-center justify-center">
                    <Image
                      src="/certificate.jpg"
                      alt="DPIIT Startup India Certificate of Recognition"
                      fill
                      sizes="(max-w-md) 100vw, 400px"
                      className="object-contain transition-transform duration-500 group-hover:scale-105"
                      priority
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white gap-2">
                      <div className="bg-saffron p-3 rounded-full shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
                        <ExternalLink className="w-6 h-6" />
                      </div>
                      <span className="font-semibold tracking-wide text-sm">Click to Zoom Certificate</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Modal/Lightbox */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-4xl w-full bg-white dark:bg-dark p-3 rounded-2xl shadow-2xl overflow-hidden border border-amber-500/20"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header inside modal */}
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-border">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-saffron" />
                    <h3 className="font-heading text-lg text-foreground">
                      DPIIT Certificate of Recognition
                    </h3>
                  </div>
                  <div className="relative h-9 w-24 hidden sm:flex items-center justify-center overflow-hidden dark:bg-white dark:rounded">
                    <Image
                      src="/startup_india_logo.png"
                      alt="Startup India Logo"
                      fill
                      sizes="96px"
                      className="object-contain scale-[2.2] transform mix-blend-multiply dark:mix-blend-normal"
                    />
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Certificate image */}
              <div className="relative w-full max-h-[80vh] aspect-[4/3] rounded-lg overflow-hidden flex items-center justify-center bg-zinc-950 border border-border">
                <div className="relative w-full h-full">
                  <Image
                    src="/certificate.jpg"
                    alt="DPIIT Startup India Certificate of Recognition for EPOOJAPAATH PRIVATE LIMITED"
                    fill
                    sizes="(max-w-4xl) 100vw, 1000px"
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              {/* Footer info in modal */}
              <div className="flex flex-wrap items-center justify-between mt-3 text-xs text-muted-foreground gap-2 pt-2 border-t border-border">
                <span>Certificate No: <strong>DIPP260445</strong></span>
                <span>Incorporated: <strong>06-02-2026</strong></span>
                <span>Government of India • Ministry of Commerce & Industry</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
