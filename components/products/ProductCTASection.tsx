import React from "react";
import { ArrowDown } from "lucide-react";
import { Product } from "@/data/products";
import { PlayStoreButton } from "./PlayStoreButton";

interface ProductCTASectionProps {
  product: Product;
}

export function ProductCTASection({ product }: ProductCTASectionProps) {
  return (
    <section className="py-20 bg-slate-900 text-white text-center border-t border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Ready to simplify shared expenses?
        </h2>
        <p className="text-slate-300 max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
          Get {product.name} and keep your group expenses organized with zero mathematical confusion.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          {product.playStoreUrl ? (
            <PlayStoreButton url={product.playStoreUrl} size="lg" />
          ) : (
            <a
              href="#download"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm sm:text-base shadow-lg shadow-brand-500/25 transition-all hover:scale-[1.02]"
            >
              <span>Get {product.name}</span>
              <ArrowDown className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
