"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { siteConfig } from "@/lib/config";
import { Mail, Send, CheckCircle2, AlertCircle, Sparkles, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = "Please enter your name.";
    if (!formData.email.trim()) {
      errs.email = "Please enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = "Please enter a valid email address.";
    }
    if (!formData.subject.trim()) errs.subject = "Please enter a subject.";
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errs.message = "Please enter a message of at least 10 characters.";
    }
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // Simulate API service submission point
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch {
      setErrors({ form: "Failed to send message. Please try again or email us directly." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        badge="Get in Touch"
        title="Let's build something useful."
        description="Have questions about SplitMate, feedback on our products, or inquiry about Fyndra Labs? Send us a message."
      />

      <section className="py-16 lg:py-24 bg-white dark:bg-[#0b0f17]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Contact Form Column */}
            <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-900/60 p-8 sm:p-10 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-lg">
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Message Sent Successfully
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm max-w-md mx-auto">
                    Thank you for reaching out to Fyndra Labs. We have received your submission and will get back to you shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline pt-2"
                  >
                    <span>Send another message</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  {errors.form && (
                    <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errors.form}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <label
                        htmlFor="name"
                        className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                      >
                        Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Your full name"
                        className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-950 border text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors ${
                          errors.name
                            ? "border-rose-500 focus:ring-rose-500"
                            : "border-slate-200 dark:border-slate-800"
                        }`}
                      />
                      {errors.name && (
                        <p className="text-xs text-rose-500">{errors.name}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                      >
                        Email <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="you@example.com"
                        className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-950 border text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors ${
                          errors.email
                            ? "border-rose-500 focus:ring-rose-500"
                            : "border-slate-200 dark:border-slate-800"
                        }`}
                      />
                      {errors.email && (
                        <p className="text-xs text-rose-500">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <label
                      htmlFor="subject"
                      className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                    >
                      Subject <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="subject"
                      type="text"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      placeholder="e.g. SplitMate Feedback / Inquiry"
                      className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-950 border text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors ${
                        errors.subject
                          ? "border-rose-500 focus:ring-rose-500"
                          : "border-slate-200 dark:border-slate-800"
                      }`}
                    />
                    {errors.subject && (
                      <p className="text-xs text-rose-500">{errors.subject}</p>
                    )}
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <label
                      htmlFor="message"
                      className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                    >
                      Message <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="Tell us how we can help..."
                      className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-950 border text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors ${
                        errors.message
                          ? "border-rose-500 focus:ring-rose-500"
                          : "border-slate-200 dark:border-slate-800"
                      }`}
                    />
                    {errors.message && (
                      <p className="text-xs text-rose-500">{errors.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isSubmitting}
                    icon={<Send className="w-4 h-4" />}
                    className="w-full"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              )}
            </div>

            {/* Direct Support & Info Column */}
            <div className="lg:col-span-5 space-y-8">
              <div className="p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-6 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">Direct Support</h3>
                    <p className="text-xs text-slate-400">Configured Email Contact</p>
                  </div>
                </div>

                <p className="text-slate-300 text-xs leading-relaxed">
                  For app support, technical feedback, or general inquiries, you can reach out directly via email.
                </p>

                <div className="pt-2">
                  <a
                    href={`mailto:${siteConfig.supportEmail}`}
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-brand-300 font-semibold text-sm border border-slate-700 transition-colors w-full justify-center"
                  >
                    <Mail className="w-4 h-4 text-brand-400" />
                    <span>{siteConfig.supportEmail}</span>
                  </a>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-3">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                  <MessageSquare className="w-4 h-4 text-brand-500" />
                  <span>Response Expectations</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  We review incoming user feedback and support messages carefully to inform future updates and bug fixes across all Fyndra Labs products.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
