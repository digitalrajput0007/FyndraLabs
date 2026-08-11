import { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/layout/PageHeader";
import { Philosophy } from "@/components/home/Philosophy";
import { CTASection } from "@/components/home/CTASection";
import { siteConfig } from "@/lib/config";
import { CheckCircle2 } from "lucide-react";

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

      {/* Main Story Section */}
      <section className="py-16 lg:py-20 bg-white dark:bg-[#0b0f17]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Story */}
            <div className="lg:col-span-7 space-y-5">
              <span className="text-xs sm:text-sm font-mono font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                Our Focus & Approach
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Practical utility over complexity
              </h2>
              <p className="text-base sm:text-[17px] lg:text-[18px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                At {siteConfig.name}, we believe software should make daily tasks simpler, not harder. Modern digital tools are often cluttered with unnecessary features, distracting popups, and overly complex user interfaces.
              </p>
              <p className="text-base sm:text-[17px] lg:text-[18px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                Our approach is focused: identify practical problems in daily life—starting with shared expense management in SplitMate—and design clean, reliable applications that solve them directly.
              </p>

              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                    <CheckCircle2 className="w-4.5 h-4.5 text-brand-500" />
                    <span>Focused Utility</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    Products designed around actual daily needs and clear usability.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                    <CheckCircle2 className="w-4.5 h-4.5 text-brand-500" />
                    <span>Clean Engineering</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    Modern tech architecture engineered for performance and privacy.
                  </p>
                </div>
              </div>
            </div>

            {/* Studio Box */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl p-6 sm:p-8 bg-slate-900 text-white border border-slate-800 shadow-xl space-y-5">
                <div className="flex items-center gap-3.5 pb-4 border-b border-slate-800">
                  <div className="relative w-10 h-10 shrink-0">
                    <Image
                      src={siteConfig.assets.icon}
                      alt={`${siteConfig.name} Icon`}
                      width={40}
                      height={40}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{siteConfig.name}</h3>
                    <p className="text-xs text-slate-400">Independent Product Studio</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400">Core Mission</span>
                    <span className="font-semibold text-white">Simple & Useful Software</span>
                  </div>
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400">Featured Application</span>
                    <span className="font-semibold text-brand-400">SplitMate</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Operating Principles */}
      <Philosophy />

      <CTASection />
    </>
  );
}
