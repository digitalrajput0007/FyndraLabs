"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Receipt, Zap, HeartPulse, Sparkles, Layers, Box, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-white dark:bg-[#0b0f17] transition-colors">
      {/* Background Soft Glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[420px] bg-gradient-to-tr from-brand-500/10 via-sky-500/10 to-indigo-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12 items-center">
          {/* Left Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Studio Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
              <span>Independent Mobile & Software Product Studio</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              We build digital products{" "}
              <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-sky-400 bg-clip-text text-transparent">
                people love to use.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
              Fyndra Labs creates simple, useful and thoughtfully designed software products that solve everyday problems.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Button
                href="/products"
                variant="primary"
                size="lg"
                icon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                Explore Products
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

            {/* Micro Feature Pillars */}
            <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800/80 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-left">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Product Craft
                </span>
                <span className="text-[11px] text-slate-500">Focused utility & UX</span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Reliable Tech
                </span>
                <span className="text-[11px] text-slate-500">Modern stack & speed</span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  10+ App Vision
                </span>
                <span className="text-[11px] text-slate-500">Growing portfolio</span>
              </div>
            </div>
          </motion.div>

          {/* Right Hero Visual: Multi-Product Studio Layered Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none space-y-3">
              {/* Card 1: SplitMate (Primary Featured App) */}
              <div className="relative rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-3 hover:border-brand-500/40 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-sky-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
                      <Receipt className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                          SplitMate
                        </h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300">
                          Active App
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500">Finance & Expense Management</span>
                    </div>
                  </div>
                  <Link
                    href="/products/splitmate"
                    className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                    aria-label="View SplitMate product details"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Split expenses, track group balances, and settle debts automatically without manual calculation confusion.
                </p>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Smart Debt Simplification
                  </span>
                  <span className="text-slate-400 font-mono">Fyndra Studio #01</span>
                </div>
              </div>

              {/* Card 2: TaskPulse (In Development Preview) */}
              <div className="relative rounded-2xl p-4 bg-slate-50/90 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 space-y-2 opacity-90 hover:opacity-100 transition-opacity">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        TaskPulse
                      </div>
                      <span className="text-[10px] text-slate-500">Productivity & Time Management</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300">
                    In Development
                  </span>
                </div>
              </div>

              {/* Card 3: Studio Pipeline Badge */}
              <div className="p-3.5 rounded-xl bg-slate-900 text-white border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Box className="w-4 h-4 text-brand-400" />
                  <span className="font-medium">Fyndra Studio Portfolio</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">10–12 App Roadmap</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
