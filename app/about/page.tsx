import { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Philosophy } from "@/components/home/Philosophy";
import { CTASection } from "@/components/home/CTASection";
import { siteConfig } from "@/lib/config";
import { Layers, ShieldCheck, Sparkles, CheckCircle2, Box, Cpu } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Fyndra Labs — an independent product studio building useful, simple, and thoughtfully designed software products.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        badge="About Fyndra Labs"
        title="Building useful software, one product at a time."
        description="We are a modern software and mobile app studio focused on creating practical digital products with thoughtful UX, reliable technology, and simple solutions to everyday problems."
      />

      {/* Main Narrative Section */}
      <section className="py-16 lg:py-24 bg-white dark:bg-[#0b0f17]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Story */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                Our Focus & Purpose
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Craftsmanship over Complexity
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                At {siteConfig.name}, we believe software should make daily tasks simpler, not harder. Modern digital life is too often cluttered with bloated features, invasive popups, and overly complex user interfaces.
              </p>
              <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                Our goal is straightforward: identify everyday problems in expense management, productivity, and utility tools, and design clean, reliable mobile applications that address them directly.
              </p>

              <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                    <CheckCircle2 className="w-4 h-4 text-brand-500" />
                    <span>User-Centered Utility</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Products designed around actual daily needs, verified through real-world usability.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                    <CheckCircle2 className="w-4 h-4 text-brand-500" />
                    <span>Clean Engineering</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Modern React, TypeScript, and native mobile standards built for speed & security.
                  </p>
                </div>
              </div>
            </div>

            {/* Visual Box */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl p-8 bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-slate-800 shadow-2xl space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                  <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white">
                    <Box className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{siteConfig.name}</h3>
                    <p className="text-xs text-slate-400">Independent Product Studio</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-slate-300">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400">Core Mission</span>
                    <span className="font-semibold text-white">Simple & Useful Apps</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400">Flagship App</span>
                    <span className="font-semibold text-brand-400">SplitMate</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400">App Pipeline</span>
                    <span className="font-semibold text-white">10–12 Applications</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <Philosophy />

      <CTASection />
    </>
  );
}
