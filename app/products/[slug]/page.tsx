import { Metadata } from "next";
import { notFound } from "next/navigation";
import { products, getProductBySlug } from "@/data/products";
import { ProductLayout } from "@/components/products/ProductLayout";
import { ProductHero } from "@/components/products/ProductHero";
import { ProductFeatureGrid } from "@/components/products/ProductFeatureGrid";
import { ProductHowItWorks } from "@/components/products/ProductHowItWorks";
import { ProductUseCases } from "@/components/products/ProductUseCases";
import { ProductFeatureShowcase } from "@/components/products/ProductFeatureShowcase";
import { ProductFAQ } from "@/components/products/ProductFAQ";
import { ProductCTASection } from "@/components/products/ProductCTASection";

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
    title: `${product.name} — Shared Expenses, Simplified`,
    description: `Split expenses, track balances, manage groups, and see who owes what with ${product.name}.`,
    openGraph: {
      title: `${product.name} — Shared Expenses, Simplified | Fyndra Labs`,
      description: `Split expenses, track balances, manage groups, and see who owes what with ${product.name}.`,
    },
  };
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const product = getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <ProductLayout product={product}>
      <ProductHero product={product} />
      <ProductFeatureGrid product={product} />
      <ProductHowItWorks product={product} />
      <ProductUseCases product={product} />
      <ProductFeatureShowcase product={product} />
      <ProductFAQ product={product} />
      <ProductCTASection product={product} />
    </ProductLayout>
  );
}
