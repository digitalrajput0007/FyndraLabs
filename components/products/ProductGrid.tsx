"use client";

import React from "react";
import { Product } from "@/data/products";
import { ProductCard } from "./ProductCard";
import { Sparkles, Layers } from "lucide-react";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="space-y-12">
      {/* Primary Product Catalog Items */}
      <div className="grid grid-cols-1 max-w-3xl mx-auto gap-8">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} featured />
        ))}
      </div>

      {/* Subtle Future Product Placeholder */}
      <div className="max-w-3xl mx-auto rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-8 text-center bg-slate-50/50 dark:bg-slate-900/30 space-y-3">
        <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center mx-auto">
          <Layers className="w-5 h-5" />
        </div>
        <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
          More products are currently in development
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          Fyndra Labs is actively working on additional mobile and software utility applications. New releases will be added here as they launch.
        </p>
      </div>
    </div>
  );
}
