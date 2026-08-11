"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 dark:bg-[#0b0f17]/90 backdrop-blur-md shadow-sm border-b border-slate-200/70 dark:border-slate-800/70 py-0"
          : "bg-transparent py-0"
      }`}
    >
      <div className="w-[min(1360px,calc(100%-40px))] sm:w-[min(1360px,calc(100%-64px))] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-[1fr_auto_1fr] items-center h-[76px] sm:h-[80px]">
          
          {/* LEFT: Fyndra Labs Brand Logo (Icon 40px, Wordmark 20px, gap 12px) */}
          <div className="flex items-center justify-start">
            <Link
              href="/"
              className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-brand-500 rounded-xl p-1"
              aria-label="Fyndra Labs Home"
            >
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 shrink-0 group-hover:scale-105 transition-transform duration-200">
                <Image
                  src={siteConfig.assets.icon}
                  alt={`${siteConfig.name} Icon`}
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
              <span className="text-lg sm:text-[20px] font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                {siteConfig.name}
              </span>
            </Link>
          </div>

          {/* CENTER: Direct Horizontal Navigation Links (NO pill capsule!) */}
          <nav className="hidden md:flex items-center justify-center gap-7 lg:gap-8">
            {siteConfig.navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`py-2 px-1 text-[15px] font-medium transition-colors relative ${
                    isActive
                      ? "text-slate-900 dark:text-white font-semibold"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-500 rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT: Action Cluster (Theme Toggle + 46px CTA Button) */}
          <div className="hidden md:flex items-center justify-end gap-3">
            <ThemeToggle />
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-5.5 h-[46px] text-[15px] font-semibold rounded-xl text-white bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 shrink-0"
            >
              <span>Explore Products</span>
              <ArrowUpRight className="w-4 h-4 opacity-80" />
            </Link>
          </div>

          {/* Mobile Buttons */}
          <div className="flex md:hidden items-center justify-end gap-2.5">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-[42px] h-[42px] flex items-center justify-center rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
              aria-label={mobileMenuOpen ? "Close main menu" : "Open main menu"}
            >
              {mobileMenuOpen ? <X className="w-5.5 h-5.5" /> : <Menu className="w-5.5 h-5.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-white/95 dark:bg-[#0b0f17]/95 border-b border-slate-200 dark:border-slate-800 backdrop-blur-lg"
          >
            <div className="px-5 pt-4 pb-6 space-y-2.5 max-w-7xl mx-auto">
              {siteConfig.navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block px-4 py-3 rounded-xl text-[16px] font-medium transition-colors ${
                      isActive
                        ? "bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400 font-semibold"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <Link
                  href="/products"
                  className="flex items-center justify-center gap-2 w-full h-[48px] px-4 text-[15px] font-semibold rounded-xl text-white bg-slate-900 dark:bg-white dark:text-slate-900 hover:opacity-95 transition-opacity"
                >
                  <span>Explore Products</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
