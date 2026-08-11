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
        "Every application we launch addresses genuine everyday utility — no gimmick features, no noise.",
      icon: Wrench,
      accent: "from-brand-600 to-sky-500",
      badge: "Purpose",
    },
    {
      title: "Simple",
      description: "Complex problems deserve simple experiences.",
      details:
        "We distill complicated workflows into clean, intuitive interfaces that feel natural from the first tap.",
      icon: Feather,
      accent: "from-sky-500 to-blue-600",
      badge: "Clarity",
    },
    {
      title: "Thoughtful",
      description: "Every interaction should have a purpose.",
      details:
        "From typography to micro-animations and accessibility, every detail is engineered with care.",
      icon: Compass,
      accent: "from-blue-600 to-brand-700",
      badge: "Craftsmanship",
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-white dark:bg-[#0b0f17] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Our Operating Principles
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Designed with Purpose & Precision
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400">
            How Fyndra Labs approaches building software and mobile applications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {principles.map((p, idx) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="group relative p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 hover:border-brand-500/50 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${p.accent} flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-semibold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                      {p.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {p.title}
                  </h3>

                  <p className="text-xs font-semibold text-brand-600 dark:text-brand-400">
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
