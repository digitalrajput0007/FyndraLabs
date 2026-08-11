import Link from "next/link";
import Image from "next/image";
import { Mail, ArrowUpRight } from "lucide-react";
import { Product } from "@/data/products";

interface ProductFooterProps {
  product: Product;
}

export function ProductFooter({ product }: ProductFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link
              href={`/products/${product.slug}`}
              className="inline-flex items-center gap-3 group focus:outline-none rounded-lg"
              aria-label={`${product.name} Home`}
            >
              <div className="relative w-9 h-9 shrink-0">
                <Image
                  src={product.icon}
                  alt={`${product.name} Icon`}
                  width={36}
                  height={36}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-extrabold tracking-tight text-white">
                  {product.name}
                </span>
                <span className="text-xs text-brand-400 font-medium">
                  {product.tagline}
                </span>
              </div>
            </Link>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              {product.description}
            </p>

            <div className="pt-2">
              <a
                href={`mailto:${product.supportEmail}`}
                className="inline-flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-white transition-colors bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700/60"
              >
                <Mail className="w-3.5 h-3.5 text-brand-400" />
                <span>Support: {product.supportEmail}</span>
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Product
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#screenshots" className="hover:text-white transition-colors">
                  Screenshots
                </a>
              </li>
              <li>
                <a href="#download" className="hover:text-white transition-colors">
                  Download
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Legal & Data
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              <li>
                <Link href={product.privacyUrl} className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href={product.termsUrl} className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href={product.deleteAccountUrl}
                  className="hover:text-rose-400 transition-colors"
                >
                  Delete Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Parent Company Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Company
            </h4>
            <div className="space-y-2 text-xs sm:text-sm text-slate-300">
              <p className="text-slate-400 text-xs">
                {product.name} is a product by Fyndra Labs.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-1 font-semibold text-brand-400 hover:text-brand-300 transition-colors pt-1"
              >
                <span>Visit Fyndra Labs</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} Fyndra Labs. All rights reserved.</p>
          <p className="flex items-center gap-1 text-slate-400">
            <span>{product.name} is built by</span>
            <Link href="/" className="font-semibold text-slate-200 hover:text-white transition-colors">
              Fyndra Labs
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
