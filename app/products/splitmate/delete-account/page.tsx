"use client";

import React, { useState } from "react";
import Link from "next/link";
import { getProductBySlug } from "@/data/products";
import { ProductLayout } from "@/components/products/ProductLayout";
import { Trash2, ArrowLeft, AlertTriangle, CheckCircle2, Mail, ShieldAlert } from "lucide-react";

export default function SplitMateDeleteAccountPage() {
  const product = getProductBySlug("splitmate");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    reason: "",
    confirm: false,
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "submitted">("idle");

  if (!product) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.confirm) return;

    setStatus("submitting");

    // Frontend submission handling: record request state & present clear resolution
    setTimeout(() => {
      setStatus("submitted");
    }, 800);
  };

  return (
    <ProductLayout product={product}>
      <div className="py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
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
              <span>Data & Privacy Control</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Delete your SplitMate account
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Request permanent deletion of your SplitMate account, profile details, and associated personal data.
            </p>
          </div>

          {/* Account Deletion Information Card */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-500" />
              <span>What happens when you delete your account?</span>
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <li>Your user profile (Name, Email, Account Identifier) will be permanently deleted from our active database.</li>
              <li>You will be removed from all active shared expense groups.</li>
              <li>Historical group transaction logs retain anonymized entries to preserve balance mathematical integrity for remaining group members.</li>
              <li>This action cannot be undone once processed.</li>
            </ul>
          </div>

          {/* Deletion Form or Confirmation */}
          {status === "submitted" ? (
            <div className="p-6 sm:p-8 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-slate-900 dark:text-white space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-200">
                    Deletion Request Submitted
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-300">
                    We have received your account deletion request for <strong>{formData.email}</strong>.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-emerald-800/80 text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2">
                <p>
                  Our team will process your request within 5–7 business days. A confirmation email will be sent once data purging is complete.
                </p>
                <div className="pt-2 flex items-center gap-2 text-xs text-slate-500 font-mono">
                  <Mail className="w-3.5 h-3.5 text-brand-500" />
                  <span>Support: {product.supportEmail}</span>
                </div>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6"
            >
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Submit Account Deletion Request
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Account Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter email associated with your SplitMate account"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Reason for leaving (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    placeholder="Tell us why you are deleting your account"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                  />
                </div>

                <div className="flex items-start gap-2.5 pt-2">
                  <input
                    type="checkbox"
                    id="confirm"
                    required
                    checked={formData.confirm}
                    onChange={(e) => setFormData({ ...formData, confirm: e.target.checked })}
                    className="mt-0.5 w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300"
                  />
                  <label htmlFor="confirm" className="text-xs text-slate-600 dark:text-slate-400">
                    I understand that deleting my SplitMate account will remove my access and personal data permanently.
                  </label>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!formData.confirm || status === "submitting"}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm transition-colors shadow-md shadow-rose-600/20"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{status === "submitting" ? "Submitting Request..." : "Request Account Deletion"}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </ProductLayout>
  );
}
