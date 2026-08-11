"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/lib/config";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pt-2 px-3 sm:px-5 pointer-events-none">
      <div
        className={`w-full max-w-[1280px] mx-auto pointer-events-auto transition-all duration-300 rounded-xl border ${
          scrolled
            ? "bg-white/95 dark:bg-[#0f1525]/95 backdrop-blur-xl border-slate-200 dark:border-slate-700/80 shadow-lg shadow-black/5 dark:shadow-black/20"
            : "bg-white/90 dark:bg-[#0f1525]/80 backdrop-blur-lg border-slate-200/80 dark:border-slate-700/50 shadow-md shadow-black/[0.03] dark:shadow-black/10"
        }`}
      >
        <div className="flex items-center justify-between h-[68px] sm:h-[76px] px-3 sm:px-5">

          {/* LEFT: 1.5x Scaled Icon + Blue FyndraLabs Text */}
          <Link
            href="/"
            className="flex items-center gap-3 shrink-0 group focus:outline-none focus:ring-2 focus:ring-brand-500 rounded-lg"
            aria-label="Fyndra Labs Home"
          >
            <div className="relative w-[52px] h-[52px] sm:w-[60px] sm:h-[60px] shrink-0 group-hover:scale-105 transition-transform duration-200">
              <Image
                src={siteConfig.assets.icon}
                alt={`${siteConfig.name} Icon`}
                width={60}
                height={60}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-brand-500 group-hover:text-brand-600 transition-colors">
              FyndraLabs
            </span>
          </Link>

          {/* CENTER: Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {siteConfig.navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative py-0.5 text-[15px] font-medium transition-colors ${
                    isActive
                      ? "text-slate-900 dark:text-white font-semibold"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavUnderline"
                      className="absolute -bottom-0.5 left-0 right-0 h-[2.5px] bg-brand-500 rounded-full"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT: Actions */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-1.5 px-5 h-[38px] text-[14px] font-semibold rounded-full text-white bg-brand-500 hover:bg-brand-600 transition-colors duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-[#0f1525]"
            >
              <span>Explore Products</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile: Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
              aria-label={mobileMenuOpen ? "Close main menu" : "Open main menu"}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="md:hidden overflow-hidden border-t border-slate-100 dark:border-slate-700/50"
            >
              <div className="px-3 pt-2 pb-3 space-y-1">
                {siteConfig.navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`block px-3 py-2 rounded-lg text-[14px] font-medium transition-colors ${
                        isActive
                          ? "bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400 font-semibold"
                          : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-700/50 mt-1">
                  <Link
                    href="/products"
                    className="flex items-center justify-center gap-1.5 w-full h-[38px] text-[14px] font-semibold rounded-full text-white bg-brand-500 hover:bg-brand-600 transition-colors"
                  >
                    <span>Explore Products</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
