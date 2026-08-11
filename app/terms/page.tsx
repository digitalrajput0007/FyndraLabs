import { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: `Terms of Service and Conditions for using ${siteConfig.name} products.`,
};

export default function TermsPage() {
  return (
    <>
      <PageHeader
        badge="Legal Agreement"
        title="Terms & Conditions"
        description="The rules and terms governing the use of Fyndra Labs applications and website."
      />

      <section className="py-16 lg:py-24 bg-white dark:bg-[#0b0f17]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-700 dark:text-slate-300 space-y-8 leading-relaxed">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-mono text-slate-500">
            Last Updated: August 2026 • Effective Date: August 2026
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              1. Agreement to Terms
            </h2>
            <p className="text-sm">
              By accessing the official website of {siteConfig.name} or downloading and using any of our mobile applications (including SplitMate), you agree to be bound by these Terms & Conditions. If you do not agree to these terms, please do not use our services.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              2. Product Usage & License
            </h2>
            <p className="text-sm">
              {siteConfig.name} grants you a revocable, non-exclusive, non-transferable, limited license to download, install, and use our mobile applications strictly in accordance with these Terms. You agree not to reverse engineer, decompile, or modify any portion of our software.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              3. Disclaimer of Financial Advice
            </h2>
            <p className="text-sm">
              Applications such as SplitMate are expense calculation tools designed to assist in organizing shared group costs. Our software does not constitute financial, legal, or banking services. Users remain solely responsible for verifying transaction records and settling balances.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              4. Intellectual Property
            </h2>
            <p className="text-sm">
              All branding, visual designs, app code, logos, and trademarks associated with {siteConfig.name} and SplitMate are the exclusive property of {siteConfig.name}.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              5. Support & Inquiries
            </h2>
            <p className="text-sm">
              For questions regarding these Terms, please contact our support team at{" "}
              <a
                href={`mailto:${siteConfig.supportEmail}`}
                className="text-brand-600 dark:text-brand-400 font-semibold underline"
              >
                {siteConfig.supportEmail}
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
