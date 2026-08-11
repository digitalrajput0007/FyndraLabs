import React from "react";
import { Play } from "lucide-react";

interface PlayStoreButtonProps {
  url?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function PlayStoreButton({ url, size = "md", className = "" }: PlayStoreButtonProps) {
  const isConfigured = Boolean(url && url.trim().length > 0);

  const sizeClasses = {
    sm: "px-3.5 py-2 text-xs gap-2",
    md: "px-5 py-2.5 text-sm gap-3",
    lg: "px-6 py-3.5 text-base gap-3.5",
  };

  const buttonContent = (
    <>
      <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center shrink-0">
        <Play className="w-3.5 h-3.5 fill-current text-sky-400 ml-0.5" />
      </div>
      <div className="flex flex-col items-start leading-none text-left">
        <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
          {isConfigured ? "GET IT ON" : "STORE LINK"}
        </span>
        <span className="font-bold text-white tracking-tight mt-0.5">
          {isConfigured ? "Google Play" : "Google Play (Pending)"}
        </span>
      </div>
    </>
  );

  if (isConfigured) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center bg-slate-900 hover:bg-slate-800 dark:bg-slate-800/90 dark:hover:bg-slate-700/90 text-white rounded-xl border border-slate-700/80 shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 hover:-translate-y-0.5 ${sizeClasses[size]} ${className}`}
      >
        {buttonContent}
      </a>
    );
  }

  return (
    <div
      className={`inline-flex items-center bg-slate-900/60 dark:bg-slate-900/60 text-slate-400 rounded-xl border border-slate-800 cursor-not-allowed opacity-80 ${sizeClasses[size]} ${className}`}
      title="Google Play Store link will be active upon public app release"
    >
      {buttonContent}
    </div>
  );
}
