"use client";

import React, { useState } from "react";
import { Product } from "@/data/products";
import { ProductCard } from "./ProductCard";
import { PlusCircle, Sparkles } from "lucide-react";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="space-y-8">
      {/* Category filter tabs */}
      {categories.length > 2 && (
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
                selectedCategory === cat
                  ? "bg-brand-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Grid of Product Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredProducts.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}

        {/* Future Product Card Placeholder to demonstrate scalability */}
        <div className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800/80 p-8 flex flex-col items-center justify-center text-center bg-slate-50/50 dark:bg-slate-900/30">
          <div className="w-12 h-12 rounded-2xl bg-slate-200/60 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-4">
            <PlusCircle className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">
            More Apps Coming Soon
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed mb-4">
            Fyndra Labs is actively crafting new mobile tools and software products.
          </p>
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-600 dark:text-brand-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>10–12 Applications In Pipeline</span>
          </div>
        </div>
      </div>
    </div>
  );
}
