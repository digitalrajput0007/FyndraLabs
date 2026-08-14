"use client";

import React, { useState } from "react";
import Link from "next/link";
import { getProductBySlug } from "@/data/products";
import { ProductLayout } from "@/components/products/ProductLayout";
import {
  Trash2,
  ArrowLeft,
  CheckCircle2,
  Mail,
  ShieldAlert,
  AlertCircle,
  RefreshCw,
  Smartphone,
  Globe,
  ShieldCheck,
  Clock,
  Database,
  HelpCircle,
} from "lucide-react";

export default function SplitMateDeleteAccountPage() {
  const product = getProductBySlug("splitmate");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    reason: "",
    confirm: false,
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "submitted" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [submissionInfo, setSubmissionInfo] = useState<{
    requestId?: string;
    message?: string;
    detail?: string;
  }>({});

  if (!product) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.confirm) return;

    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/products/splitmate/delete-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.name,
          email: formData.email,
          reason: formData.reason,
          confirm: formData.confirm,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to submit deletion request. Please try again.");
      }

      setSubmissionInfo({
        requestId: data.requestId,
        message: data.message || "Deletion Request Received",
        detail:
          data.detail ||
          "Your request has been securely submitted. We will verify your account ownership and process your data deletion within 30 days.",
      });
      setStatus("submitted");
    } catch (err: any) {
      console.error("[Deletion Request Submission Error]:", err);
      setErrorMessage(err.message || "An unexpected error occurred. Please check your connection and try again.");
      setStatus("error");
    }
  };

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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
              <span>Google Play User Data & Account Deletion Compliance</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Delete Your SplitMate Account & Data
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Permanent account erasure request portal for SplitMate by Fyndra Labs.
            </p>
          </div>

          {/* In-App Direct Account Deletion Statement */}
          <div className="p-6 rounded-2xl bg-brand-50/60 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800 space-y-3">
            <div className="flex items-center gap-2 font-bold text-brand-900 dark:text-brand-200 text-sm">
              <Smartphone className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              <span>In-App Direct Account Deletion</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              You can delete your account directly from inside the SplitMate mobile app at any time by navigating to:
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-brand-200 dark:border-brand-800 font-mono text-xs font-bold text-brand-700 dark:text-brand-300">
              <span>Settings</span> &rarr; <span>Delete Account</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              In-app deletion purges your account credentials and personal profile immediately without requiring a web submission.
            </p>
          </div>

          {/* Data Deletion Process */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span>Data Deletion Process</span>
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <li>
                <strong>Permanent Removal:</strong> Account deletion permanently removes your personal account information and credentials from our primary active systems.
              </li>
              <li>
                <strong>Profile Erasure:</strong> Your user profile data (Full Name, Email Address, Phone Number, and Profile Photo URL) is deleted from active Firebase Authentication, Firestore, and Storage databases.
              </li>
              <li>
                <strong>Group Removal:</strong> You are removed from all active shared expense groups and invitations.
              </li>
              <li>
                <strong>Anonymized Expenses:</strong> Historical expense records remain only in anonymized form (&quot;Deleted User&quot;) to maintain exact balance calculations and accounting integrity for remaining group members.
              </li>
              <li>
                <strong>No Identifiers:</strong> No personally identifiable information remains attached to anonymized records.
              </li>
            </ul>
          </div>

          {/* Deletion Timeline */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-brand-500" />
              <span>Deletion Timeline</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              In-app account deletion requests are processed immediately. Web-submitted requests are processed within 30 days of submission after identity verification.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Encrypted backup systems may retain data temporarily for up to 90 days for security, fraud prevention, and legal compliance purposes before automatic, permanent removal.
            </p>
          </div>

          {/* Data Retained After Deletion */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-amber-500" />
              <span>Data Retained After Deletion</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Anonymous transaction history and shared expense tallies remain stored to preserve mathematical accounting integrity for other users in your former groups.
            </p>
            <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/60 text-xs text-slate-700 dark:text-slate-300 space-y-1">
              <p className="font-bold text-emerald-900 dark:text-emerald-300">Complete PII Removal Guarantee:</p>
              <p>
                No name, email address, phone number, profile image, push notification token, or account identifier remains attached to retained expense records.
              </p>
            </div>
          </div>

          {/* Need Help Section */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-brand-500" />
              <span>Need Help?</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              For any questions or support regarding your account deletion request, please contact our support team at:
            </p>
            <a
              href="mailto:support@fyndralabs.com"
              className="inline-flex items-center gap-2 text-sm font-bold text-brand-600 dark:text-brand-400 hover:underline font-mono"
            >
              <Mail className="w-4 h-4" />
              <span>support@fyndralabs.com</span>
            </a>
          </div>

          {/* Clear Warning Box & Form / Success Screen */}
          {status === "submitted" ? (
            <div className="p-6 sm:p-8 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-slate-900 dark:text-white space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-200">
                    {submissionInfo.message || "Deletion Request Received"}
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 mt-1">
                    {submissionInfo.detail ||
                      "Your request has been securely submitted. We will verify your account ownership and process your account deletion within 30 days."}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-emerald-800/80 text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2">
                <div className="flex justify-between items-center text-xs font-mono border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="text-slate-400">Reference ID:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{submissionInfo.requestId}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="text-slate-400">Account Email:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{formData.email}</span>
                </div>
                <div className="pt-2 flex items-center gap-2 text-xs text-slate-500 font-mono">
                  <Mail className="w-3.5 h-3.5 text-brand-500" />
                  <span>Support Email: support@fyndralabs.com</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Clear Warning Box */}
              <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                  <span>Warning: Permanent Account Deletion</span>
                </div>
                <p className="text-xs sm:text-sm text-rose-800 dark:text-rose-300 leading-relaxed">
                  Submitting this request will permanently delete your SplitMate account, authentication credentials, and personal profile details. This action cannot be undone.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6"
              >
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-rose-500" />
                  <span>Web Account Deletion Request Form</span>
                </h3>

                {status === "error" && (
                  <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs sm:text-sm flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-bold">Request Failed</p>
                      <p>{errorMessage}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label htmlFor="fullName" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your full name"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="accountEmail" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Account Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="accountEmail"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Enter email associated with your SplitMate account"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="reason" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Reason for leaving (Optional)
                    </label>
                    <textarea
                      id="reason"
                      rows={3}
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      placeholder="Tell us why you are requesting account deletion"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                    />
                  </div>

                  {/* Confirmation Statement */}
                  <div className="flex items-start gap-2.5 pt-2">
                    <input
                      type="checkbox"
                      id="confirm"
                      required
                      checked={formData.confirm}
                      onChange={(e) => setFormData({ ...formData, confirm: e.target.checked })}
                      className="mt-0.5 w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300"
                    />
                    <label htmlFor="confirm" className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                      I understand that my SplitMate account and associated personal data will be permanently deleted and this action cannot be undone.
                    </label>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={!formData.confirm || status === "submitting"}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm transition-colors shadow-md shadow-rose-600/20"
                  >
                    {status === "submitting" ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Submitting Request...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        <span>Submit Deletion Request</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </ProductLayout>
  );
}
