import React from "react";
import { Badge } from "@/components/ui/Badge";

interface PageHeaderProps {
  badge?: string;
  title: string;
  description: string;
}

export function PageHeader({ badge, title, description }: PageHeaderProps) {
  return (
    <section className="relative pt-32 pb-14 sm:pt-36 sm:pb-16 bg-slate-50 dark:bg-[#090d14] border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="w-[min(1320px,calc(100%-40px))] sm:w-[min(1320px,calc(100%-64px))] mx-auto text-center space-y-4">
        {badge && (
          <div>
            <Badge variant="primary" className="text-xs sm:text-sm px-3.5 py-1">
              {badge}
            </Badge>
          </div>
        )}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-3xl mx-auto leading-[1.1]">
          {title}
        </h1>
        <p className="text-base sm:text-[17px] lg:text-[18px] text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
      </div>
    </section>
  );
}
