import React from "react";
import { Product } from "@/data/products";
import { ProductHeader } from "./ProductHeader";
import { ProductFooter } from "./ProductFooter";

interface ProductLayoutProps {
  product: Product;
  children: React.ReactNode;
}

export function ProductLayout({ product, children }: ProductLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0b0f17] text-slate-900 dark:text-white transition-colors">
      <ProductHeader product={product} />
      <main className="flex-grow pt-16 sm:pt-20">{children}</main>
      <ProductFooter product={product} />
    </div>
  );
}
