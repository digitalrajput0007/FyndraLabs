import Link from "next/link";
import Image from "next/image";
import { Mail, ExternalLink } from "lucide-react";
import { siteConfig } from "@/lib/config";

export function Footer() {
  const currentYear = 2026;

  const activeSocials = Object.entries(siteConfig.socialLinks).filter(
    ([, url]) => Boolean(url) && url.trim().length > 0
  );

  return (
    <footer className="bg-slate-50 dark:bg-[#070a10] border-t border-slate-200 dark:border-slate-800/80 transition-colors">
      <div className="w-[min(1320px,calc(100%-40px))] sm:w-[min(1320px,calc(100%-64px))] mx-auto py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Col: [ Fyndra Labs Icon 40px ] Fyndra Labs (20px wordmark) */}
          <div className="md:col-span-2 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-brand-500 rounded-lg"
              aria-label="Fyndra Labs Home"
            >
              <div className="relative w-10 h-10 shrink-0">
                <Image
                  src={siteConfig.assets.icon}
                  alt={`${siteConfig.name} Icon`}
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-[20px] font-bold tracking-tight text-slate-900 dark:text-white">
                {siteConfig.name}
              </span>
            </Link>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-[15px] leading-relaxed max-w-md">
              {siteConfig.description}
            </p>
            <div className="pt-1">
              <a
                href={`mailto:${siteConfig.supportEmail}`}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors bg-white dark:bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800"
              >
                <Mail className="w-4 h-4 text-brand-500" />
                <span>Support: {siteConfig.supportEmail}</span>
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-sm sm:text-[15px] font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-4">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-sm sm:text-[15px]">
              {siteConfig.navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm sm:text-[15px] font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-4">
              Legal
            </h3>
            <ul className="space-y-2.5 text-sm sm:text-[15px] mb-4">
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>

            {/* Social Links */}
            {activeSocials.length > 0 && (
              <div>
                <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-2">
                  Connect
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeSocials.map(([platform, url]) => (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-200/50 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md transition-colors capitalize"
                    >
                      <span>{platform}</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 pt-6 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm text-slate-500 dark:text-slate-500">
          <p>© {currentYear} {siteConfig.name}. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Thoughtfully designed software & mobile applications.</p>
        </div>
      </div>
    </footer>
  );
}
