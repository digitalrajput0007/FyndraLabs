"use client";

import Image from "next/image";
import { ArrowDown, CheckCircle2 } from "lucide-react";
import { Product } from "@/data/products";
import { PlayStoreButton } from "./PlayStoreButton";
import { SplitMateMockup } from "./SplitMateMockup";

interface ProductHeroProps {
  product: Product;
}

export function ProductHero({ product }: ProductHeroProps) {
  return (
    <section className="relative pt-6 pb-16 lg:pt-12 lg:pb-24 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-500/15 via-sky-400/10 to-transparent blur-3xl opacity-70 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            {/* Product Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/80 border border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-300 text-xs font-semibold">
              <div className="w-5 h-5 relative shrink-0">
                <Image
                  src={product.icon}
                  alt={`${product.name} Icon`}
                  width={20}
                  height={20}
                  className="w-full h-full object-contain"
                />
              </div>
              <span>{product.name} Mobile App</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
              Shared expenses, <span className="text-brand-500">simplified.</span>
            </h1>

            {/* Supporting copy */}
            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
              Split expenses, track balances, manage groups, and see exactly who owes what.
            </p>

            {/* CTAs */}
            <div id="download" className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
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

              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-sm sm:text-base transition-colors border border-slate-200/80 dark:border-slate-700/60"
              >
                <span>See How It Works</span>
              </a>
            </div>

            {/* Factual Value Highlights */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-left max-w-md mx-auto lg:mx-0 border-t border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Group Expenses</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Net Balances</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300 col-span-2 sm:col-span-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>1-Tap Settlement</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Image Showcase */}
          <div className="lg:col-span-6 flex justify-center">
            {product.heroImage ? (
              <div className="relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-900 group">
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-500/10 via-transparent to-sky-500/10 pointer-events-none z-10" />
                <Image
                  src={product.heroImage}
                  alt={`${product.name} App Preview`}
                  width={1200}
                  height={800}
                  className="w-full h-auto object-cover rounded-3xl transform group-hover:scale-[1.01] transition-transform duration-300"
                  priority
                />
              </div>
            ) : (
              <SplitMateMockup />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
