"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Product } from "@/data/products";

interface ProductHeaderProps {
  product: Product;
}

export function ProductHeader({ product }: ProductHeaderProps) {
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

  const navLinks = [
    { label: "Features", href: `#features` },
    { label: "How It Works", href: `#how-it-works` },
    { label: "Screenshots", href: `#screenshots` },
    { label: "FAQ", href: `#faq` },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pt-2 px-3 sm:px-5 pointer-events-none">
      <div
        className={`w-full max-w-[1240px] mx-auto pointer-events-auto transition-all duration-300 rounded-xl border ${
          scrolled
            ? "bg-white/95 dark:bg-[#0f1525]/95 backdrop-blur-xl border-slate-200 dark:border-slate-700/80 shadow-lg shadow-black/5 dark:shadow-black/20"
            : "bg-white/90 dark:bg-[#0f1525]/80 backdrop-blur-lg border-slate-200/80 dark:border-slate-700/50 shadow-md shadow-black/[0.03] dark:shadow-black/10"
        }`}
      >
        <div className="flex items-center justify-between h-[60px] sm:h-[66px] px-3.5 sm:px-5">
          {/* LEFT: SplitMate Logo + "by Fyndra Labs" badge */}
          <Link
            href={`/products/${product.slug}`}
            className="flex items-center gap-2.5 shrink-0 group focus:outline-none focus:ring-2 focus:ring-brand-500 rounded-lg"
            aria-label={`${product.name} Home`}
          >
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 shrink-0 group-hover:scale-105 transition-transform duration-200">
              <Image
                src={product.icon}
                alt={`${product.name} Logo`}
                width={40}
                height={40}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  {product.name}
                </span>
                <span className="hidden sm:inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60">
                  by Fyndra Labs
                </span>
              </div>
              <span className="sm:hidden text-[9px] font-medium text-slate-400">
                by Fyndra Labs
              </span>
            </div>
          </Link>

          {/* CENTER: Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[14px] font-medium text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* RIGHT: Product Action CTA */}
          <div className="hidden md:flex items-center gap-2">
            <a
              href="#download"
              className="inline-flex items-center justify-center gap-1.5 px-5 h-[38px] text-[13px] font-semibold rounded-full text-white bg-brand-500 hover:bg-brand-600 transition-colors duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <span>Get {product.name}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile: Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
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
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-[14px] font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-700/50 mt-1">
                  <a
                    href="#download"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 w-full h-[38px] text-[13px] font-semibold rounded-full text-white bg-brand-500 hover:bg-brand-600 transition-colors"
                  >
                    <span>Get {product.name}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
