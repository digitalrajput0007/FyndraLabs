import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  products,
  getProductBySlug,
  ProductFeature,
  HowItWorksStep,
} from "@/data/products";
import { Badge } from "@/components/ui/Badge";
import { PlayStoreButton } from "@/components/products/PlayStoreButton";
import { SplitMateMockup } from "@/components/products/SplitMateMockup";
import { ScreenshotGallery } from "@/components/products/ScreenshotGallery";
import {
  Receipt,
  ArrowLeft,
  HelpCircle,
  Zap,
  Sparkles,
  Scale,
  Users,
  UserPlus,
  FolderKanban,
} from "lucide-react";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const product = getProductBySlug(params.slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} | Fyndra Labs`,
      description: product.description,
    },
  };
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const product = getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const iconMap: Record<string, any> = {
    Receipt: Receipt,
    Scale: Scale,
    Users: Users,
    UserPlus: UserPlus,
    FolderKanban: FolderKanban,
    Sparkles: Sparkles,
  };

  return (
    <div className="bg-white dark:bg-[#0b0f17] text-slate-900 dark:text-white transition-colors">
      {/* Top Navigation Bar Link */}
      <div className="pt-28 lg:pt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors p-2 -ml-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>
      </div>

      {/* Hero Section */}
      <section className="py-6 lg:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Information */}
            <div className="lg:col-span-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
                  <Receipt className="w-6 h-6" />
                </div>
                <div>
                  <Badge variant="primary">{product.category}</Badge>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
                    {product.name}
                  </h1>
                </div>
              </div>

              <p className="text-base sm:text-lg font-medium text-brand-600 dark:text-brand-400">
                {product.tagline}
              </p>

              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                {product.description}
              </p>

              {/* Play Store CTA (only renders if URL is configured) */}
              <div className="pt-1 flex flex-wrap items-center gap-4">
                <PlayStoreButton url={product.playStoreUrl} size="lg" />
                <span className="text-xs text-slate-500 font-mono">
                  Fyndra Labs Product • {product.releaseYear}
                </span>
              </div>
            </div>

            {/* App Centerpiece Mockup */}
            <div className="lg:col-span-6">
              <SplitMateMockup />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-14 bg-slate-50/70 dark:bg-[#080c14] border-y border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Key Features</h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
              Designed for speed, accuracy, and effortless user experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {product.features.map((feat: ProductFeature, idx: number) => {
              const IconComp = (feat.icon && iconMap[feat.icon]) || Zap;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2.5 shadow-sm"
                >
                  <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                    <IconComp className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why It Exists Section */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto rounded-3xl bg-slate-900 text-white p-6 sm:p-10 border border-slate-800 shadow-xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30">
              <HelpCircle className="w-4 h-4 text-brand-400" />
              <span>Why It Exists</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 p-5 rounded-2xl bg-slate-950/80 border border-slate-800">
                <h3 className="font-bold text-rose-400 uppercase tracking-wider text-xs">
                  The Problem
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {product.whyItExists.problem}
                </p>
              </div>

              <div className="space-y-2 p-5 rounded-2xl bg-slate-950/80 border border-slate-800">
                <h3 className="font-bold text-emerald-400 uppercase tracking-wider text-xs">
                  The Fyndra Solution
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {product.whyItExists.solution}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-14 bg-slate-50/50 dark:bg-slate-950/40 border-y border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">How It Works</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {product.howItWorks.map((step: HowItWorksStep) => (
              <div
                key={step.step}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2.5 shadow-sm"
              >
                <div className="w-8 h-8 rounded-full bg-brand-600 text-white font-mono font-bold text-xs flex items-center justify-center">
                  {step.step}
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshots Showcase */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              Interface
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Application Showcase</h2>
          </div>

          <ScreenshotGallery productName={product.name} />
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-slate-900 text-white text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold">
            Try {product.name}
          </h2>
          <p className="text-slate-300 max-w-md mx-auto text-xs sm:text-sm">
            Start managing shared costs and tracking expenses effortlessly with {product.name}.
          </p>
          <div className="pt-2 flex justify-center">
            <PlayStoreButton url={product.playStoreUrl} size="lg" />
          </div>
        </div>
      </section>
    </div>
  );
}
