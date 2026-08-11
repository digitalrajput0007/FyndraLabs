"use client";

import React, { useState } from "react";
import { Smartphone, CheckCircle2, ShieldCheck, Sparkles, Zap } from "lucide-react";

interface ScreenshotGalleryProps {
  productName: string;
}

export function ScreenshotGallery({ productName }: ScreenshotGalleryProps) {
  const [activeScreen, setActiveScreen] = useState<number>(0);

  const screens = [
    {
      title: "Group Balances Dashboard",
      subtitle: "Instant visibility of net balances and group debts",
      badge: "Real-time Sync",
      color: "from-brand-500/10 to-sky-500/10",
      icon: Smartphone,
    },
    {
      title: "Smart Debt Simplifier",
      subtitle: "Minimizes total money transactions between members",
      badge: "Algorithm Powered",
      color: "from-emerald-500/10 to-teal-500/10",
      icon: Sparkles,
    },
    {
      title: "Categorized Expense Log",
      subtitle: "Detailed history with receipt splitting & notes",
      badge: "Full Transparency",
      color: "from-amber-500/10 to-orange-500/10",
      icon: Zap,
    },
    {
      title: "1-Tap Settlement",
      subtitle: "Mark payments as settled with verified record logs",
      badge: "Instant Record",
      color: "from-purple-500/10 to-indigo-500/10",
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Screen Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {screens.map((screen, idx) => (
          <button
            key={idx}
            onClick={() => setActiveScreen(idx)}
            className={`p-3 rounded-xl border text-left transition-all ${
              activeScreen === idx
                ? "bg-white dark:bg-slate-900 border-brand-500 shadow-md ring-2 ring-brand-500/20"
                : "bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
            }`}
          >
            <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400 block mb-1">
              {screen.badge}
            </span>
            <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {screen.title}
            </div>
          </button>
        ))}
      </div>

      {/* Featured Screenshot Card */}
      <div className="relative rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 overflow-hidden shadow-md">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${screens[activeScreen].color} opacity-60 pointer-events-none`}
        />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 justify-between">
          <div className="space-y-3 max-w-md">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-500" />
              {productName} Interface Feature
            </span>
            <h4 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {screens[activeScreen].title}
            </h4>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
              {screens[activeScreen].subtitle}. Engineered with focus on clarity, dark mode compatibility, and fast performance.
            </p>
          </div>

          {/* Screen Representation */}
          <div className="w-full max-w-xs rounded-2xl p-4 bg-slate-950 text-white shadow-xl border border-slate-800 space-y-3">
            <div className="flex justify-between items-center text-[10px] text-slate-400 border-b border-slate-800 pb-2">
              <span className="font-semibold text-white">{productName} App Preview</span>
              <span>{screens[activeScreen].badge}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="h-2 bg-brand-500/80 rounded-full w-2/3" />
              <div className="h-2 bg-slate-700 rounded-full w-full" />
              <div className="h-2 bg-slate-800 rounded-full w-4/5" />
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 font-semibold">
                +$85.00 Settled
              </div>
              <div className="p-2 rounded-lg bg-brand-950/60 border border-brand-800/60 text-brand-300 font-semibold">
                Auto-Calculated
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
