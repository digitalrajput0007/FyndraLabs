import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/data/products";
import { ProductLayout } from "@/components/products/ProductLayout";
import { FileText, ArrowLeft, Shield, AlertTriangle, Scale, CheckCircle2, UserCheck, ShieldAlert, Ban, RefreshCw, HelpCircle } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — SplitMate",
  description: "Production-grade Terms of Service for SplitMate by Fyndra Labs, fully aligned with Google Play Developer Policies and Privacy Policy.",
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
              <span>SplitMate Legal Terms</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              SplitMate Terms of Service
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-mono">
              Effective Date: August 14, 2026 • Published by Fyndra Labs
            </p>
          </div>

          <div className="prose dark:prose-invert max-w-none space-y-8 text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
            
            {/* 1. Acceptance of Terms */}
            <section className="space-y-3 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                1. Acceptance of Terms
              </h2>
              <p>
                These Terms of Service (&quot;Terms&quot;) govern your download, installation, access, and use of the SplitMate mobile application (&quot;App&quot;) and associated web properties provided by Fyndra Labs (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
              </p>
              <p>
                By creating an account or accessing SplitMate, you agree to comply with these Terms and our <Link href="/products/splitmate/privacy" className="text-brand-600 dark:text-brand-400 font-semibold underline">Privacy Policy</Link>. If you do not agree, you must discontinue using the App immediately.
              </p>
            </section>

            {/* 2. Eligibility & Account Registration */}
            <section className="space-y-3 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-brand-500" />
                <span>2. Eligibility & Account Registration</span>
              </h2>
              <p>
                You must be at least 13 years of age (or 16 in certain jurisdictions) to create an account or use SplitMate. By registering an account via Firebase Authentication, you represent and warrant that:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>You possess the legal capacity to enter into binding contracts.</li>
                <li>All profile information submitted (Name, Email, Phone Number) is accurate, current, and complete.</li>
                <li>You are responsible for safeguarding your account login credentials.</li>
                <li>You will immediately notify Fyndra Labs of any unauthorized access to your account.</li>
              </ul>
            </section>

            {/* 3. User Responsibilities, Group Expenses & Settlement Responsibility */}
            <section className="space-y-3 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                3. User Responsibilities, Group Expenses & Settlement Integrity
              </h2>
              <p>
                SplitMate serves as a platform for users to calculate, log, and split shared expenses across groups.
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Accuracy of Expenses:</strong> You are solely responsible for verifying bill titles, amounts, split ratios, and currencies entered into group logs.</li>
                <li><strong>Settlement Responsibility:</strong> Actual monetary settlements (e.g., cash, bank transfers, or third-party payment apps) occur outside of SplitMate between group members. You are solely responsible for completing debts owed to group members.</li>
                <li><strong>Group Invitations:</strong> You must only invite individuals to groups with their consent.</li>
              </ul>
            </section>

            {/* 4. Explicit No Financial Services Disclaimer */}
            <section className="space-y-3 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Scale className="w-4 h-4 text-brand-500" />
                <span>4. No Financial Services Disclaimer</span>
              </h2>
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Important Disclaimer</span>
                </div>
                <p>
                  SplitMate is an informational software utility designed strictly for mathematical expense tracking. SplitMate is NOT a bank, credit union, financial institution, money transmitter, lender, credit broker, investment advisor, or payment processor.
                </p>
                <p>
                  SplitMate does not hold monetary deposits, process direct peer-to-peer wire transfers, issue credit products, or guarantee debt collection. Balance summaries displayed in the App are mathematical calculations based solely on user inputs.
                </p>
              </div>
            </section>

            {/* 5. Prohibited Conduct */}
            <section className="space-y-3 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Ban className="w-4 h-4 text-rose-500" />
                <span>5. Prohibited Conduct</span>
              </h2>
              <p>When using SplitMate, you agree NOT to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Input false, fraudulent, misleading, or fictitious expense records.</li>
                <li>Upload abusive, defamatory, illegal, explicit, or infringing receipt images or media.</li>
                <li>Attempt to reverse engineer, decompile, or tamper with the App binary or source code.</li>
                <li>Interfere with or compromise the security of our cloud infrastructure (Firebase) or diagnostic tools (Sentry).</li>
                <li>Harass, stalk, or send spam invitations to other users.</li>
                <li>Violate any applicable local, state, national, or international laws.</li>
              </ul>
            </section>

            {/* 6. Intellectual Property */}
            <section className="space-y-3 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                6. Intellectual Property Rights
              </h2>
              <p>
                The SplitMate software, UI designs, code, logos, trademarks, and documentation are the exclusive intellectual property of Fyndra Labs. We grant you a limited, non-exclusive, non-transferable, revocable license to use SplitMate for personal, non-commercial purposes.
              </p>
            </section>

            {/* 7. Third-Party Services & Infrastructure */}
            <section className="space-y-3 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                7. Third-Party Services
              </h2>
              <p>
                SplitMate integrates third-party cloud infrastructure, including Google Firebase (Auth, Firestore, Storage, FCM), Expo, and Sentry. Your use of the App is subject to these providers&apos; respective terms and privacy policies. Fyndra Labs is not responsible for outages or performance disruptions caused by third-party infrastructure.
              </p>
            </section>

            {/* 8. Service Availability & Account Suspension */}
            <section className="space-y-3 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                8. Service Availability & Account Suspension
              </h2>
              <p>
                We strive to maintain continuous service availability, but we do not guarantee uninterrupted uptime. Fyndra Labs reserves the right to modify, suspend, or terminate accounts or app features without notice if we detect violations of these Terms, abusive activity, or security vulnerabilities.
              </p>
              <p>
                You may delete your account at any time via in-app settings or through our <Link href="/products/splitmate/delete-account" className="text-brand-600 dark:text-brand-400 font-semibold underline">Account Deletion Page</Link>.
              </p>
            </section>

            {/* 9. Disclaimer of Warranties */}
            <section className="space-y-3 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                9. Disclaimer of Warranties
              </h2>
              <p>
                SPLITMATE IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS. FYNDRA LABS DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT CALCULATIONS WILL BE ENTIRELY ERROR-FREE OR THAT THE APP WILL BE FREE FROM MALWARE.
              </p>
            </section>

            {/* 10. Limitation of Liability */}
            <section className="space-y-3 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                10. Limitation of Liability
              </h2>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, FYNDRA LABS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUE, WHETHER INCURRED DIRECTLY OR INDIRECTLY, ARISING FROM YOUR ACCESS TO OR USE OF SPLITMATE.
              </p>
            </section>

            {/* 11. Changes to Terms & Contact */}
            <section className="space-y-3 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                11. Changes to Terms & Contact Information
              </h2>
              <p>
                We reserve the right to modify these Terms at any time. We will notify users of material revisions by updating the &quot;Effective Date&quot; above. Continued use of SplitMate following updates constitutes acceptance of revised Terms.
              </p>
              <p className="pt-2">
                For questions or legal notices regarding these Terms, contact:
              </p>
              <div className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 font-mono text-xs">
                <p><strong>Legal Entity:</strong> Fyndra Labs Legal Department</p>
                <p><strong>Email:</strong> <a href={`mailto:${product.supportEmail}`} className="text-brand-600 dark:text-brand-400 underline">{product.supportEmail}</a></p>
                <p><strong>Website:</strong> <a href="https://www.fyndralabs.com" target="_blank" rel="noopener noreferrer" className="text-brand-600 dark:text-brand-400 underline">https://www.fyndralabs.com</a></p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </ProductLayout>
  );
}
