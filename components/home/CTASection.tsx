import React from "react";
import Link from "next/link";
import { ArrowRight, Mail, Sparkles } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { Button } from "@/components/ui/Button";

export function CTASection() {
  return (
    <section className="py-20 lg:py-24 bg-gradient-to-b from-slate-900 to-slate-950 text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-full bg-gradient-to-r from-brand-600/20 via-sky-600/20 to-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-medium text-brand-200 backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          <span>Building simple, useful software</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight max-w-3xl mx-auto leading-tight">
          Experience thoughtfully designed software applications.
        </h2>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Discover SplitMate and our upcoming suite of utility apps built to streamline daily tasks.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button
            href="/products"
            variant="primary"
            size="lg"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Browse Products Catalog
          </Button>
          <Button
            href="/contact"
            variant="outline"
            size="lg"
            icon={<Mail className="w-4 h-4" />}
            className="border-slate-700 text-white hover:bg-slate-800"
          >
            Contact Support
          </Button>
        </div>
      </div>
    </section>
  );
}
