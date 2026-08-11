import React from "react";
import { Receipt, Scale, Users, Sparkles, LucideIcon } from "lucide-react";
import { Product } from "@/data/products";

interface ProductFeatureGridProps {
  product: Product;
}

export function ProductFeatureGrid({ product }: ProductFeatureGridProps) {
  const iconMap: Record<string, LucideIcon> = {
    Receipt: Receipt,
    Scale: Scale,
    Users: Users,
    Sparkles: Sparkles,
  };

  return (
    <section id="features" className="py-16 bg-slate-50/70 dark:bg-[#080c14] border-y border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Core Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Everything you need to split expenses.
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            SplitMate gives you clarity over group finances with zero mathematical confusion.
          </p>
        </div>

        {/* 4 Core Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {product.features.slice(0, 4).map((feat, idx) => {
            const IconComp = (feat.icon && iconMap[feat.icon]) || Receipt;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-11 h-11 rounded-xl bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 flex items-center justify-center border border-brand-100 dark:border-brand-900/60">
                  <IconComp className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  {feat.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
