import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/data/products";
import { ProductLayout } from "@/components/products/ProductLayout";
import { FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — SplitMate",
  description: "Terms of Service for the SplitMate application by Fyndra Labs.",
};

export default function SplitMateTermsPage() {
  const product = getProductBySlug("splitmate");

  if (!product) {
    notFound();
  }

  return (
    <ProductLayout product={product}>
      <div className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <Link
            href="/products/splitmate"
            className="inline-flex items-center gap-2 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to SplitMate</span>
          </Link>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
              <FileText className="w-3.5 h-3.5 text-brand-500" />
              <span>SplitMate Terms</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              SplitMate Terms of Service
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-mono">
              Last updated: August 2026 • Product by Fyndra Labs
            </p>
          </div>

          <div className="prose dark:prose-invert max-w-none space-y-6 text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
            <section className="space-y-2 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                1. Acceptance of Terms
              </h2>
              <p>
                By downloading, accessing, or using SplitMate, you agree to be bound by these Terms of Service. SplitMate is provided by Fyndra Labs as a tool for tracking and splitting shared expenses.
              </p>
            </section>

            <section className="space-y-2 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                2. Use of Service & User Responsibility
              </h2>
              <p>
                SplitMate provides balance calculation and expense logging. Users are responsible for the accuracy of bill amounts and transaction details entered into the application. SplitMate is an informational tracking tool and does not process financial transfers directly unless integrated with third-party payment providers.
              </p>
            </section>

            <section className="space-y-2 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                3. User Accounts & Integrity
              </h2>
              <p>
                You must provide accurate information when creating an account and maintain the confidentiality of your account credentials. Misuse, unlawful activity, or attempting to compromise the security of the application is strictly prohibited.
              </p>
            </section>

            <section className="space-y-2 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                4. Intellectual Property
              </h2>
              <p>
                All trademarks, application assets, designs, and code associated with SplitMate belong to Fyndra Labs.
              </p>
            </section>

            <section className="space-y-2 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                5. Contact & Support
              </h2>
              <p>
                For support inquiries, reach out to Fyndra Labs at <a href={`mailto:${product.supportEmail}`} className="text-brand-600 dark:text-brand-400 font-semibold">{product.supportEmail}</a>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </ProductLayout>
  );
}
