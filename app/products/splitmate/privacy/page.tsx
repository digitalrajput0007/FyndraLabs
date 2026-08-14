import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/data/products";
import { ProductLayout } from "@/components/products/ProductLayout";
import { Shield, ArrowLeft, CheckCircle2, Lock, FileText, Server, AlertTriangle, UserCheck, Bell, Activity, Globe2, Trash2 } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — SplitMate",
  description: "Production-grade Privacy Policy for SplitMate by Fyndra Labs, fully compliant with Google Play Store Developer Policies, Firebase services, and Sentry diagnostics.",
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
              <span>SplitMate Legal & Data Safety</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              SplitMate Privacy Policy
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-mono">
              Effective Date: August 14, 2026 • Published by Fyndra Labs
            </p>
          </div>

          <div className="p-4 sm:p-6 rounded-2xl bg-brand-50/50 dark:bg-brand-950/30 border border-brand-200/80 dark:border-brand-800/80 text-xs sm:text-sm text-slate-800 dark:text-slate-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-brand-700 dark:text-brand-300">
              <CheckCircle2 className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              <span>Google Play Data Safety Commitment</span>
            </div>
            <p>
              Fyndra Labs (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) built SplitMate as a secure, shared expense management mobile application. <strong>We do not sell, rent, or trade your personal information to third parties or data brokers.</strong> All data collection is strictly tied to providing group bill splitting, balance calculations, push notifications, and diagnostics.
            </p>
          </div>

          <div className="prose dark:prose-invert max-w-none space-y-8 text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
            
            {/* 1. Introduction */}
            <section className="space-y-3 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                1. Introduction & Overview
              </h2>
              <p>
                This Privacy Policy describes how Fyndra Labs collects, uses, processes, and protects your information when you use the SplitMate mobile application (&quot;App&quot;) and associated web endpoints. SplitMate helps users create groups, track shared expenses, compute settlements, and maintain balance records.
              </p>
              <p>
                By creating an account or using SplitMate, you consent to the collection and use of information in accordance with this policy.
              </p>
            </section>

            {/* 2. Detailed Breakdown of Collected Information */}
            <section className="space-y-3 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                2. Information We Collect
              </h2>
              <p>
                We collect personal and technical information strictly necessary to operate SplitMate&apos;s features:
              </p>

              <div className="space-y-4 pt-2">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm">A. Account Information (Email & Name)</h3>
                  <p className="mt-1">
                    When registering or editing your profile, we collect your full name and email address. Email addresses are authenticated securely via Firebase Authentication to verify identity, manage sessions, and facilitate account recovery.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm">B. Phone Numbers</h3>
                  <p className="mt-1">
                    Phone numbers may be provided voluntarily to facilitate member invitations and user lookup within groups. Phone numbers are stored securely in Firebase Authentication/Firestore and are never shared with external telemarketers or advertisers.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm">C. Profile Photos & Media</h3>
                  <p className="mt-1">
                    If you choose to upload a profile avatar or attach images (such as receipts or expense proofs), these images are transmitted over TLS/SSL encryption and stored in Firebase Storage. Image data is strictly used for display inside your shared groups.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm">D. Expense & Group Data</h3>
                  <p className="mt-1">
                    We collect group names, member assignments, expense titles, bill amounts, currency preferences, split ratios, payment settlement logs, and activity timeline entries stored securely in Cloud Firestore.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm">E. Notifications & Device Tokens</h3>
                  <p className="mt-1">
                    To deliver push notifications when a group member adds an expense or settles a balance, we collect push notification tokens via Expo Notifications and Firebase Cloud Messaging (FCM), alongside basic device model and OS version information.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm">F. Crash Reporting & Diagnostics (Sentry)</h3>
                  <p className="mt-1">
                    We utilize Sentry to capture real-time crash logs, exception stack traces, and app stability metrics. Diagnostic logs may include device model, CPU architecture, OS version, app version, memory usage, and the state of the app at the exact moment of a crash.
                  </p>
                </div>
              </div>
            </section>

            {/* 3. Firebase & Infrastructure Disclosures */}
            <section className="space-y-3 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                3. Firebase Infrastructure & Third-Party Service Disclosures
              </h2>
              <p>
                We do not sell personal data. We disclose data to trusted cloud infrastructure and diagnostics providers under strict confidentiality and security terms:
              </p>

              <div className="space-y-3 pt-2">
                <div className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">Firebase Authentication (Google LLC)</h3>
                  <p className="mt-1">
                    Manages secure user sign-in, token generation, and account authentication states.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">Cloud Firestore (Google LLC)</h3>
                  <p className="mt-1">
                    Stores real-time database documents including group memberships, balances, settlement logs, and user profile metadata with AES-256 encryption at rest.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">Firebase Storage (Google LLC)</h3>
                  <p className="mt-1">
                    Stores user-uploaded profile pictures and receipt images with granular access rules.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">Firebase Cloud Messaging (FCM) & Expo Notifications</h3>
                  <p className="mt-1">
                    Delivers real-time transactional push notifications to device push tokens.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">Sentry (Functional Software, Inc.)</h3>
                  <p className="mt-1">
                    Captures real-time stack traces, crash diagnostics, and performance metrics to ensure app stability.
                  </p>
                </div>
              </div>
            </section>

            {/* 4. Non-Financial & Category Clarifications */}
            <section className="space-y-3 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                4. Explicit Service Boundaries
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>No Financial Services:</strong> SplitMate is a mathematical balance tracking tool. We do not act as a bank, financial institution, lender, money transmitter, payment processor, credit issuer, or investment advisor. We do not process bank transfers or credit card transactions directly.</li>
                <li><strong>No Advertising:</strong> SplitMate currently contains no third-party advertisements, ad trackers, or advertising SDKs.</li>
                <li><strong>No Health Data:</strong> We do not collect, process, or request any health, biometric, or medical data.</li>
                <li><strong>No Location Tracking:</strong> We do not collect real-time background or precise GPS location data.</li>
              </ul>
            </section>

            {/* 5. How We Use Information */}
            <section className="space-y-3 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                5. How We Use Information
              </h2>
              <p>We process collected data exclusively for the following operational purposes:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>To authenticate user identity and prevent unauthorized access.</li>
                <li>To calculate group balances, split logic, and settlement summaries.</li>
                <li>To send transactional push notifications (e.g., &quot;Alex added a $40 expense&quot;).</li>
                <li>To render user profiles and receipts within group views.</li>
                <li>To detect, prevent, and fix technical bugs or crashes via Sentry.</li>
                <li>To enforce our Terms of Service and maintain platform integrity.</li>
              </ul>
            </section>

            {/* 6. Data Security & Storage */}
            <section className="space-y-3 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-brand-500" />
                <span>6. Data Security Measures</span>
              </h2>
              <p>
                We employ industry-standard administrative, physical, and technical safeguards. All data in transit between the SplitMate mobile app and server infrastructure is encrypted using Transport Layer Security (TLS 1.2/1.3). Data at rest in Firebase Cloud Firestore and Cloud Storage is encrypted using AES-256. Firestore Security Rules enforce strict authorization access control so users can only access groups and expenses they belong to.
              </p>
            </section>

            {/* 7. Data Retention & Account Deletion */}
            <section className="space-y-3 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                7. Data Retention & Deletion Rights
              </h2>
              <p>
                We retain your personal data for as long as your account remains active. You have full right and control to request the deletion of your account and personal data at any time.
              </p>
              <p>
                To delete your account:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>In-App:</strong> Go to <strong>Settings</strong> &gt; <strong>Account</strong> &gt; <strong>Delete Account</strong> and confirm.</li>
                <li><strong>Web Request:</strong> Visit our dedicated <Link href="/products/splitmate/delete-account" className="text-brand-600 dark:text-brand-400 font-semibold underline">Account Deletion Portal</Link> to submit a deletion request.</li>
              </ul>
              <p className="pt-2 font-semibold text-slate-900 dark:text-white">
                Effect of Account Deletion:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Your Firebase Authentication account record is permanently removed.</li>
                <li>Your user profile (Name, Email, Phone Number, Profile Photo URL) is permanently deleted from Firestore and Cloud Storage.</li>
                <li>Historical expense records created in shared groups may retain an anonymized placeholder (&quot;Deleted User&quot;) to maintain exact accounting balances for remaining group members.</li>
              </ul>
            </section>

            {/* 8. User Rights */}
            <section className="space-y-3 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                8. User Rights (GDPR / CCPA Compliance)
              </h2>
              <p>Depending on your jurisdiction, you possess the following rights regarding your personal information:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Right of Access:</strong> Request a copy of the personal data held about you.</li>
                <li><strong>Right to Rectification:</strong> Request correction of inaccurate profile data via in-app settings.</li>
                <li><strong>Right to Erasure:</strong> Request permanent deletion of your profile and data.</li>
                <li><strong>Right to Restrict Processing:</strong> Withdraw consent for non-essential push notifications.</li>
              </ul>
            </section>

            {/* 9. Children's Privacy */}
            <section className="space-y-3 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                9. Children&apos;s Privacy
              </h2>
              <p>
                SplitMate is not directed to children under the age of 13 (or 16 in certain European jurisdictions). We do not knowingly collect personal information from children. If we discover that a child under 13 has provided personal data, we will immediately delete such information. If you believe a child has provided us with personal information, please contact us.
              </p>
            </section>

            {/* 10. Google Play Data Safety Summary */}
            <section className="space-y-3 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-500" />
                <span>10. Google Play Data Safety Reference Table</span>
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-xs text-left">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800/60 font-semibold text-slate-900 dark:text-white">
                      <th className="p-2.5">Data Category</th>
                      <th className="p-2.5">Data Type</th>
                      <th className="p-2.5">Collected / Shared</th>
                      <th className="p-2.5">Purpose</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    <tr>
                      <td className="p-2.5 font-medium">Personal Info</td>
                      <td className="p-2.5">Name, Email, Phone</td>
                      <td className="p-2.5 text-emerald-600 font-semibold">Collected (Encrypted)</td>
                      <td className="p-2.5">App functionality & Auth</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium">Photos & Videos</td>
                      <td className="p-2.5">Profile Photo, Receipt Images</td>
                      <td className="p-2.5 text-emerald-600 font-semibold">Collected (Encrypted)</td>
                      <td className="p-2.5">App functionality</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium">Financial Info</td>
                      <td className="p-2.5">Group Bills & Expenses</td>
                      <td className="p-2.5 text-emerald-600 font-semibold">Collected (Encrypted)</td>
                      <td className="p-2.5">App functionality (Splitting)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium">App Diagnostics</td>
                      <td className="p-2.5">Crash logs, Diagnostics (Sentry)</td>
                      <td className="p-2.5 text-emerald-600 font-semibold">Collected (Encrypted)</td>
                      <td className="p-2.5">Analytics & App Performance</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium">Device IDs</td>
                      <td className="p-2.5">Push Token (FCM / Expo)</td>
                      <td className="p-2.5 text-emerald-600 font-semibold">Collected (Encrypted)</td>
                      <td className="p-2.5">Push Notifications</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 11. Changes & Contact */}
            <section className="space-y-3 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                11. Policy Changes & Contact Information
              </h2>
              <p>
                We may update our Privacy Policy periodically. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the &quot;Effective Date&quot; at the top.
              </p>
              <p className="pt-2">
                If you have questions, concerns, or requests regarding this Privacy Policy, please contact us at:
              </p>
              <div className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 font-mono text-xs">
                <p><strong>Entity:</strong> Fyndra Labs Privacy Team</p>
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
