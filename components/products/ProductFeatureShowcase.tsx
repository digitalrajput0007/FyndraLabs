"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Scale, Receipt, Plus, Users, CheckCircle2, Sparkles } from "lucide-react";
import { Product } from "@/data/products";

interface ProductFeatureShowcaseProps {
  product: Product;
}

export function ProductFeatureShowcase({ product }: ProductFeatureShowcaseProps) {
  const [activeTab, setActiveTab] = useState<"balances" | "expenses" | "split">("balances");

  return (
    <section id="screenshots" className="py-16 sm:py-24 space-y-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 text-center">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
          Interface Showcase
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Explore the SplitMate App
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
          Clean mobile interface engineered for clarity, fast entry, and zero confusion.
        </p>
      </div>

      {/* Feature Section 1: Screenshot Left, Explanation Right (Group Balances) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 flex justify-center">
            {/* Real App Screenshot Card */}
            <div className="relative w-full max-w-sm rounded-[2.5rem] p-2 bg-slate-900 shadow-2xl border-4 border-slate-800 dark:border-slate-700/80 overflow-hidden group">
              <div className="relative rounded-[2rem] overflow-hidden bg-slate-950">
                <Image
                  src="/products/splitmate/showcase-balances.jpg"
                  alt="SplitMate Settlement Center - Who Owes What"
                  width={800}
                  height={800}
                  className="w-full h-auto object-cover rounded-[2rem] transform group-hover:scale-[1.02] transition-transform duration-300"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4 text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-500" />
              Clear Financial Overview
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Instant Visibility of Who Owes What
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
              No more mental math or digging through chat history. SplitMate displays exact individual balances in real time so everyone stays on the same page.
            </p>
          </div>
        </div>
      </div>

      {/* Feature Section 2: Explanation Left, Screenshot Right (Expense Split Logging) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-4 text-center lg:text-left order-2 lg:order-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <Receipt className="w-3.5 h-3.5 text-emerald-500" />
              Flexible Splitting Options
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Add & Split Bills in Seconds
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
              Log expenses on the fly. Whether it’s equal splitting, custom amounts, or specific shares, SplitMate handles the calculation instantly.
            </p>
          </div>

          <div className="lg:col-span-6 flex justify-center order-1 lg:order-2">
            {/* Real App Screenshot Card */}
            <div className="relative w-full max-w-sm rounded-[2.5rem] p-2 bg-slate-900 shadow-2xl border-4 border-slate-800 dark:border-slate-700/80 overflow-hidden group">
              <div className="relative rounded-[2rem] overflow-hidden bg-slate-950">
                <Image
                  src="/products/splitmate/showcase-expenses.png"
                  alt="SplitMate Add & Split Bills - Expense Details"
                  width={800}
                  height={800}
                  className="w-full h-auto object-cover rounded-[2rem] transform group-hover:scale-[1.02] transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Section 3: Screenshot Left, Explanation Right (1-Tap Settlement) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 flex justify-center">
            {/* Real App Screenshot Card */}
            <div className="relative w-full max-w-sm rounded-[2.5rem] p-2 bg-slate-900 shadow-2xl border-4 border-slate-800 dark:border-slate-700/80 overflow-hidden group">
              <div className="relative rounded-[2rem] overflow-hidden bg-slate-950">
                <Image
                  src="/products/splitmate/showcase-settle.png"
                  alt="SplitMate Group Summary - You Are All Settled Up"
                  width={800}
                  height={800}
                  className="w-full h-auto object-cover rounded-[2rem] transform group-hover:scale-[1.02] transition-transform duration-300"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4 text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              Hassle-Free Settlements
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Settle Balances with One Tap
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
              When debts are repaid, mark them as settled instantly. SplitMate keeps your transaction record updated and accurate.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
