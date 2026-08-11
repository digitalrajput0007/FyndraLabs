import React from "react";
import Link from "next/link";
import { ArrowRight, Receipt, Zap, HeartPulse, Box } from "lucide-react";
import { Product } from "@/data/products";
import { Badge } from "@/components/ui/Badge";
import { PlayStoreButton } from "./PlayStoreButton";

interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

export function ProductCard({ product, featured = false }: ProductCardProps) {
  const isAvailable = product.status === "Active";

  const iconMap: Record<string, any> = {
    splitmate: Receipt,
    taskpulse: Zap,
    habitflow: HeartPulse,
  };

  const IconComp = iconMap[product.slug] || Box;

  return (
    <div
      className={`group relative rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 transition-all duration-300 hover:shadow-xl dark:hover:shadow-glow hover:-translate-y-1 flex flex-col justify-between ${
        featured ? "ring-2 ring-brand-500/20" : ""
      }`}
    >
      <div>
        {/* Top bar: Category + Status */}
        <div className="flex items-center justify-between gap-2 mb-6">
          <Badge variant="primary">{product.category}</Badge>
          <Badge
            variant={
              product.status === "Active"
                ? "success"
                : product.status === "In Development"
                ? "secondary"
                : "outline"
            }
          >
            {product.status}
          </Badge>
        </div>

        {/* Title + Logo */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200 shrink-0">
            <IconComp className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
              {product.name}
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Fyndra Labs Product • {product.releaseYear}
            </span>
          </div>
        </div>

        {/* Tagline */}
        <p className="text-slate-800 dark:text-slate-200 font-medium text-sm mb-2">
          {product.tagline}
        </p>

        {/* Description */}
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
          {product.description}
        </p>
      </div>

      {/* Footer CTAs */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
        <Link
          href={`/products/${product.slug}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors group/link"
        >
          <span>View Details</span>
          <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
        </Link>

        {isAvailable && (
          <PlayStoreButton url={product.playStoreUrl} size="sm" />
        )}
      </div>
    </div>
  );
}
