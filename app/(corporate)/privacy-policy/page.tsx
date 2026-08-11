import { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy Policy for ${siteConfig.name} and its mobile software applications.`,
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHeader
        badge="Legal & Transparency"
        title="Privacy Policy"
        description="How Fyndra Labs handles data, user privacy, and mobile application security."
      />

      <section className="py-16 lg:py-24 bg-white dark:bg-[#0b0f17]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-700 dark:text-slate-300 space-y-8 leading-relaxed">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-mono text-slate-500">
            Last Updated: August 2026 • Effective Date: August 2026
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              1. Overview & Commitment
            </h2>
            <p className="text-sm">
              {siteConfig.name} (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) develops software and mobile applications designed with privacy and simplicity as core priorities. This Privacy Policy outlines how our website and products collect, use, and protect your information when you interact with our services or use apps such as SplitMate.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              2. Information We Collect
            </h2>
            <p className="text-sm">
              We minimize data collection to only what is strictly necessary to deliver functional software:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>
                <strong>Application Data:</strong> Information created within our applications (e.g. group expense names, balances, transaction logs in SplitMate) stored locally or synced securely to enable real-time collaboration.
              </li>
              <li>
                <strong>Contact Information:</strong> If you voluntarily reach out via our contact form or support email ({siteConfig.supportEmail}), we collect your name, email address, and message contents.
              </li>
              <li>
                <strong>Technical Telemetry:</strong> Standard non-identifying diagnostics (app crash reports, OS version) used solely to resolve software bugs and improve stability.
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              3. Data Usage & Security
            </h2>
            <p className="text-sm">
              We do not sell, rent, or monetize your personal data. Data collected is used strictly to operate, maintain, and enhance the utility of our applications. We implement industry-standard encryption protocols during transmission and storage.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              4. Third-Party Services
            </h2>
            <p className="text-sm">
              Our mobile applications may integrate with platform services such as Google Play Services or Firebase for cloud synchronization and push notifications. These third-party services operate under their respective privacy policies.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              5. Contact Us
            </h2>
            <p className="text-sm">
              If you have any questions or privacy inquiries regarding {siteConfig.name} software, please email us at{" "}
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
