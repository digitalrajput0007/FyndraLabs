import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/data/products";
import { ProductLayout } from "@/components/products/ProductLayout";
import { Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — SplitMate",
  description: "Privacy Policy for the SplitMate application by Fyndra Labs.",
};

export default function SplitMatePrivacyPage() {
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
              <Shield className="w-3.5 h-3.5 text-brand-500" />
              <span>SplitMate Legal</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              SplitMate Privacy Policy
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-mono">
              Last updated: August 2026 • Product by Fyndra Labs
            </p>
          </div>

          <div className="prose dark:prose-invert max-w-none space-y-6 text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
            <section className="space-y-2 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                1. Overview & Information Collection
              </h2>
              <p>
                SplitMate is an expense tracking application developed by Fyndra Labs. We respect your privacy and are committed to protecting personal data collected when you use our mobile application and related services.
              </p>
            </section>

            <section className="space-y-2 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                2. Data We Collect
              </h2>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Account Information:</strong> Name, email address, and profile details provided during registration.</li>
                <li><strong>Group & Expense Data:</strong> Group names, member names, bill titles, amounts, and transaction logs entered into the application.</li>
                <li><strong>Device Diagnostics:</strong> Basic app crash reports and performance metrics used solely to resolve bugs and optimize performance.</li>
              </ul>
            </section>

            <section className="space-y-2 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                3. How Data is Used
              </h2>
              <p>
                Your expense and balance data is used strictly to calculate net balances between group members, maintain expense history, and synchronize group entries. We do not sell your personal data to third parties.
              </p>
            </section>

            <section className="space-y-2 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                4. Data Protection & Security
              </h2>
              <p>
                We enforce industry-standard technical safeguards to protect information against unauthorized access, disclosure, or alteration.
              </p>
            </section>

            <section className="space-y-2 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                5. Account Deletion & Rights
              </h2>
              <p>
                You have the right to request deletion of your SplitMate account and associated personal data at any time. Visit our dedicated <Link href="/products/splitmate/delete-account" className="text-brand-600 dark:text-brand-400 font-semibold underline">Account Deletion Page</Link> to submit a request.
              </p>
            </section>

            <section className="space-y-2 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                6. Contact Us
              </h2>
              <p>
                For any privacy questions or requests regarding your data, please contact Fyndra Labs at <a href={`mailto:${product.supportEmail}`} className="text-brand-600 dark:text-brand-400 font-semibold">{product.supportEmail}</a>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </ProductLayout>
  );
}
