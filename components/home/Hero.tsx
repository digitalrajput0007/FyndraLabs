"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Smartphone, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SplitMateMockup } from "@/components/products/SplitMateMockup";

export function Hero() {
  return (
    <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden bg-white dark:bg-[#0b0f17] transition-colors">
      {/* Background Ambient Glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[380px] bg-gradient-to-tr from-brand-500/10 via-sky-500/10 to-blue-600/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="lg:col-span-6 space-y-6 text-center lg:text-left"
          >
            {/* Small Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
              <span>Building useful digital products</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              Software that makes{" "}
              <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-sky-400 bg-clip-text text-transparent">
                everyday life simpler.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
              Fyndra Labs builds thoughtfully designed mobile and digital products that solve real-world problems.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Button
                href="/products/splitmate"
                variant="primary"
                size="lg"
                icon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                Explore SplitMate
              </Button>
              <Button
                href="/about"
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
              >
                About Fyndra Labs
              </Button>
            </div>

            {/* Micro Pillars */}
            <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800/80 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 text-left">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-brand-500" />
                  <span>Mobile First</span>
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">Thoughtful UX</span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                  <span>Utility</span>
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">Solves real problems</span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-500" />
                  <span>Reliability</span>
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">Clean execution</span>
              </div>
            </div>
          </motion.div>

          {/* Right Visual: SplitMate App Centerpiece */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            className="lg:col-span-6 relative"
          >
            <SplitMateMockup />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
