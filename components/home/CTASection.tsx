import React from "react";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function CTASection() {
  return (
    <section className="py-16 lg:py-20 bg-slate-900 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight max-w-2xl mx-auto leading-tight">
          Useful software, thoughtfully built.
        </h2>

        <p className="text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
          Explore the products we&apos;re building at Fyndra Labs.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Button
            href="/products"
            variant="primary"
            size="lg"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Explore Products
          </Button>
          <Button
            href="/contact"
            variant="outline"
            size="lg"
            icon={<Mail className="w-4 h-4" />}
            className="border-slate-700 text-white hover:bg-slate-800"
          >
            Contact Us
          </Button>
        </div>
      </div>
    </section>
  );
}
