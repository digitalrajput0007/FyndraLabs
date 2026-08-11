"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Receipt, CheckCircle2, Sparkles, Scale, Users, UserPlus, FolderKanban } from "lucide-react";
import { getFeaturedProducts } from "@/data/products";
import { SplitMateMockup } from "@/components/products/SplitMateMockup";
import { PlayStoreButton } from "@/components/products/PlayStoreButton";

export function FeaturedProduct() {
  const featuredProduct = getFeaturedProducts()[0];

  if (!featuredProduct) return null;

  const featureIcons = [
    { title: "Split Expenses Easily", desc: "Equal splits, percentages, or exact amounts", icon: Receipt },
    { title: "Track Balances", desc: "Instant overview of who owes what with zero math errors", icon: Scale },
    { title: "Manage Groups", desc: "Organize trips, housemates, or dinners seamlessly", icon: Users },
    { title: "Invite & Sync", desc: "Collaborate in real-time with group members", icon: UserPlus },
    { title: "Keep Organized", desc: "Categorize spending & attach receipt details", icon: FolderKanban },
    { title: "Transparent Calculations", desc: "Smart debt simplification reduces total transactions", icon: Sparkles },
  ];

  return (
    <section className="py-20 lg:py-28 bg-slate-50/70 dark:bg-[#080c14] border-y border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400 border border-brand-200 dark:border-brand-800">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Featured Product</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Our Products
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
            A growing collection of apps designed to make everyday tasks simpler.
          </p>
        </div>

        {/* Featured SplitMate Showcase Box */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Info & Feature Highlights */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-sky-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
                  <Receipt className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-mono font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                    {featuredProduct.category}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {featuredProduct.name}
                  </h3>
                </div>
              </div>

              <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                {featuredProduct.description}
              </p>

              {/* Feature Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {featureIcons.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60">
                      <div className="w-7 h-7 rounded-lg bg-brand-500/10 text-brand-500 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 leading-normal">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* CTAs */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Link
                  href={`/products/${featuredProduct.slug}`}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md transition-all duration-200"
                >
                  <span>View Full Product Details</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <PlayStoreButton url={featuredProduct.playStoreUrl} size="md" />
              </div>
            </div>

            {/* Right App UI Mockup */}
            <div className="lg:col-span-6">
              <SplitMateMockup />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
