import React from "react";
import { Plane, Users, Heart, Home, Sparkles, LucideIcon } from "lucide-react";
import { Product } from "@/data/products";

interface ProductUseCasesProps {
  product: Product;
}

export function ProductUseCases({ product }: ProductUseCasesProps) {
  const iconMap: Record<string, LucideIcon> = {
    Plane: Plane,
    Users: Users,
    Heart: Heart,
    Home: Home,
    Sparkles: Sparkles,
  };

  return (
    <section className="py-14 bg-slate-50/50 dark:bg-slate-950/40 border-y border-slate-200/60 dark:border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Real-Life Use Cases
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Built for any group occasion.
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {product.useCases.map((uc, idx) => {
            const IconComp = iconMap[uc.iconName] || Sparkles;
            return (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-2 shadow-sm"
              >
                <div className="w-9 h-9 mx-auto rounded-lg bg-brand-50 dark:bg-brand-950/80 text-brand-500 flex items-center justify-center">
                  <IconComp className="w-4 h-4" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  {uc.title}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                  {uc.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
