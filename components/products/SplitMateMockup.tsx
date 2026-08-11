"use client";

import React, { useState } from "react";
import {
  Users,
  CheckCircle2,
  Plus,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Receipt,
  Sparkles,
  PieChart,
} from "lucide-react";

export function SplitMateMockup() {
  const [activeTab, setActiveTab] = useState<"balances" | "expenses" | "split">("balances");

  return (
    <div className="relative mx-auto w-full max-w-sm sm:max-w-md lg:max-w-none">
      {/* Dynamic Background Glow */}
      <div className="absolute -inset-4 bg-gradient-to-r from-brand-500/20 via-sky-500/20 to-indigo-500/20 rounded-3xl blur-2xl opacity-70 dark:opacity-40 animate-pulse-subtle pointer-events-none" />

      {/* Phone Shell */}
      <div className="relative rounded-[2.5rem] p-3 bg-slate-900 shadow-2xl border-4 border-slate-800 dark:border-slate-700/80 backdrop-blur-xl">
        {/* Phone Speaker Notch */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-900 rounded-full z-20 flex items-center justify-center">
          <div className="w-10 h-1 bg-slate-800 rounded-full" />
        </div>

        {/* Screen Container */}
        <div className="relative bg-slate-50 dark:bg-slate-950 rounded-[2rem] overflow-hidden pt-8 pb-4 px-4 sm:px-5 border border-slate-200/50 dark:border-slate-800/80 transition-colors">
          {/* App Status Bar */}
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-3 px-1">
            <span>9:41</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-brand-500/10 text-brand-600 dark:text-brand-400 font-mono">
                SplitMate v1.0
              </span>
            </div>
          </div>

          {/* App Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-brand-500/30">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                  SplitMate
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  EuroTrip 2026 Group
                </p>
              </div>
            </div>
            <button className="p-1.5 rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-950/80 dark:text-brand-400 hover:scale-105 transition-transform">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Interactive Navigation Tabs */}
          <div className="grid grid-cols-3 gap-1 bg-slate-200/60 dark:bg-slate-900 p-1 rounded-xl mb-4 text-xs font-medium">
            <button
              onClick={() => setActiveTab("balances")}
              className={`py-1.5 rounded-lg transition-all ${
                activeTab === "balances"
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-semibold"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              Balances
            </button>
            <button
              onClick={() => setActiveTab("expenses")}
              className={`py-1.5 rounded-lg transition-all ${
                activeTab === "expenses"
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-semibold"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              Expenses
            </button>
            <button
              onClick={() => setActiveTab("split")}
              className={`py-1.5 rounded-lg transition-all ${
                activeTab === "split"
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-semibold"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              Quick Split
            </button>
          </div>

          {/* Tab Content 1: Balances Overview */}
          {activeTab === "balances" && (
            <div className="space-y-3">
              {/* Overall Balance Banner */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-sky-600 text-white shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[11px] font-medium text-brand-100 uppercase tracking-wider">
                      Your Total Balance
                    </span>
                    <div className="text-2xl font-bold mt-0.5 tracking-tight">+$124.50</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-medium backdrop-blur-sm">
                    4 Members
                  </span>
                </div>
                <p className="text-[11px] text-brand-100 mt-2">You are owed overall by 2 group members.</p>
              </div>

              {/* Individual Debts List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center">
                      AL
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        Alex owes you
                      </div>
                      <div className="text-[10px] text-slate-500">AirBnB Villa Split</div>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    +$85.00
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-bold text-xs flex items-center justify-center">
                      SA
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        Sarah owes you
                      </div>
                      <div className="text-[10px] text-slate-500">Group Dinner</div>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    +$39.50
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold text-xs flex items-center justify-center">
                      MK
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        You owe Mark
                      </div>
                      <div className="text-[10px] text-slate-500">Rental Car Fuel</div>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-amber-600 dark:text-amber-400">
                    -$12.00
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content 2: Recent Expenses */}
          {activeTab === "expenses" && (
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Recent Group Activity
                </span>
                <span className="text-[10px] text-brand-600 dark:text-brand-400 font-medium">
                  Auto-Synced
                </span>
              </div>

              {[
                { title: "Tuscan Winery Tour", paidBy: "You paid", total: "$240.00", yourShare: "You lent $180.00", icon: Sparkles, color: "text-brand-500 bg-brand-50 dark:bg-brand-950/80" },
                { title: "Seafood Pasta Lunch", paidBy: "Sarah paid", total: "$118.00", yourShare: "You owe $29.50", icon: Receipt, color: "text-amber-500 bg-amber-50 dark:bg-amber-950/80" },
                { title: "Supermarket Supplies", paidBy: "Alex paid", total: "$64.20", yourShare: "You owe $16.05", icon: PieChart, color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/80" },
              ].map((exp, idx) => {
                const IconComponent = exp.icon;
                return (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between shadow-sm hover:border-brand-500/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${exp.color}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {exp.title}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {exp.paidBy} • Total {exp.total}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {exp.yourShare}
                      </div>
                      <span className="text-[9px] text-slate-400">Equal Split (1/4)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tab Content 3: Quick Split Calculator */}
          {activeTab === "split" && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <span className="text-[11px] font-medium text-slate-500">Bill Amount</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-slate-400 text-lg font-bold">$</span>
                  <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    120.00
                  </span>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Split equally among 4:</span>
                  <span className="font-bold text-brand-600 dark:text-brand-400">$30.00 / person</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-brand-50 dark:bg-brand-950/50 border border-brand-200/60 dark:border-brand-800/60 text-xs space-y-2">
                <div className="flex items-center gap-2 font-semibold text-brand-700 dark:text-brand-300">
                  <Sparkles className="w-4 h-4 text-brand-500" />
                  <span>Smart Debt Simplification</span>
                </div>
                <p className="text-[11px] text-brand-900/80 dark:text-brand-200/80 leading-relaxed">
                  SplitMate automatically reduces 6 multi-person debts down to just 2 simple payments.
                </p>
              </div>
            </div>
          )}

          {/* Bottom Action Footer */}
          <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>All Balances Settled Up</span>
            </div>
            <div className="text-[10px] text-slate-400">Fyndra Labs Studio</div>
          </div>
        </div>
      </div>
    </div>
  );
}
