"use client";

import React from "react";
import { motion } from "framer-motion";
import { Wrench, Feather, Compass } from "lucide-react";

export function Philosophy() {
  const principles = [
    {
      title: "Useful",
      description: "We build products that solve real problems.",
      details:
        "Every application we launch addresses genuine everyday utility—no gimmick features, no noise.",
      icon: Wrench,
      accent: "from-brand-500 to-sky-500",
      badge: "Purpose",
    },
    {
      title: "Simple",
      description: "Complex problems deserve simple experiences.",
      details:
        "We distill complicated workflows into clean, elegant interfaces that feel natural from the first tap.",
      icon: Feather,
      accent: "from-sky-500 to-indigo-500",
      badge: "Clarity",
    },
    {
      title: "Thoughtful",
      description: "Every interaction should have a purpose.",
      details:
        "From typography to micro-animations and accessibility, every detail is engineered with intention.",
      icon: Compass,
      accent: "from-indigo-500 to-brand-600",
      badge: "Craftsmanship",
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-white dark:bg-[#0b0f17] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Our Operating Principles
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Designed with Purpose & Precision
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
            How Fyndra Labs approaches building digital software and mobile applications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {principles.map((p, idx) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="group relative p-8 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 hover:border-brand-500/50 hover:shadow-xl dark:hover:shadow-glow transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${p.accent} flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono font-semibold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                      {p.badge}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {p.title}
                  </h3>

                  <p className="text-sm font-semibold text-brand-600 dark:text-brand-400">
                    {p.description}
                  </p>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                    {p.details}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
