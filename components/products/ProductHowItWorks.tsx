import React from "react";
import { Product } from "@/data/products";

interface ProductHowItWorksProps {
  product: Product;
}

export function ProductHowItWorks({ product }: ProductHowItWorksProps) {
  return (
    <section id="how-it-works" className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Simple Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            How It Works
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Get your shared expenses organized in 4 straightforward steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {product.howItWorks.map((step) => (
            <div
              key={step.step}
              className="relative p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm hover:border-brand-500/40 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-500 text-white font-mono font-extrabold text-sm flex items-center justify-center shadow-md shadow-brand-500/20">
                0{step.step}
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                {step.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
